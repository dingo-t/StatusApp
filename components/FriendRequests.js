import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/authContext';
import { query, where, getDocs, collection, doc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db, } from '../firebaseConfig'; 





const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const {user} = useAuth();

  

const fetchFriendRequests =  async () => {
    const currentUser = user?.userId;
    try {
        if (currentUser) {
          const q = query(
            collection(db, 'friendRequests'), 
            where('receiverId', '==', currentUser)
          );
    
          const querySnapshot = await getDocs(q);

          let friendRequests = [];
          querySnapshot.forEach((doc) => {
            friendRequests.push({ id: doc.id, ...doc.data() });
          });
    
         // console.log('Friend Requests: ', friendRequests);
          setRequests(friendRequests);
          return friendRequests;


        } else {
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
}


  useEffect(() => {
    fetchFriendRequests();
}, []);

    
const handleAccept =  async (senderId, receiverId) => {
    try {

        const userDocRef = doc(db, 'users', receiverId);
    
        await updateDoc(userDocRef, {
          friends: arrayUnion(senderId), 
        });

        const friendDocRef = doc(db, 'users', senderId);
    
        await updateDoc(friendDocRef, {
          friends: arrayUnion(receiverId), 
        });

    
        console.log(`Friend with ID ${senderId} added successfully.`);
      } catch (error) {
        console.error('Error adding friend: ', error);
      }

      handleDecline(senderId, receiverId);
}




const handleDecline =  async (senderId, receiverId) => {

    console.log('paramscheck', senderId, receiverId);

    const FriendRequestDocName = `${senderId}-${receiverId}`;

    console.log('var check', FriendRequestDocName);

try {
    const docRef = doc(db, 'friendRequests', FriendRequestDocName)

    await deleteDoc(docRef);

    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error removing document: ', error);
  }
}

  const renderRequest = ({ item }) => (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: 10, 
      padding: 10, 
      borderWidth: 1, 
      borderColor: '#ccc', 
      borderRadius: 5 
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.senderUsername}</Text>
      <Text style={{ fontSize: 16, color: 'gray' }}>{item.status}</Text>
      
      <TouchableOpacity style={{ 
        backgroundColor: 'green', 
        padding: 10, 
        borderRadius: 5, 
        marginRight: 5,
      }}
      onPress={() => handleAccept(item.senderId, item.receiverId)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold'}}>Accept</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ 
        backgroundColor: 'red', 
        padding: 10, 
        borderRadius: 5 
      }}
      onPress={() => handleDecline(item.senderId, item.receiverId)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Decline</Text>
      </TouchableOpacity>
      
    </View>
    
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Friend Requests
      </Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No Friend Requests</Text>}
      />
    </View>
  );
};

export default FriendRequests;

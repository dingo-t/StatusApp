import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/authContext';
import { query, where, getDocs, collection, doc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db, } from '../firebaseConfig'; 

// this component renders out each request that has been sent to the current user
// it also allows the user to accept or decline requests
const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const {user} = useAuth();

  
// this function retreives the friend requests for the current user 
const fetchFriendRequests =  async () => {
    const currentUser = user?.userId;
    try {
        // if the user has an id the friendRequests collection will be scanned for documents
        // where the id of the receiver equals the id of the current user
        if (currentUser) {
          const q = query(
            collection(db, 'friendRequests'), 
            where('receiverId', '==', currentUser)
          );
    
          const querySnapshot = await getDocs(q);
          // each friend request is pushed to the friendRequests state
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

// this function handles the acceptance of a friend request
const handleAccept =  async (senderId, receiverId) => {
    try {
        // the user data of the current user is found
        const userDocRef = doc(db, 'users', receiverId);
    
        // the id of the sender is added to the friends object in the users document
        await updateDoc(userDocRef, {
          friends: arrayUnion(senderId), 
        });

        // the same is then done for the user who sent the message
        const friendDocRef = doc(db, 'users', senderId);
    
        await updateDoc(friendDocRef, {
          friends: arrayUnion(receiverId), 
        });

    
        console.log(`Friend with ID ${senderId} added successfully.`);
      } catch (error) {
        console.error('Error adding friend: ', error);
      }
      // the handle decline function is then called to delete the request since it is no longer needed
      handleDecline(senderId, receiverId);
    }



  // this function deletes the friend request sent to the user 
  const handleDecline =  async (senderId, receiverId) => {

      console.log('paramscheck', senderId, receiverId);

      // the parameters are added together to get the id of the request
      const FriendRequestDocName = `${senderId}-${receiverId}`;

      console.log('var check', FriendRequestDocName);

  try {
      const docRef = doc(db, 'friendRequests', FriendRequestDocName)
      // the document is found and deleted
      await deleteDoc(docRef);

      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  }

  useEffect(() => {
    fetchFriendRequests();
  }, []);


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

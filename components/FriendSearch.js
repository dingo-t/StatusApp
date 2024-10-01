import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getDocs, query, collection, where, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { useAuth } from '../context/authContext'; 


// this component allows users to search for and add friends
export default function FriendSearch() {
  const { user } = useAuth(); 
  const [users, setUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
  // when the add friend button is pressed this function is called to create the friend request
  const addFriend = async (friendId, friendUsername) => {
    try {
      // friend request structure
      const friendRequest = {
        senderId: user?.uid,
        senderUsername: user?.username,
        senderProfileUrl: user?.profileUrl,
        receiverId: friendId,
        receiverUsername: friendUsername,
        status: 'pending',
        timestamp: new Date(),
      };
      // the document is created
      await setDoc(doc(db, 'friendRequests', user?.uid + '-' + friendId), friendRequest);
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text>{item.username}</Text>
      <Text>{item.userId}</Text>
      <Pressable onPress={() => addFriend(item.userId, item.username, item.profileUrl)} style={{ backgroundColor: '#037c6e', padding: 10, borderRadius: 5, marginTop: 5 }}>
        <Text style={{ color: 'white' }}>Add Friend</Text>
      </Pressable>
    </View>
  );
  

  // the users state is set with data retreived from the database
  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, 'users'), where('userId', '!=', user?.uid));
      const querySnapshot = await getDocs(q);
      let usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
      setLoading(false);
    };

    getUsers();
  }, [user?.uid]);

// the search inputs are filtered as to not be case sensitive
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);


  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Search for friends..."
        placeholderTextColor="black"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          marginBottom: 10,
        }}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </View>
  );
};

import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getDocs, query, collection, where, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { useAuth } from '../context/authContext'; 

export default function FriendSearch() {
  const { user } = useAuth(); 
  const [users, setUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  

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


  const addFriend = async (friendId, friendUsername) => {
    try {
      const friendRequest = {
        senderId: user?.uid,
        senderUsername: user?.username,
        senderProfileUrl: user?.profileUrl,
        receiverId: friendId,
        receiverUsername: friendUsername,
        status: 'pending',
        timestamp: new Date(),
      };
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
      <Pressable onPress={() => addFriend(item.userId, item.username, item.profileUrl)} style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 5 }}>
        <Text style={{ color: 'white' }}>Add Friend</Text>
      </Pressable>
    </View>
  );



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

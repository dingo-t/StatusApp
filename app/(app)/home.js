import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { usersRef, db } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

// This page contains a list of all users the currently signed in user is friends with
// It allows the user to easily chat with any friend the user desires
// It is also the index page and is where the user is first sent to upon entering the app

export default function Home() {
  const {logout, user} = useAuth();
  const [users, setUsers] = useState([]);

  // the users array is updated whenever the component is rendered to ensure the information is up to date
  useEffect(() => {
    if (user?.uid) {
        getUsers();
    }
}, [user]);

// users data is retreived from the database
const getUsers = async () => {
    try {
        // references the current users document in the users collection
        const userDoc = await getDoc(doc(db, 'users', user.uid)); 
        // each friends variable in the current users document is mapped into the friends constant
        const friends = userDoc.data()?.friends || []; 

        // if there are 0 friends the function will return
        if (friends.length === 0) {
            setUsers([]); 
            return;
        }

        
        const q = query(usersRef, where('userId', 'in', friends)); 

        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data() });
        });

        setUsers(data); 
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

  console.log(users)

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='light' />

      {
        users.length>0? (
            <ChatList currentUser={user} users={users} />
        ):(
            <View className="fex items-center" style={{top: hp(30)}}>
                <ActivityIndicator size='large' />
            </View> 
        )
      }
    </View>
  )
}
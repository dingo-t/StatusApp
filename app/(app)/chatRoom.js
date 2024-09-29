import { View, Text, TextInput, TouchableOpacity, Alert} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { useAuth } from '../../context/authContext';
import { getRoomId } from '../../utils/common';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Keyboard } from 'react-native';

// This page is where the user chats with the currently selected friend
// It allows the user to both send and receive messages in real time

export default function ChatRoom() {
    const item = useLocalSearchParams(); 
    const {user} = useAuth(); 
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

   // The useEffect hook runs everytime the page is loaded and retreives 
   // the message data from the firestore document
    useEffect(()=>{
      // if no document exists for the chatroom this function is called to create one
      createRoomIfNotExsists();

      // this block of code accesses the chatroom collection and receives then orders the data to be displayed in order
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      // the ordered message data is added to the local state variable
      let unsub = onSnapshot(q, (snapshot)=>{
          let allMessages = snapshot.docs.map(doc=>{
            return doc.data();
          })
          setMessages([...allMessages]);
      });

      // this function allows the user to scroll when using the keyboard so that they still view the entire page
      const KeyboardDidShowListener = Keyboard.addListener(
        'keyboardDidHide', updateScrollView
      )

      // this adds the keyboard scroll functionality to the UI
      return ()=>{
        unsub();
        KeyboardDidShowListener.remove();
      }

    }, []);

    // The useEffect hook runs the scroll view function whenever a new message is added
    useEffect(()=>{
      updateScrollView();
    },[messages])

    // this function scrolls the user to the bottom of the page automatically when a new message is added
    const updateScrollView = ()=>{
      setTimeout(()=>{
        // setting animated to true makes the page scroll down smoothly instead of instantly
        scrollViewRef?.current?.scrollToEnd({animated: true})
      },100)
    }


     // This function creates a firebase document to save and receive the messages sent between users
    const createRoomIfNotExsists = async ()=>{
        // the id of the room is created the ids of both users
        let roomId = getRoomId(user?.userId, item?.userId);
        // the room is created and the time is recorded
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            CreatedAt: Timestamp.fromDate(new Date())
        });
    }

    // This function adds any new messages to the chatroom document
    const handleSendMessage = async ()=>{
      // gets message from the input field
      let message = textRef.current.trim();
      // if the message is undefined the function exits
      if(!message) return;
      try{
        // the current roomId is found from the user and friend ids
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, 'rooms', roomId);
        // the messages collection inside the room document is found
        const messagesRef = collection(docRef, "messages")
        // the textRef variable is reset and the input field cleared
        textRef.current = "";
        if(inputRef) inputRef?.current?.clear();

        // a new message document is added to the messages collection for the current room
        const newDoc = await addDoc(messagesRef, {
            userId: user?.userId,
            text: message,
            profileUrl: user?.profileUrl,
            senderName: user?.username,
            createdAt: Timestamp.fromDate(new Date())
        });


       // console.log('new message id: ', newDoc.id);
      }catch(err){
        Alert.alert('message', err.message);
      }
    }

    // console.log('messages: ', messages);
  return (
  <CustomKeyboardView inChat={true}>
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} router={router} />
      <View className="h-3 border-b border-neutral-300" />
      <View className="flex-1 justify-between bg-neutral-100 overflow-visible" >
        <View style={{flex: 1}}>
            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user}/>
        </View>
        <View style={{marginBottom: hp(2.7)}} className="pt-2">
                <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
                    <TextInput
                        ref={inputRef}
                        onChangeText={value=> textRef.current = value}
                        placeholder='Type message...'
                        style={{fontSize: hp(2), flex: 1, marginRight: 0}}                   
                    />
                    <TouchableOpacity onPress={handleSendMessage} className="bg-neutral-200 pg-2 mr-[1px] rounded-full">
                        <Feather name="send" size={hp(2.7)} color="#737373" />
                    </TouchableOpacity>
                </View>   
        </View> 
      </View>
    </View>
  </CustomKeyboardView>
  )
}
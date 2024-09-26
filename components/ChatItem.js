import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { blurhash, formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';


// this is a component that is rendered on the home page of the app to show the list of friends that can be messaged
export default function ChatItem({item, router, currentUser}) {

    const [lastMessage, setLastMessage] = useState(undefined);
    useEffect(()=>{
  
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));
  
        let unsub = onSnapshot(q, (snapshot)=>{
            let allMessages = snapshot.docs.map(doc=>{
              return doc.data();
            });
            setLastMessage(allMessages[0]? allMessages[0]: null);
        })
  
        return unsub;
      }, []);

     // console.log('last message: ', lastMessage);

    const openChatRoom = ()=> {
        router.push({pathname: '/chatRoom', params: item});
    }

    const renderTime = ()=>{
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    }

    const renderLastMessage = ()=>{
        if(typeof lastMessage == 'undefined') return 'Loading...';
        if(lastMessage){
            if(currentUser?.userId == lastMessage?.userId) return "You: "+lastMessage?.text;
            return lastMessage?.text;
        }else{
            return 'Say Hi 👋';
        }
    }
  return (
    <TouchableOpacity onPress={openChatRoom} style={{ 
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottomWidth: 1, 
            borderBottomColor: '#E5E7EB'
            }}>
        {/* <Image  
            source={{uri: item?.profileUrl }} 
            style={{height: hp(6), width: hp(6) }} 
            className="rounded-full"
        /> */}

        <Image 
            style={{height: hp(6), width: hp(6), borderRadius: 100}}
            source={{uri: item?.profileUrl}}
            placeholder={blurhash}
            transition={500}
        />

        <View className="flex-1 gap-1">
            <View className="flex-row justify-between">
                <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-800">{item?.username}</Text>
                <Text style={{fontSize: hp(1.6)}} className="font-medium text-neutral-500">
                   {/*  {renderTime()} */}
                </Text>
            </View>
            <Text style={{fontSize: hp(1.6)}} className="font-medium text-neutral-500">
              {/*   {renderLastMessage()} */}
            </Text>
        </View>
    </TouchableOpacity>
  )
}
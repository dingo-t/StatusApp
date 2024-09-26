import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'

// this components iterates over the users array after it has been filtered to only include the current users friends
// each object inside the array is then sent to a ChatItem component and rendered onto the page in a top down list
export default function ChatList({users, currentUser}) {
    const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
            data={users}
            contentContainerStyle={{flex: 1, paddingVertical: 15}}
            keyExtractor={item=> Math.random()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index})=> <ChatItem 
                router={router} 
                currentUser={currentUser}
                item={item} 
                index={index} 
         />}
        />
    </View>
  )
}
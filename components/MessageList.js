import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'

// this component maps out each object in the messages variable and sends it to the messageItem component to be rendered
export default function MessageList({messages, scrollViewRef,currentUser}) {
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 10}}>
      {
        messages.map((message, index)=>{
            return (
              <MessageItem message={message} key={index} currentUser={currentUser} />
            )
        })
      }
    </ScrollView>
  )
}
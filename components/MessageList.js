import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import MessageItem from './MessageItem';

// this component maps out each object in the messages variable and sends it to the messageItem component to be rendered
export default function MessageList({ messages, scrollViewRef, currentUser }) {
  let index = 0;
  let messageItems = [];

  while (index < messages.length) {
    messageItems.push(
      <MessageItem message={messages[index]} key={index} currentUser={currentUser} />
    );
    index++;
  }

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
      {messageItems}
    </ScrollView>
  );
}

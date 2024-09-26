import { View, Text } from 'react-native'
import React from 'react'
import FriendSearch from '../../components/FriendSearch';
import FriendRequests from '../../components/FriendRequests';

// This page shows the user any friend requests they have received and allows them to search for new friends to add
export default function findFriends() {
  return (
    <>
        <FriendRequests></FriendRequests>
        <FriendSearch></FriendSearch>
    </>
  )
}
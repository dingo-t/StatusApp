import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../components/HomeHeader'

// this component passes title parameters to the header component depending on the users current page
export default function _layout() {
  return (
    <Stack>
    {/*  each Stack.Screen element creates the header for its assigned page */}
      <Stack.Screen
        name="home"
        options={{
          header: ()=> <HomeHeader title="Home"/>
        }}
      />
       <Stack.Screen
        name="mapRoom"
        options={{
          header: ()=> <HomeHeader title="User Map"/>
        }}
      />
         <Stack.Screen
        name="findFriends"
        options={{
          header: ()=> <HomeHeader title="Find Friends"/>
        }}
      />
    </Stack>
  )
}
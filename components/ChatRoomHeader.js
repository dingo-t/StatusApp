import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';

// this is the header component for the chatroom
// It contains a back array to return to the home page
export default function ChatRoomHeader({user, router}) {
  return (
    <Stack.Screen 
        options={{
            title: '',
            headerShadowVisible: false,
            headerLeft: ()=>(
                <View className="flex-row items-center gap-4">
                    {/* the back arrow sends the user back to the home page */}
                    <TouchableOpacity onPress={()=> router.back()}>
                        <Entypo name="chevron-left" size={hp(4)} color="#737373" />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-3">
                        {/* the friends profile picture is displayed */}
                        <Image
                            source={user?.profileUrl}
                            style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}}
                        />
                        <Text style={{fontSize: hp(2.5)}} className="text-neutral-700 font-medium">
                            {user?.username} {/* the friends uersname is displayed */}
                        </Text>
                    </View>
                </View>
            ), // these are placeholder icons to fill up the space but may have functionality added later
            headerRight: ()=>(
                <View className="flex-row items-center gap-8">
                    <Ionicons name="call" size={hp(2.8)} color={'#737373'} />
                    <Ionicons name="videocam" size={hp(2.8)} color={'#737373'} />
                </View>
            )
        }}
    />
  )
}
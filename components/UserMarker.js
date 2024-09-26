import { View, Text, Image } from 'react-native'
import React from 'react'

// this component contains the styling information for the markers used in the mapview page
export default function UserMarker() {
  return (
    <Marker coordinate={userLocation} opacity={1}>
    <View style={{ width: 50, height: 50}}>
        <Image
            source={{ uri: user?.profileUrl }} 
            style={{
                width: 50,
                height: 50,
                borderRadius: 25, 
                borderWidth: 1,
                borderColor: 'white',
              }}
        />              
        <Text style={{fontSize: hp(2), color: 'white', textAlign: 'center'}}>{user?.username}</Text>      
    </View>
</Marker>
  )
}
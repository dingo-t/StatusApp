import {View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

// the index behaviour is overidden by the routing is _layout.js
export default function StartPage() {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator  size="large" color="gray"/>
        </View>
    )
}
import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

// the custom keyboard view allows the user to continue scrolling the page when typing into an input field
const ios = Platform.OS == 'ios';
export default function CustomKeyboardView({children, inChat}) {
    let kavConfig = {};
    let scrollViewConfig = {};
    if(inChat){
        kavConfig = {keyboardVerticalOffset: 90};
        scrollViewConfig = {contentContainerStyle: {flex: 1}};
    }
  return (
        <KeyboardAvoidingView
            behavior={ios? 'padding': 'height'} 
            style={{flex: 1}}
            {...kavConfig}
        >
            <ScrollView
                style={{flex: 1}}
                bounces={false}
                showsVerticalScrollIndicator={false}
                {...scrollViewConfig}
            >
                {
                    children
                }
            </ScrollView>
        </KeyboardAvoidingView>
  )
}
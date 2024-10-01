import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

// the custom keyboard view allows the user to continue scrolling the page when typing into an input field
// since there is slightly different behavour for this component on IOS and Andriod 
// it is important to determine which OS the user is on
const ios = Platform.OS == 'ios';
export default function CustomKeyboardView({children, inChat}) {
    let kavConfig = {};
    let scrollViewConfig = {};
    // if the user is in the chat screen 90 units of height will be 
    // added when the keyboard is opened so that their message is still visible
    if(inChat){
        kavConfig = {keyboardVerticalOffset: 90};
        scrollViewConfig = {contentContainerStyle: {flex: 1}};
    }
  return (
        <KeyboardAvoidingView
            // IOS uses padding and Andriod uses height
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
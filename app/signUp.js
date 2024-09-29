import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';


export default function SignUp() {
    const router = useRouter();
    const {register} = useAuth();
    const [loading, setLoading] = useState(false);

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");

    // this function sends the user data to the authContext component to be added to the firestore database by using a parameter to pass it to the register function
    // the register function will add the users email and password to the authentication field in firebase
    // the username, userId, and profileUrl will be sent to a document 
    const handleRegister = async ()=>{
      if(!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current){
        Alert.alert('Sign Up', "Please fill all the fields")
        return;
      }
      setLoading(true);

      let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
      setLoading(false);

      console.log('got result: ', response);
      if(!response.success){
        Alert.alert('Sign Up,', response.msg);
      }
    }
    
  return (  
    loading? (
      <View className="fex items-center" style={{top: hp(30)}}>
          <ActivityIndicator size='large' />
      </View> 
    ):(
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View className="flex-1 gap-12">
        {/* signup image*/}
        <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className="items-center">
          <Image style={{height: hp(30)}} resizeMode='contain' source={require('../assets/images/friends.jpg')} />
        </View>

        <View className="gap-10">
          <Text style={{fontSize: hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
          {/* inputs */}
          <View className="gap-4">

            <View style={{height: hp(7), marginHorizontal: wp(5)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Feather name="user" size={hp(2.7)} color="gray" />
                <TextInput
                    onChangeText={value=> usernameRef.current=value}
                    style={{fontSize: hp(2)}}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder='Username'
                    placeholderTextColor={'gray'}
                />
            </View>

           
            <View style={{height: hp(7), marginHorizontal: wp(5)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                    onChangeText={value=> emailRef.current=value}
                    style={{fontSize: hp(2)}}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder='Email address'
                    placeholderTextColor={'gray'}
                />
            </View>

            <View style={{height: hp(7), marginHorizontal: wp(5)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                      onChangeText={value=> passwordRef.current=value}
                      style={{fontSize: hp(2)}}
                      className="flex-1 font-semibold text-neutral-700"
                      placeholder='Password'
                      secureTextEntry
                      placeholderTextColor={'gray'}
                />  
            </View>
             
            <View style={{height: hp(7), marginHorizontal: wp(5)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Feather name="image" size={hp(2.7)} color="gray" />
                <TextInput
                    onChangeText={value=> profileRef.current=value}
                    style={{fontSize: hp(2)}}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder='Profile url'
                    placeholderTextColor={'gray'}
                />

            </View>
         
            {/* submit button*/}

            <View>
    
                    <TouchableOpacity onPress={handleRegister} style={{backgroundColor: "#5252ad", marginHorizontal: wp(5), borderRadius: 13,  justifyContent: 'center', alignItems: 'center', height: hp(6.5)}} >
                      <Text style={{fontSize: hp(2.7), }} className="text-white font-bold tracking-wider">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
   
            </View>

          

            {/* sign up text */}

            <View className="flex-row justify-center">
                <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-500">Already have an account?</Text>
              <Pressable onPress={()=> router.push('signIn')}>
                <Text style={{fontSize: hp(1.8)}} className="font-bold text-indigo-500">Sign In</Text>
              </Pressable>
             
            </View>

          </View>
          <Text className="text-center align-bottom"> Artwork by TheImg / Shutterstock.com</Text>
          </View>
        </View>
      </CustomKeyboardView>
     ) )
}
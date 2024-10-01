import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

// the sign in page is the first page a non authenticated user sees
// it allows the user to sign in with their existing account using their username and password 
// or to navigate to the sign up page to create an account
export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const emailRef = useRef("");
    const passwordRef = useRef("");

    // this function sends the input from the login fields provided by the user to the firebase 
    // database to be verified
    // if the email and password match an account the user will be signed in
    // if not the user will be shown a pop up error
    // this error does not cause the program to crash or break and the user can simply attempt to sign in again
    const handleLogin = async ()=>{
      if(!emailRef.current || !passwordRef.current){
        Alert.alert('Sign In', "Please fill all the fields")
        return;
      }

      setLoading(true);
      const response = await login(emailRef.current, passwordRef.current);
      setLoading(false);
      console.log('sign in response: ', response);
      if(!response.success){
        Alert.alert('Sign In,', response.msg);
      }

    }
  return ( /* the loading icon is rendered until the data has been retreived  */
    loading? (
      <View className="fex items-center" style={{top: hp(30)}}>
          <ActivityIndicator size='large' />
      </View> 
  ):(
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View className="flex-1 gap-12">
        {/* signup image*/}
        <View style={{paddingTop: hp(8), paddingHorizontal: wp(5)}} className="items-center">
          <Image style={{height: hp(25)}} resizeMode='contain' source={require('../assets/images/lake-blue.jpg')} />
        </View>

        <View className="gap-10">
          <Text style={{fontSize: hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">Sign In</Text>
          {/* inputs */}
          <View className="gap-4">

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

            <View className="gap-3">
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
             {/*  <Text style={{ fontSize: hp(1.8), marginHorizontal: wp(6), textAlign: 'right', color: "gray" }} className="font-semibold">Forgot password?</Text> */}
            </View>

            {/* submit button*/}

            <View>
           
                    <TouchableOpacity onPress={handleLogin} style={{backgroundColor: "#037c6e", marginHorizontal: wp(5), borderRadius: 13,  justifyContent: 'center', alignItems: 'center', height: hp(6.5)}} >
                      <Text style={{fontSize: hp(2.7), }} className="text-white font-bold tracking-wider">
                        Sign in
                      </Text>
                    </TouchableOpacity>

            </View>

          

            {/* sign up text */}

            <View className="flex-row justify-center">
                <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-500">Don't have an account? </Text>
              <Pressable onPress={()=> router.push('signUp')}>
                <Text style={{fontSize: hp(1.8)}} className="font-bold text-indigo-700">Sign Up</Text>
              </Pressable>
             
            </View>
       
          </View>
        </View> {/* attributions */}
        <Text className="text-center align-bottom"> Artwork by Samui / Shutterstock.com</Text>
        <Text className="text-center align-bottom"> Icons by Octicons, Feather, FontAwesome5, Entypo and AntDesign</Text>
      </View>
      </CustomKeyboardView>
  ))
}
import { View, Text } from 'react-native'
import React, { useEffect} from 'react'
import {Slot, useSegments, useRouter } from "expo-router";
import "../global.css";
import { AuthContextProvider, useAuth } from '../context/authContext';
import { MenuProvider } from 'react-native-popup-menu';

// this layout page handles the authentication of previously signed in users
// if a user is reloading the app after signing in they will not have to sign in again
// and will instead be sent straight to the home page
const MainLayout = ()=>{
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter(); 

    useEffect(()=>{
        // checks if user is authenticated
        if(typeof isAuthenticated=='undefined') return;
        const inApp = segments[0]=='(app)';
        if(isAuthenticated && !inApp){
            // the user is then redirected to home page if they are signed in
            router.replace('home');
        }else if(isAuthenticated==false){
            // if they have not been authenticated they will be sent to the signin page
            router.replace('signIn');
        }
    }, [isAuthenticated])

    return <Slot />
}

// this component passes the users authentication state and other variables from the AuthContext component
export default function RootLayout() {
  return (
    <MenuProvider>
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    </MenuProvider>
  )
}
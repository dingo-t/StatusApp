
import { initializeApp } from "firebase/app";

import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {collection, getFirestore} from 'firebase/firestore'

// these are the configuration keys that tells firestore what database to connect to
const firebaseConfig = {
  apiKey: "AIzaSyBe5KoaWOZhk4UsszEGuilP3CzC1UZRHps",
  authDomain: "fir-status-34d59.firebaseapp.com",
  projectId: "fir-status-34d59",
  storageBucket: "fir-status-34d59.appspot.com",
  messagingSenderId: "856736163993",
  appId: "1:856736163993:web:c88cb999a57e63cf223008"
};

// this initilises firebase for the app
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

// references to the most commonly accessed collections are exported for easy use throughout the app
export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');


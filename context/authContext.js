import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc} from "firebase/firestore";

export const AuthContext = createContext(); 

// this component defines functions for all authstate change events
// it also sends the user data to the rest of the app components so user data does not need to be continuosly 
// retreived from the firestore database
export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const latitude = '0';
    const longitude = '0';
    const friends = '';
     
    useEffect(()=> {
         const unsub = onAuthStateChanged(auth, (user)=>{
          //  console.log('auth state has changed', isAuthenticated)
            if(user){            
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user, user.uid)             
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
         });
         return unsub;
    },[]);

    const updateUserData = async (userdata, userId)=>{
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({...userdata, username: data.username, profileUrl: data.profileUrl, userId: data.userId})
        }
    }

    const login = async (email, password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email'
            if(msg.includes('(auth/invalid-credential)')) msg='Wrong credentials'
            return {success: false, msg};
        }
    }
    const logout = async (email, password)=>{
        try{
            await signOut(auth);
            return {success: true}
        }catch(e){
            return {success: false, msg: e.message, error: e};
        }
    }
    const register = async (email, password, username, profileUrl)=>{
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user :', response?.user);

           // setUser(response?.user);
           // setIsAuthenticated(true);
          
           await setDoc(doc(db, "users", response?.user?.uid),{
                username,
                profileUrl,
                userId: response?.user?.uid,
                latitude,
                longitude,
                friends,
           });

        return {success: true, data: response?.user};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email'
            if(msg.includes('(auth/email-already-in-use)')) msg='This email is already in use'
            return {success: false, msg};
        }
    }


    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth needs to be wrapped inside auth context provider')
    }
    return value;
}
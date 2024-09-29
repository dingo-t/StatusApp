import { View, Text, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { usersRef, db, locationsRef, } from '../firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


// this component presents a map of the users current region and creates markers for each of the users friends
export default function MapComponent() {

  const [loading, setloading] = useState(true);

  const {user} = useAuth();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    if (user?.uid) {
        getUsers();
    }
}, [user]);

const getUsers = async () => {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid)); 
        const friends = userDoc.data()?.friends || []; 

        if (friends.length === 0) {
            setUsers([]); 
            return;
        }

        const q = query(usersRef, where('userId', 'in', friends)); 

        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data() });
        });

        setUsers(data); 
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

  //console.log(users)
  



  const [userLocation, setuserLocation] = useState();
  const [usersLocations, setusersLocations] = useState();

  const getUserLocation = async () => {

    let {status} = await Location.requestForegroundPermissionsAsync(); 
    if (status !== 'granted') {
        Alert.alert('Location Access Denied');
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    setuserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    try {
        const userLocationRef = doc(db, 'users', user?.userId);

        await updateDoc(userLocationRef, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    
       // console.log('Location updated successfully');
      } catch (error) {
        console.error('Error updating location: ', error);
      }
   // console.log(location.coords.latitude, location.coords.longitude)
   // console.log("full location data", location)
   setloading(false);
  }




  useEffect(() => {
    getUserLocation();
  }, []);

  //console.log("users locations", users)

  if (loading) {
    return (
      <View className="fex items-center" style={{top: hp(30)}}>
          <ActivityIndicator size='large' />
      </View> 
    );
  }
  return (
    <View>
        <MapView
            style={{width: '100%', height: '100%'}} 
            region={userLocation}
            showsUserLocation
        >
         {users.map((users) => (
          <Marker
            key={users.userId}
            coordinate={{
              latitude: users.latitude, 
              longitude: users.longitude, 
            }}
            title={users.username}
          >
            <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: users.profileUrl }} 
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25, 
                  borderWidth: 1,
                  borderColor: 'white',
                }}
              />
              <Text style={{ fontSize: 12, textAlign: 'center' , color: 'white'}}>
                {users.username}
              </Text>
            </View>
          </Marker>
         ))}
        </MapView>
    </View>
  )
}
import { View, Text, Platform } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../context/authContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';
import { AntDesign, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ios = Platform.OS=='ios';


export default function HomeHeader({title}) {
    
    const router = useRouter();
    const {user, logout} = useAuth();
    const {top} = useSafeAreaInsets();

    const handleProfile = ()=> {
    }

    const handleLogout = async ()=> {
      await logout();
    }

    const navigateToFriends = () => {
      router.push('/findFriends'); 
    };

    const navigateToMap = () => {
      router.push('/mapRoom'); 
    };

    const navigateToChat = () => {
      router.push('/home'); 
    };


  return (
    <View style={{paddingTop: ios? top:top+10}} className="flex-row justify-between px-5 bg-indigo-300 pb-6 rounded-b-3xl shadow">
      <View>
        <Text style={{fontSize: hp(3)}} className="font-medium text-white">{title}</Text>
      </View>
      <View>
      <Menu>
        <MenuTrigger customStyles={{
          triggerWrapper: {}
        }}>
            <Image
              style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
              source={user?.profileUrl}
              placeholder={blurhash}
              transition={500}
            />
        </MenuTrigger>
        <MenuOptions
            customStyles={{
              optionsContainer: {
                  borderRadius: 10,
                  borderCurve: 'continuous',
                  marginTop: 40,
                  marginLeft: -30,
                  backgroundColor: 'white',
                  shadowOpacity: 0.2,
                  shadowOffset: {width: 0, height: 0},
                  width: 160
              }
            }}
        >
          <MenuItem 
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem 
              text="Friends"
              action={navigateToFriends}
              value={null}
              icon={<FontAwesome5 name="user-friends" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem 
              text="Chat"
              action={navigateToChat}
              value={null}
              icon={<Entypo name="chat" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem 
              text="Map"
              action={navigateToMap}
              value={null}
              icon={<Entypo name="map" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem 
              text="Sign Out"
              action={handleLogout}
              value={null}
              icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
            />
        </MenuOptions>
      </Menu>
      
      </View>
    </View>
  )
}

// the divider adds a grey line between menu items for aesthetic purposes 
const Divider = ()=>{
  return (
    <View className="p-[1px] w-full bg-neutral-200" />
  )
}
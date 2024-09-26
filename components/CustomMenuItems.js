import {MenuOption} from 'react-native-popup-menu';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text } from 'react-native';

// the menu item is an element in the dropdown menu that can be accessed via tapping on the users profile picture in the home header
export const MenuItem = ({text, action, value, icon})=>{
    return (
        <MenuOption onSelect={()=> action(value)}>
            <View className="px-4 py-1 flex-row justify-between items-center">
                <Text style={{fontSize: hp(1.7)}} className="font-semibold text-neutral-600">
                    {text}
                </Text>
               
            </View>
        </MenuOption>
    )
}
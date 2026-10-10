import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {HandymanContext} from '../../../../functions/Contexts';
import HandymanHome from './HandymanHome';
import HandymanBookings from './HandymanBookings';
import HandymanChat from './HandymanChat';
import HandymanNewBooking from './HandymanNewBooking';
import HandymanList from './HandymanList';
import HandymanProfile from './HandymanProfile';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ServiceRequestScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingHome" component={HandymanBookings} options={{headerShown: false}} />
      <Stack.Screen name="HandymanNewBooking" component={HandymanNewBooking} options={{headerShown: false}} />
      <Stack.Screen name="HandymanList" component={HandymanList} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function HandymanScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HandymanList" component={HandymanList} options={{headerShown: false}} />
      <Stack.Screen name="HandymanProfile" component={HandymanProfile} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const HandymanNavigator = (props: any) => {
  const [activeServices, setActiveServices] = useState<any[]>([]);

  useEffect(() => {
    const eventListener = EventRegister.addEventListener('updateHandymanServices', (data: any) => {
      setActiveServices([...activeServices, data]);
    });

    return () => {
      if (typeof eventListener == 'string') EventRegister.removeEventListener(eventListener);
    };
  });

  const bottomTools = [
    {destination: 'HandymanHome', icon: 'home-outline'},
    {destination: 'ServiceRequestScreens', icon: 'calendar-edit'},
    {destination: 'HandymanScreens', icon: 'toolbox-outline'},
    {destination: 'HandymanChat', icon: 'chat-processing-outline'},
  ];

  const HandyToolbar = ({state, navigation}: any) => {
    return (
      <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561'}}>
        {bottomTools.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(item.destination);
              }}
              style={{}}>
              {item.icon == 'cart-outline' && (
                <Text
                  style={{
                    position: 'absolute',
                    marginLeft: 1,
                    top: -10,
                    zIndex: 1,
                    color: index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)',
                    fontFamily: 'Poppins-Bold',
                    width: '100%',
                    textAlign: 'center',
                  }}></Text>
              )}
              <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={28} color={index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <HandymanContext.Provider value={activeServices}>
      <Tab.Navigator tabBar={props => <HandyToolbar {...props} />} safeAreaInsets={{top: useSafeAreaInsets().top}}>
        <Tab.Screen name="HandymanHome" component={HandymanHome} options={{headerShown: false}} />
        <Tab.Screen name="ServiceRequestScreens" component={ServiceRequestScreens} options={{headerShown: false}} />
        <Tab.Screen name="HandymanScreens" component={HandymanScreens} options={{headerShown: false}} />
        <Tab.Screen name="HandymanChat" component={HandymanChat} options={{headerShown: false}} />
      </Tab.Navigator>
    </HandymanContext.Provider>
  );
};

export default HandymanNavigator;

import {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {TransportContext} from '../../../../functions/Contexts';

import TransportHome from './TransportHome';
import TransportBookings from './TransportBookings';
import TransportSchedule from './TransportSchedule';
import TransportChat from './TransportChat';
import TransportNewBooking from './TransportNewBooking';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BookingScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TransportBookings" component={TransportBookings} options={{headerShown: false}} />
      <Stack.Screen name="TransportNewBooking" component={TransportNewBooking} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const bottomTools = [
  {destination: 'TransportHome', icon: 'home-outline'},
  {destination: 'BookingScreens', icon: 'calendar-edit'},
  {destination: 'TransportSchedule', icon: 'bus-clock'},
  {destination: 'TransportChat', icon: 'chat-processing-outline'},
];

const TransportNavigator = props => {
  const [activeBooking, setActiveBooking] = useState([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateActiveBooking', data => {
      const tmpBookings = [...activeBooking];
      setActiveBooking([...tmpBookings, data]);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  const TransportToolbar = ({state, navigation}) => {
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
    <TransportContext.Provider value={activeBooking}>
      <Tab.Navigator tabBar={props => <TransportToolbar {...props} />} sceneContainerStyle={{paddingTop: useSafeAreaInsets().top, backgroundColor: '#FFF'}}>
        <Tab.Screen name="TransportHome" component={TransportHome} options={{headerShown: false}} />
        <Tab.Screen name="BookingScreens" component={BookingScreens} options={{headerShown: false}} />
        <Tab.Screen name="TransportSchedule" component={TransportSchedule} options={{headerShown: false}} />
        <Tab.Screen name="TransportChat" component={TransportChat} options={{headerShown: false}} />
      </Tab.Navigator>
    </TransportContext.Provider>
  );
};

export default TransportNavigator;

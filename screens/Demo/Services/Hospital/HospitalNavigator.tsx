import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator, BottomTabBarProps} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {AppointmentContext} from '../../../../functions/Contexts';

import HospitalHome from './HospitalHome';
import HospitalAppointment from './HospitalAppointment';
import HospitalCreate from './HospitalCreate';
import HospitalChat from './HospitalChat';
import DoctorProfile from './DoctorProfile';

import DoctorsScreen from './DoctorsScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HospitalAppointmentScreens(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HospitalAppointment" component={HospitalAppointment} options={{headerShown: false}} />
      <Stack.Screen name="HospitalCreate" component={HospitalCreate} options={{headerShown: false}} />
      <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function DoctorListScreens(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} options={{headerShown: false}} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const HospitalNavigator = (props: any): React.JSX.Element => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateAppointment', (data: any) => {
      setAppointments([...appointments, data]);
    });

    return () => {
      if (typeof eventListener == 'string') EventRegister.removeEventListener(eventListener);
    };
  });

  const bottomTools = [
    {destination: 'HospitalHome', icon: 'home-heart'},
    {destination: 'HospitalAppointmentScreens', icon: 'calendar-check'},
    {destination: 'DoctorListScreens', icon: 'stethoscope'},
    {destination: 'HospitalChat', icon: 'chat-processing-outline'},
  ];

  const HospitalToolbar = ({state, navigation}: BottomTabBarProps): React.JSX.Element => {
    return (
      <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561'}}>
        {bottomTools.map((item: any, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: item.key,
                  canPreventDefault: true,
                });

                const isFocused = state.index === index;

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(item.destination, item.params);
                }
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
    <AppointmentContext.Provider value={appointments}>
      <Tab.Navigator tabBar={props => <HospitalToolbar {...props} />} safeAreaInsets={{top: useSafeAreaInsets().top}}>
        <Tab.Screen name="HospitalHome" component={HospitalHome} options={{headerShown: false}} />
        <Tab.Screen name="HospitalAppointmentScreens" component={HospitalAppointmentScreens} options={{headerShown: false}} />
        <Tab.Screen name="DoctorListScreens" component={DoctorListScreens} options={{headerShown: false}} />
        <Tab.Screen name="HospitalChat" component={HospitalChat} options={{headerShown: false}} />
      </Tab.Navigator>
    </AppointmentContext.Provider>
  );
};

export default HospitalNavigator;

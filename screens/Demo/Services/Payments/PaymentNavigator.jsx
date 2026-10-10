import {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import PaymentHome from './PaymentHome';
import PaymentHistory from './PaymentHistory';
import PaymentProfile from './PaymentProfile';
import PaymentScreen from './PaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PaymentHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PaymentHome" component={PaymentHome} options={{headerShown: false}} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const PaymentNavigator = props => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateAppointment', data => {
      setAppointments([...appointments, data]);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  const bottomTools = [
    {destination: 'PaymentHome', icon: 'home-heart'},
    {destination: 'PaymentHistory', icon: 'clipboard-text-clock-outline'},
    {destination: 'PaymentProfile', icon: 'account-circle'},
  ];

  const PaymentToolbar = ({state, navigation}) => {
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
    <Tab.Navigator tabBar={props => <PaymentToolbar {...props} />}>
      <Tab.Screen name="PaymentHomeStack" component={PaymentHomeStack} options={{headerShown: false}} />
      <Tab.Screen name="PaymentHistory" component={PaymentHistory} options={{headerShown: false}} />
      <Tab.Screen name="PaymentProfile" component={PaymentProfile} options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

export default PaymentNavigator;

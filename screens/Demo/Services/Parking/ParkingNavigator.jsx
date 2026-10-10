import {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {ParkingTicketContext} from '../../../../functions/Contexts';

import ParkingHome from './ParkingHome';
import ParkingUnits from './ParkingUnits';
import ParkingTickets from './ParkingTickets';
import ParkingOthers from './ParkingOthers';
import ParkingProfile from './ParkingProfile';
import ParkingLayout from './ParkingLayout';
import ParkingBookPrivate from './ParkingBookPrivate';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ParkingStack = createStackNavigator();

function PublicParkingScreens() {
  return (
    <ParkingStack.Navigator>
      <ParkingStack.Screen name="ParkingOthers" component={ParkingOthers} options={{headerShown: false}} />
      <ParkingStack.Screen name="ParkingLayout" component={ParkingLayout} options={{headerShown: false}} />
    </ParkingStack.Navigator>
  );
}

function PrivateParkingScreens() {
  return (
    <ParkingStack.Navigator initialRouteName="ParkingOthers">
      <ParkingStack.Screen name="ParkingUnits" component={ParkingUnits} options={{headerShown: false}} />
      <ParkingStack.Screen name="ParkingLayout" component={ParkingLayout} options={{headerShown: false}} />
      <ParkingStack.Screen name="ParkingBookPrivate" component={ParkingBookPrivate} options={{headerShown: false}} />
    </ParkingStack.Navigator>
  );
}

const bottomTools = [
  {destination: 'ParkingHome', icon: 'home-outline'},
  {destination: 'PublicParkingScreens', icon: 'office-building-marker'},
  {destination: 'ParkingTickets', icon: 'ticket-percent-outline'},
  {destination: 'PrivateParkingScreens', icon: 'home-account'},
  {destination: 'ParkingProfile', icon: 'account-settings'},
];

const ParkingNavigator = props => {
  const [ticketInfo, setTicketInfo] = useState();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateParkingTicket', data => {
      setTicketInfo(data);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  const ParkingToolbar = ({state, navigation}) => {
    return (
      <View style={{width: '100%', backgroundColor: '#FFF'}}>
        <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561'}}>
          {bottomTools.map((item, index) => {
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
                style={
                  item.destination == 'ParkingTickets' &&
                  {
                    //: 60,
                    // height: 60,
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    // borderRadius: 50,
                    // borderColor: index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)',
                    // borderWidth: 3,
                  }
                }>
                <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={28} color={index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)'} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ParkingTicketContext.Provider value={ticketInfo}>
      <Tab.Navigator tabBar={props => <ParkingToolbar {...props} />} sceneContainerStyle={{marginTop: 0}}>
        <Tab.Screen name="ParkingHome" component={ParkingHome} options={{headerShown: false}} />
        <Tab.Screen name="PublicParkingScreens" component={PublicParkingScreens} options={{headerShown: false}} listeners={{tabPress: e => {}}} />
        <Tab.Screen name="ParkingTickets" component={ParkingTickets} options={{headerShown: false}} />
        <Tab.Screen name="PrivateParkingScreens" component={PrivateParkingScreens} options={{headerShown: false}} />
        <Tab.Screen name="ParkingProfile" component={ParkingProfile} options={{headerShown: false}} />
      </Tab.Navigator>
    </ParkingTicketContext.Provider>
  );
};

export default ParkingNavigator;

import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {LeasingContext} from '../../../../functions/Contexts';

import LeasingHome from './LeasingHome';
import LeasingMyUnits from './LeasingMyUnits';
import LeasingChat from './LeasingChat';
import LeasingInfo from './LeasingInfo';
import LeasingAddUnits from './LeasingAddUnits';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UnitsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LeasingMyUnits" component={LeasingMyUnits} options={{headerShown: false}} />
      <Stack.Screen name="LeasingInfo" component={LeasingInfo} options={{headerShown: false}} />
      <Stack.Screen name="LeasingAddUnits" component={LeasingAddUnits} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const bottomTools = [
  {destination: 'LeasingHome', icon: 'home-outline'},
  {destination: 'UnitsScreen', icon: 'home-account'},
  {destination: 'LeasingChat', icon: 'chat-processing-outline'},
];

const LeasingNavigator = props => {
  const SampleOwnerUnits = [
    {
      propCode: 'NOAHTW',
      unitName: 'Noah Towers',
      unitNumber: 'Noah-Tower1-9F',
      unitCode: 'NT9F',
      unitAddress: 'Monserrat St., Gil Puyat Ave. Makati City',
      unitLessee: 'John Wick',
      lesseePhone: '0911-111-0011',
      lesseeEmail: 'excommunicado@gmail.com',
      unitImage: require('../../../../assets/Images/Parking/reserved.jpg'),
      unitStatus: 'Active',
      contractExpiration: '06/01/2025',
      unitImages: [
        {img: require('../../../../assets/Images/Leasing/u1a.jpg')},
        {img: require('../../../../assets/Images/Leasing/u1b.jpg')},
        {img: require('../../../../assets/Images/Leasing/u1c.jpg')},
        {img: require('../../../../assets/Images/Leasing/u1d.jpg')},
        {img: require('../../../../assets/Images/Leasing/u1e.jpg')},
      ],
    },
    {
      propCode: 'NOAHCDM',
      unitName: 'Noah Condominium',
      unitNumber: 'NCD-01-7A',
      unitCode: 'BA017A',
      unitAddress: '8 Gov I Rodriguez, Taguig City',
      unitLessee: 'N/A',
      lesseePhone: 'N/A',
      lesseeEmail: 'N/A',
      unitImage: require('../../../../assets/Images/Parking/condo_2.jpg'),
      unitStatus: 'Open for Lease',
      contractExpiration: 'N/A',
      unitImages: [],
    },
    {
      propCode: 'NOAHPROP',
      unitName: 'Noah Properties',
      unitNumber: 'NPR-04-3A',
      unitCode: 'NPR043A',
      unitAddress: '2178 Chino Roces Avenue, Makati City',
      unitLessee: 'N/A',
      lesseePhone: 'N/A',
      lesseeEmail: 'N/A',
      unitImage: require('../../../../assets/Images/Leasing/unit_3.jpg'),
      unitStatus: 'Idle',
      contractExpiration: 'N/A',
      unitImages: [],
    },
  ];

  const [myUnits, setMyUnits] = useState(SampleOwnerUnits);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateMyUnits', data => {
      const tmpArray = [...myUnits];

      if (data.itemAction == 'ADD') {
        delete myUnits.itemAction;
        tmpArray.push(data);
      }

      if (data.itemAction == 'UPDATE') {
        delete myUnits.itemAction;
        const itemIndex = myUnits.findIndex(item => item.unitCode == data.unitCode);
        tmpArray[itemIndex] = data;
      }

      setMyUnits(tmpArray);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  const LeasingToolbar = ({state, navigation}) => {
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
    <LeasingContext.Provider value={myUnits}>
      <Tab.Navigator tabBar={props => <LeasingToolbar {...props} />} sceneContainerStyle={{paddingTop: useSafeAreaInsets().top, backgroundColor: '#FFF'}}>
        <Tab.Screen name="LeasingHome" component={LeasingHome} options={{headerShown: false}} />
        <Tab.Screen name="UnitsScreen" component={UnitsScreen} options={{headerShown: false}} />
        <Tab.Screen name="LeasingChat" component={LeasingChat} options={{headerShown: false}} />
      </Tab.Navigator>
    </LeasingContext.Provider>
  );
};

export default LeasingNavigator;

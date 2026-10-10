import {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import ClockingHome from './ClockingHome';
import {TimeSheetContext, ClockStatusContext, ClockCoordsContext} from '../../../functions/Contexts';
import ClockLiveTracking from './ClockLiveTracking';
import ClockTimeSheet from './ClockTimeSheet';
import ClockDailySingle from './ClockDailySingle';
import {NmLabel} from '../../../components';
import {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const bottomTools = [
  {destination: 'ClockingMain', icon: 'home-outline', title: 'Home'},
  {destination: 'ClockTimeSheetNav', icon: 'clipboard-text-clock-outline', title: 'TimeSheet'},
  {destination: 'ClockLiveTracking', icon: 'map-marker-distance', title: 'Live Tracking'},
];

const TimeSheetNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClockTimeSheet" component={ClockTimeSheet} options={{headerShown: false}} />
      <Stack.Screen name="ClockDailySingle" component={ClockDailySingle} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ClockingNavigator = props => {
  const [currentTimeSheet, setCurrentTimeSheet] = useState([]);
  const [userClockedIn, setUserClockedIn] = useState();
  const [currentCoords, setCurrentCoords] = useState();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let TimeSheetListener = EventRegister.addEventListener('UpdateCurrentTimeSheet', data => {
      setCurrentTimeSheet(data);
    });

    let ClockedStatusListener = EventRegister.addEventListener('UserClockedStatus', data => {
      setUserClockedIn(data);
    });

    let CoordsListener = EventRegister.addEventListener('UserCurrentCoords', data => {
      setCurrentCoords(data);
    });

    return () => {
      EventRegister.removeEventListener(TimeSheetListener);
      EventRegister.removeEventListener(ClockedStatusListener);
      EventRegister.removeEventListener(CoordsListener);
    };
  }, []);

  const ClockToolbar = ({state, navigation}) => {
    return (
      <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561', paddingTop: 0, paddingBottom: insets.bottom}}>
        {bottomTools.map((item, index) => {
          const ToolColor = index == state.index ? '#FFF' : 'rgba(255, 255, 255, 0.4)';

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(item.destination);
              }}
              style={{alignItems: 'center', width: WINDOW_WIDTH / bottomTools.length}}>
              <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={24} color={ToolColor} />
              <NmLabel style={{fontSize: 10, marginTop: -8, marginBottom: 4, color: ToolColor}}>{item.title}</NmLabel>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TimeSheetContext.Provider value={currentTimeSheet}>
      <ClockStatusContext.Provider value={userClockedIn}>
        <ClockCoordsContext.Provider value={currentCoords}>
          <Tab.Navigator tabBar={props => <ClockToolbar {...props} />}>
            <Tab.Screen name="ClockingMain" component={ClockingHome} options={{headerShown: false}} />
            <Tab.Screen name="ClockTimeSheetNav" component={TimeSheetNavigator} options={{headerShown: false}} />
            <Tab.Screen name="ClockLiveTracking" component={ClockLiveTracking} options={{headerShown: false}} />
          </Tab.Navigator>
        </ClockCoordsContext.Provider>
      </ClockStatusContext.Provider>
    </TimeSheetContext.Provider>
  );
};

export default ClockingNavigator;

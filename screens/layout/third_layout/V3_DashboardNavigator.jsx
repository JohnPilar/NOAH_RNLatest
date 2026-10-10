import {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {NmLabel} from '../../../components/index';
import {WINDOW_WIDTH} from '../../../constants/NmStyles';

import V3_DashboardMainScreen from './V3_DashboardMainScreen';
import SettingsScreen from '../../SettingsScreen';
import NotificationScreen from '../../NotificationScreen';
import {ThemesContext} from '../../../functions/ThemeContext';

const Tab = createBottomTabNavigator();

const V3_DashboardNavigator = props => {
  const insets = useSafeAreaInsets();
  const EmptyScreen = () => null;
  const {theme} = useContext(ThemesContext);

  const DashboardButtons = [
    {destination: 'Home', icon: 'home-outline', title: 'Home'},
    {destination: 'MenuItemNavContext', icon: 'application-parentheses-outline', title: 'Menu Items'},
    {destination: 'EndpointScanner', icon: 'qrcode-scan', title: ''},
    {destination: 'V2_Notifications', icon: 'bell-ring-outline', title: 'Notifications'},
    {destination: 'V2_Settings', icon: 'tools', title: 'Settings'},
  ];

  const DashboardToolbar = ({state, navigation}) => {
    const [barHeight, setBarHeight] = useState(0);

    return (
      <View
        onLayout={event => {
          const {x, y, width, height} = event.nativeEvent.layout;
          setBarHeight(height);
        }}
        style={{
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingTop: 0,
          paddingBottom: insets.bottom,
          backgroundColor: theme.toolbar,
          shadowRadius: 2,
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowColor: '#000000',
          elevation: 10,
          marginTop: 1,
        }}>
        {DashboardButtons.map((item, index) => {
          const ToolColor = index == state.index ? '#1974D1' : '#838383b4';

          if (item.destination == 'EndpointScanner') {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.5}
                onPress={() => {
                  props.navigation.navigate(item.destination);
                }}
                style={[{alignItems: 'center', width: WINDOW_WIDTH / DashboardButtons.length}]}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#1974D1',
                    borderRadius: 50,
                    padding: 4,
                  }}>
                  <MaterialCommunityIcons style={{padding: 10}} name={'qrcode-scan'} size={24} color={'#FFF'} />
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.5}
                onPress={() => {
                  if (item.destination == 'MenuItemNavContext') {
                    props.navigation.navigate(item.destination, {tabHeight: barHeight});
                  } else {
                    props.navigation.navigate(item.destination);
                  }
                }}
                style={[{alignItems: 'center', width: WINDOW_WIDTH / DashboardButtons.length, marginTop: -4}]}>
                <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={24} color={ToolColor} />
                <NmLabel style={{fontSize: 10, marginTop: -8, marginBottom: 4, color: ToolColor}}>{item.title}</NmLabel>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: useSafeAreaInsets().top, backgroundColor: theme.statusBar}}>
      <Tab.Navigator tabBar={props => <DashboardToolbar {...props} items={'Hello'} />}>
        <Tab.Screen name="Home" component={V3_DashboardMainScreen} options={{headerShown: false}} />
        <Tab.Screen name="MenuItemNavContext" component={EmptyScreen} options={{headerShown: false}} />
        <Tab.Screen name="EndpointScanner" component={EmptyScreen} options={{headerShown: false}} />
        <Tab.Screen name="V2_Notifications" component={NotificationScreen} options={{headerShown: false}} initialParams={{thirdLayout: true}} />
        <Tab.Screen name="V2_Settings" component={SettingsScreen} options={{headerShown: false}} initialParams={{thirdLayout: true}} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default V3_DashboardNavigator;

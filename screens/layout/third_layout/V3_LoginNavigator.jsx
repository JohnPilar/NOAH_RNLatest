import {createContext, useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {NmLabel} from '../../../components/index';
import {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {LoadingScreen} from '../../../components/index';
import V3_LoginOptionScreen from './V3_LoginOptionScreen';
import AccountOptions from './AccountOptions';
import {ThemesContext, ThemeProvider} from '../../../functions/ThemeContext';
import {LoadingContext, LoadingProvider} from '../../../functions/Contexts';

const Tab = createBottomTabNavigator();

const V3_LoginNavigator = props => {
  const insets = useSafeAreaInsets();
  const EmptyScreen = () => null;
  const {theme} = useContext(ThemesContext);
  const {loading} = useContext(LoadingContext);

  const LoginButtons = [
    {destination: 'LoginScreen', icon: 'login', title: 'Login'},
    {destination: 'EndpointScanner', icon: 'qrcode-scan', title: ''},
    {destination: 'AccountOptions', icon: 'account-cog-outline', title: 'Account'},
  ];

  const LoginToolbar = ({state, navigation}) => {
    return (
      <View
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
        {LoginButtons.map((item, index) => {
          const ToolColor = index == state.index ? '#1974D1' : '#838383b4';

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(item.destination);
              }}
              style={[{alignItems: 'center', width: WINDOW_WIDTH / LoginButtons.length}]}>
              {item.destination != 'EndpointScanner' && <MaterialCommunityIcons style={{padding: 10, marginTop: -2}} name={item.icon} size={24} color={ToolColor} />}
              <NmLabel style={{fontSize: 10, marginTop: -8, marginBottom: 6, color: ToolColor}}>{item.title}</NmLabel>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            props.navigation.navigate('EndpointScanner');
          }}
          style={{
            alignItems: 'center',
            position: 'absolute',
            padding: 8,
            borderRadius: 50,
            bottom: insets.bottom + 14,
            marginBottom: 1,
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#1974D1',
              borderRadius: 50,
              padding: 8,
            }}>
            <MaterialCommunityIcons style={{padding: 10}} name={'qrcode-scan'} size={24} color={'#FFF'} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.statusBar}}>
      {loading && <LoadingScreen />}
      <Tab.Navigator tabBar={props => <LoginToolbar {...props} />}>
        <Tab.Screen name="LoginScreen" component={V3_LoginOptionScreen} options={{headerShown: false}} />
        <Tab.Screen name="EmptyScreen" component={EmptyScreen} options={{headerShown: false}} />
        <Tab.Screen name="AccountOptions" component={AccountOptions} options={{headerShown: false}} />
      </Tab.Navigator>
    </View>
  );
};

export const V3_LoginNavigatorWrapper = props => (
  <ThemeProvider>
    <LoadingProvider>
      <V3_LoginNavigator {...props} />
    </LoadingProvider>
  </ThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

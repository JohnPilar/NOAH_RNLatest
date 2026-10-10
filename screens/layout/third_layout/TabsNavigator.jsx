import {useContext, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import V3_WebViewer from './V3_WebViewer';
import {TabsContext} from '../../../functions/Contexts';
import {NmLabel} from '../../../components';
import {NmStyles} from '../../../constants';
import TabsScreen from './TabsScreen';
import HistoryScreen from './HistoryScreen';
import {useIsFocused} from '@react-navigation/native';
import {ThemesContext} from '../../../functions/ThemeContext';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

const Tab = createBottomTabNavigator();

const TabsNavigator = props => {
  const {tabList, showNavbar, setShowNavbar} = useContext(TabsContext);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!showNavbar && isFocused) {
      setShowNavbar(true);
    }
  }, [isFocused, showNavbar]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        detachInactiveScreens: false,
        freezeOnBlur: true,
        tabBarStyle: {display: 'none'}, // This hides the tab bar
      }}
      backBehavior="history">
      <Tab.Screen key={'New Tab'} name={'New Tab'} component={SampleHomePage} />
      <Tab.Screen key={'HistoryScreen'} name={'HistoryScreen'} component={HistoryScreen} />
      <Tab.Screen key={'TabsScreen'} name={'TabsScreen'} component={TabsScreen} />
      {tabList?.map(tab => {
        return <Tab.Screen key={tab.key} name={tab.key} component={V3_WebViewer} initialParams={{localTab: tab, ...tab}} />;
      })}
    </Tab.Navigator>
  );
};

const SampleHomePage = props => {
  const {theme} = useContext(ThemesContext);

  NmHardwareBackPress();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.statusBar}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#AAA'}]}>{'NOAH Mobile'}</NmLabel>
        <NmLabel style={[NmStyles.fontOpenSans.regular, {color: '#AAA', fontSize: 14}]}>{'Open the menu to get started'}</NmLabel>
      </View>
    </SafeAreaView>
  );
};

export default TabsNavigator;

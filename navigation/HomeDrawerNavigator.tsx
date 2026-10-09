import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Platform, Dimensions, Text} from 'react-native';

import {NavigationProp} from '@react-navigation/native';
import {useDeviceOrientation} from '../functions/NmFunctions';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {EventRegister} from 'react-native-event-listeners';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ThemesContext} from '../functions/ThemeContext';
import {APP_CONST} from '../constants/NmConstants';
import {navigationRef} from './NavigationRef';
import AppNavigator from './AppNavigator';
import {NmNotificationWindow, NmProfile, NmStatusBar} from '../components';
import DrawerContent from './DrawerContent';
import {WINDOW_WIDTH} from '../constants/NmStyles';
import {AccountDetailsContext} from '../functions/Contexts';
import {ConfigDetails} from '../functions/NmAppConfig';

import {RootStackParamList} from './NavigationTypes';

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const HomeDrawerNavigator = ({navigation}: Props): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {headerTitle} = useContext(AccountDetailsContext);
  const orientation = useDeviceOrientation();
  const insets = useSafeAreaInsets();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(Dimensions.get('window').width);
  const [showBackButton, setShowBackButton] = useState<string>(APP_CONST.DRWBUTTON_MENU);

  useEffect(() => {
    const HeaderButtonListener = EventRegister.addEventListener('UpdateButtonTitle', (data: string) => {
      setShowBackButton(data);
    }) as string;

    return () => {
      EventRegister.removeEventListener(HeaderButtonListener);
    };
  }, []);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() === 'TABLET') {
      if (orientation === 'portrait') {
        setDrawerWidth(Dimensions.get('window').width * 0.5);
      } else {
        setDrawerWidth(Dimensions.get('window').width * 0.35);
      }
    } else {
      setDrawerWidth(Dimensions.get('window').width * 0.8);
    }
  }, [orientation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.homeDrawerBackgroundColor}}>
      <NmStatusBar barColor="transparent" translucent={true} />

      {/* Top Header Bar */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: theme.homeDrawerBackgroundColor,
          },
        ]}>
        {/* Header Left */}
        <View style={styles.headerLeft}>
          {showBackButton === APP_CONST.DRWBUTTON_MENU && (
            <TouchableOpacity onPress={() => setDrawerOpen(true)}>
              <Image
                source={require('../assets/Icons/component_drawer_icon.png')}
                style={{
                  tintColor: '#FFF',
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity>
          )}

          {(showBackButton === APP_CONST.DRWBUTTON_BACK || showBackButton === APP_CONST.DRWBUTTON_ASST) && (
            <TouchableOpacity
              onPress={() => {
                setShowBackButton(APP_CONST.DRWBUTTON_MENU);
                navigationRef.goBack();
              }}>
              <MaterialCommunityIcons name="arrow-left" size={25} color="#FFF" />
            </TouchableOpacity>
          )}

          {showBackButton === APP_CONST.DRWBUTTON_ASST && (
            <View style={{marginLeft: 10}}>
              <Image
                source={require('../assets/Icons/assistant2.png')}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </View>
          )}

          <TouchableOpacity
            style={{
              marginLeft: 12,
              width: WINDOW_WIDTH * 0.62,
              overflow: 'scroll',
            }}
            activeOpacity={0.6}
            onPress={() => {
              if (!showBackButton) {
                navigation.navigate('Home');
              }
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 20,
                marginTop: Platform.OS === 'ios' ? 0 : 0,
                color: '#FFF',
                lineHeight: Platform.OS === 'ios' ? 28 : 22,
              }}
              numberOfLines={1}>
              {headerTitle}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header Right */}
        {ConfigDetails().AppType === APP_CONST.APP_TYPE_PORTAL && (
          <View
            style={[
              styles.headerRight,
              {
                backgroundColor: theme.homeDrawerBackgroundColor,
              },
            ]}>
            <NmNotificationWindow />
            <View style={{marginHorizontal: 7}} />
            <NmProfile />
          </View>
        )}
      </View>

      {/* Main Screen Content */}
      <View style={{flex: 1}}>
        <AppNavigator />
      </View>

      {/* Drawer Overlay Modal */}
      <DrawerContent visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginRight: Platform.OS === 'ios' ? 5 : 10,
  },
});

export default HomeDrawerNavigator;

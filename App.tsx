import React, {useEffect, useContext, useState} from 'react';
import {DimensionValue, Platform, View} from 'react-native';
import {configureReanimatedLogger} from 'react-native-reanimated';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {KeyboardProvider} from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import messaging, {firebase} from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';

import LoginNavigator from './navigation/LoginNavigator.tsx';
import {ThemeProvider, ThemesContext} from './functions/ThemeContext.tsx';
import {AppConfigProvider, AppConfigContext} from './functions/Contexts.tsx';
import {initEndpoint} from './functions/NmEndpoint.tsx';
import {initConfig} from './functions/NmAppConfig.tsx';
import {NmGetSetting, NmSaveSetting} from './functions/NmFunctions.tsx';
import {NmStoreUserToken} from './functions/NmNetwork.tsx';
import {APP_KEYS} from './constants/NmConstants.js';
import {navigationRef} from './navigation/NavigationRef.tsx';
import {NmStatusBar} from './components/NmComponents.tsx';
import NotificationController from './functions/NmNotifications.tsx';

import './Global/GlobalVariable.js';
import './Global/UIConfig.js';
import {Config} from './app.config.tsx';
import {NDProvider} from './components/NmDevTools.tsx';
import {MainLoadingScreen} from './navigation/SplashScreen.tsx';
import {useDeviceOrientation} from '@react-native-community/hooks';

configureReanimatedLogger({
  strict: false,
});

Geolocation.setRNConfiguration({
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  skipPermissionRequests: false,
});

const AppRoot: React.FC = () => {
  const {setEnableNotification} = useContext(AppConfigContext);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('70%');

  const orientation = useDeviceOrientation();

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() === 'TABLET') {
      if (orientation === 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      try {
        await initConfig();
        const success = await initEndpoint();

        console.log('everything is always', success);

        if (Config.APP_ENABLE_NOTIFICATION === true) {
          await onAppBootstrap();
        } else {
          await initResources(false);
        }
      } catch (e) {
        console.error('Bootstrap error', e);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, []);

  async function onAppBootstrap(): Promise<void> {
    if (Platform.OS === 'android') {
      if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
        await firebase.messaging().registerDeviceForRemoteMessages();
      }
    }

    messaging().onTokenRefresh(async (NotifToken: string) => {
      const currentUser = await NmGetSetting(APP_KEYS.ACCESS_USER);
      const currentToken = await NmGetSetting(APP_KEYS.ACCESS_TOKEN);

      if (currentUser != undefined || currentUser != '') {
        NmStoreUserToken(currentUser, NotifToken, DeviceInfo.getDeviceId(), currentToken);
      }
    });
  }

  async function initResources(isEnabled: boolean): Promise<void> {
    await NmSaveSetting(APP_KEYS.SETT_PUSHNOTIF, isEnabled);
    setEnableNotification(isEnabled);
  }

  const {theme} = useContext(ThemesContext);

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.screenBackground,
      card: 'white',
    },
  };

  return (
    <>
      {isReady ? (
        <KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef} theme={CustomDefaultTheme}>
              <NmStatusBar barColor="transparent" translucent={true} />
              <LoginNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </KeyboardProvider>
      ) : (
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.splashBackground,
            },
          ]}>
          <MainLoadingScreen theme={theme} screenWidth={screenWidth} />
        </View>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <NDProvider>
      <AppConfigProvider>
        <ThemeProvider>
          <NotificationController>
            <AppRoot />
          </NotificationController>
        </ThemeProvider>
      </AppConfigProvider>
    </NDProvider>
  );
};

export default App;

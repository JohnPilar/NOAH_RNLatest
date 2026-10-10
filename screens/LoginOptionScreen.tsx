import {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, ImageBackground, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, BackHandler, AppState, Platform, DimensionValue} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import ReactNativeBiometrics from 'react-native-biometrics';
import messaging from '@react-native-firebase/messaging';

import {NmInitUserApprovals, NmSaveSetting, NmRefreshAllNotifications, NmHasInternet, NmInitializeDrawer, NmGetSetting, NmNullOrEmpty} from '../functions/NmFunctions.tsx';
import {NmButton, LoadingScreen, NmEndpointList} from '../components/index.jsx';
import {NmGetMobileAppData, NmStoreUserToken} from '../functions/NmNetwork.tsx';
import {APP_CONST, APP_KEYS} from '../constants/index.jsx';
import {getCurrentRouteName, getCurrentParentName, getCurrentRouteParams} from '../navigation/NavigationRef.tsx';
import {AccountDetailsContext, AppConfigContext, NotificationsContext} from '../functions/Contexts.tsx';
import {ThemesContext} from '../functions/ThemeContext.tsx';
import {ConfigDetails} from '../functions/NmAppConfig.tsx';
import {UIConfig} from '../Global/UIConfig.js';
import {NmHomeDrawerNavigate} from '../functions/NmNotifications.tsx';
import {Config} from '../app.config.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '../navigation/NavigationTypes.tsx';

type Props = StackScreenProps<'LoginOptionScreen'>;

const LoginOptionScreen = ({navigation, route}: Props) => {
  let linkFail = route.params?.linkFail;
  let message = route.params?.message;
  const notifNavigation = useNavigation();

  const appState = useRef(AppState.currentState);
  const {theme} = useContext(ThemesContext);
  const {biometricAsked, biometricUse, AssetManager} = useContext(AppConfigContext);
  const {recuser, loginToken, notifManager, setHeaderTitle, setDemoMode} = useContext(AccountDetailsContext);
  const {currentNotification, setCurrentNotification, updateNotifContext} = useContext(NotificationsContext);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const orientation = useDeviceOrientation();
  const [changeEndpointVisible, setChangeEndpointVisible] = useState<boolean>(false);
  const [mobileLockEnabled, setMobileLockedEnabled] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<DimensionValue | undefined>('100%');
  const [devCounter, setDevCounter] = useState<number>(0);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const pressStartTime = useRef<number>(0);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    if (devCounter >= 7) {
      setDemoMode(true);
    }
  }, [devCounter]);

  async function handleNotifData(notifData: any): Promise<void> {
    if (notifData?.NotifType == APP_CONST.NOTIF_TYPE_CHAT || notifData != undefined) {
      if (navigation.isFocused()) {
        if (biometricUse == true && biometricAsked == true && !NmNullOrEmpty([loginToken])) {
          loginWithFingerprint();
        } else {
          navigateTo('LoginScreen');
        }
      } else {
        if (getCurrentParentName('HomeDrawer') == 'HomeDrawer') {
          const routeParams = getCurrentRouteParams();
          const screenName = getCurrentRouteName() as string;

          if (notifData != undefined) {
            NmHomeDrawerNavigate({navProps: navigation, notificationData: notifData, routeParams: routeParams, screenName: screenName, setHeaderTitle: setHeaderTitle, navigation: notifNavigation});
            deleteNotifData(); // Delete clicked notification data upon processing
          }
        }
      }
    } else if (notifData?.NotifType == 'NOAH_NOTIF_TEST') {
      //
    }
  }

  useEffect(() => {
    (async () => {
      // CALLED FROM QUIT STATE
      const clickedNotification = await NmGetSetting(APP_KEYS.NOTIF_ACTION_CLICK);
      //console.log('From Quit State Triggered', clickedNotification);

      if (clickedNotification != undefined) {
        handleNotifData(currentNotification);
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        (async () => {
          updateNotifContext(); // Update Context data from background
          const clickedNotification = await NmGetSetting(APP_KEYS.NOTIF_ACTION_CLICK);

          //console.log('appState Triggered', clickedNotification);
          if (clickedNotification) {
            handleNotifData(clickedNotification?.data);
          }
        })();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  });

  useEffect(() => {
    if (linkFail == true) {
      showError(message);
    }

    const handleBackButton = () => {
      if (!navigation.isFocused()) {
        return false;
      }

      if (loading) {
        setLoading(false);
        return false;
      }

      setDemoMode(false);
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available} = resultObject;

      if (available == true) {
        setMobileLockedEnabled(true);
      }
    });
  });

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);
  async function GetToken(): Promise<string> {
    const token = await messaging().getToken();
    return token;
  }

  function navigateTo(where: string): void {
    if (where == 'HomeDrawer') {
      if (Platform.OS == 'ios') {
        setLoading(false);
        navigation.navigate(where as never);
        return;
      }

      // NmGetChatKeys(APP_CONST.TAG_KP).then(pubkey => {
      //   //console.log('pubkey', pubkey);
      //   (async () => {
      //     const EncMessage = await NmRSAEncrypt('Hello there my good friend', pubkey);
      //     console.log('encmessage', EncMessage);
      //     //const decMessage = await NmRSADecrypt(EncMessage);
      //     //console.log('decmessage', decMessage);
      //   })();
      // });

      GetToken().then((NotifToken: string) => {
        //console.log('NotifToken', NotifToken);
        NmStoreUserToken(recuser, NotifToken, DeviceInfo.getDeviceId(), loginToken).then(() => {
          setLoading(false);
          navigation.navigate(where as never);
        });
      });
    } else {
      navigation.navigate(where as never);
    }
  }

  const loginWithFingerprint = (): void => {
    NmHasInternet().then((result: boolean | any) => {
      if (result == true) {
        rnBiometrics
          .simplePrompt({promptMessage: 'Confirm biometrics to login'})
          .then(resultObject => {
            const {success} = resultObject;

            if (success) {
              setLoading(true);
              reloginUser();
            } else {
              deleteNotifData();
              console.log('user cancelled biometric prompt');
            }
          })
          .catch(() => {
            setLoading(false);
            showError('Biometrics failed');
          });
      } else {
        showError('No Internet connection detected.');
      }
    });
  };

  async function deleteNotifData(): Promise<void> {
    setCurrentNotification(undefined);
    await NmSaveSetting(APP_KEYS.NOTIF_CURRENT_DATA, undefined);
    await NmSaveSetting(APP_KEYS.NOTIF_ACTION_CLICK, undefined);
  }

  const showError = (err: string | undefined): void => {
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  function loginBiometric(): void {
    if (biometricUse == false && biometricAsked == true) {
      showError('Biometric login disabled.');
      return;
    }

    if (biometricUse == false || biometricUse == undefined) {
      showError('Please login first to enable biometric login.');
      return;
    }

    if (loginToken == undefined || loginToken == '') {
      showError('Please login first to enable biometric login..');
      return;
    } else {
      loginWithFingerprint();
    }
  }

  function reloginUser(): void {
    NmGetMobileAppData().then(responseData => {
      const tempAppItems: Record<string, unknown> = {};

      tempAppItems.Module = responseData.Module;
      tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
      tempAppItems.MenuDriven = responseData.MenuDriven;

      AssetManager.setAppitems(tempAppItems);

      NmInitializeDrawer(AssetManager, tempAppItems).then(() => {
        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
          NmRefreshAllNotifications(recuser, notifManager).then(() => {
            navigateTo('HomeDrawer');
          });
        }

        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
          NmInitUserApprovals(recuser, loginToken).then(result => {
            if (result == true) {
              navigateTo('HomeDrawer');
            } else {
              showError('Server Error: Please contact customer support (Approval List).');
            }
          });
        }
      });
    });
  }

  const handlePressIn = (): void => {
    pressStartTime.current = Date.now();
  };

  const handlePressOut = (): void => {
    const duration = Date.now() - pressStartTime.current;
    const type = duration < APP_CONST.EDP_TAPTHRESHOLD ? 'dot' : 'dash';

    if (type == APP_CONST.EDP_PATTERN[currentStep]) {
      const nextStep = currentStep + 1;

      if (nextStep == APP_CONST.EDP_PATTERN.length) {
        setChangeEndpointVisible(true);
        setCurrentStep(0);
      } else {
        setCurrentStep(nextStep);
      }
    } else {
      setCurrentStep(0);
    }
  };
  return (
    // <SafeAreaView style={{flex: 1, backgroundColor: 'blue'}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} source={theme.logopBackground} imageStyle={{opacity: 1, resizeMode: 'cover', alignSelf: 'flex-end'}}>
        {loading && <LoadingScreen />}

        <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <NmEndpointList
              setLoading={setLoading}
              winVisible={changeEndpointVisible}
              setWinVisible={setChangeEndpointVisible}
              containerStyle={{}}
              onClickClose={() => {
                setChangeEndpointVisible(false);
              }}
            />

            {/* <NmEndpointPrompt
              ...
          /> */}

            <View style={{alignItems: 'center', width: '100%', marginTop: 114}}>
              <TouchableWithoutFeedback
                style={{width: '100%', alignItems: 'center'}}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLongPress={() => Config.APP_ENDPOINTMODE == APP_CONST.EDP_LONGP && setChangeEndpointVisible(true)}>
                <Image
                  source={theme.logo.login}
                  style={{
                    width: 320,
                    height: 240,
                    resizeMode: 'contain',
                    marginBottom: 40,
                    marginTop: -30,
                  }}
                />
              </TouchableWithoutFeedback>
            </View>

            <View style={{alignItems: 'center', width: '100%', paddingTop: 40}}>
              {mobileLockEnabled && (
                <TouchableOpacity
                  onPress={() => loginBiometric()}
                  style={{width: 76, height: 76, backgroundColor: '#1A3763', borderColor: theme.biometricLogoBorder, borderWidth: 5, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={UIConfig.BiometricIcon}
                    style={{
                      tintColor: 'white',
                      height: 60,
                      resizeMode: 'contain',
                      //tint: theme.biometricLogoColor,
                    }}
                  />
                </TouchableOpacity>
              )}

              <View style={{marginTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <View style={[styles.horizontalLine, {marginRight: 20, borderBottomColor: theme.biometricLine}]} />
                <Text style={[styles.textStyle, {color: theme.biometricText}]}>{mobileLockEnabled ? ' or Login with' : 'Login with'}</Text>
                <View style={[styles.horizontalLine, {marginLeft: 20, borderBottomColor: theme.biometricLine}]} />
              </View>

              <View style={{width: '100%', alignItems: 'center'}}>
                <NmButton
                  style={styles.buttonStyle}
                  titleStyle={{}}
                  title="Email and Password"
                  onPress={() => {
                    navigateTo('LoginScreen');
                    //navigateTo('RegistrationSubmitted');
                  }}
                />

                <Text style={[{fontFamily: 'Poppins-Regular', fontSize: 13, textAlign: 'center', marginTop: 15, color: '#EEE', width: '100%', minHeight: 25}]}>{errorMessage}</Text>
              </View>
            </View>

            <View style={{alignItems: 'center', marginTop: 50, justifyContent: 'flex-end'}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setDevCounter(devCounter + 1);
                }}>
                <Image
                  source={UIConfig.PoweredLogo}
                  style={{
                    height: 50,
                    resizeMode: 'contain',
                    marginBottom: 40,
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
  },
  horizontalLine: {
    borderBottomColor: '#FFF',
    borderBottomWidth: 3,
    flex: 1,
    marginBottom: 14,
  },
  buttonStyle: {
    marginTop: 40,
  },
});

export default LoginOptionScreen;

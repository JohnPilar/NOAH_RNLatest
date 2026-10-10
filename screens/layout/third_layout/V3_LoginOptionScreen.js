import {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, ImageBackground, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, BackHandler, AppState} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import RNRestart from 'react-native-restart';
import RNExitApp from 'react-native-exit-app';
import messaging from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {
  NmInitGetUserDetails,
  NmInitUserApprovals,
  NmClearLoginData,
  NmCreateWebToken,
  NmGetLoginTime,
  NmSaveSetting,
  NmRefreshAllNotifications,
  NmClearAppData,
  NmStringUCaseTrim,
  NmHasInternet,
  NmInitializeDrawer,
  NmGetSetting,
} from '../../../functions/NmFunctions.tsx';
import {NmButton, LoadingScreen, NmEndpointPrompt, NmTextInput, NmModal, NmLabel, NmBiometricPrompt} from '../../../components/index.jsx';
import {NmGetMobileAppData, NmStoreUserToken, NmLogin, NmTermsConditions} from '../../../functions/NmNetwork.tsx';
import {APP_CONST, APP_KEYS, NmColors, NmStyles} from '../../../constants/index.jsx';
import {getCurrentRouteName, getCurrentParentName, getCurrentRouteParams} from '../../../navigation/NavigationRef.tsx';
import {LoadingContext, NotifDataContext, AccountDetailsContext} from '../../../functions/Contexts.tsx';
import {NmHomeDrawerNavigate} from '../../../functions/NmNotifications.tsx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemesContext} from '../../../functions/ThemeContext.tsx';
import {getEndpointDetails} from '../../../functions/NmEndpoint.tsx';
import {ConfigDetails} from '../../../functions/NmAppConfig.tsx';
import {UIConfig} from '../../../Global/UIConfig.js';

const V3_LoginOptionScreen = props => {
  const {recuser, loginToken, loginSetters, notifManager, setHeaderTitle, setDemoMode, noahStandard} = useContext(AccountDetailsContext);
  const {biometricAsked, setBiometricAsked, biometricUse, setBiometricUse, AssetManager} = useContext(AppConfigContext);
  const {EndpointCode} = getEndpointDetails();

  let linkFail = props.route.params?.linkFail;
  let message = props.route.params?.message;
  const appState = useRef(AppState.currentState);
  const {theme} = useContext(ThemesContext);
  const {loading, setLoading} = useContext(LoadingContext);

  const notifContext = useContext(NotifDataContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const UserPassRef = useRef();

  const [userAcc, setUserAcc] = useState();
  const [tmpResponse, setTmpResponse] = useState('');
  const [showModalTaC, setShowModalTaC] = useState(false);
  const [biometricPromptVisible, setBiometricPromptVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState();

  const orientation = useDeviceOrientation();
  const [changeEndpointVisible, setChangeEndpointVisible] = useState(false);
  const [mobileLockEnabled, setMobileLockedEnabled] = useState(false);
  const [screenWidth, setScreenWidth] = useState('100%');
  const [devCounter, setDevCounter] = useState(0);

  const [showPublicAnnouncements, setShowPublicAnnouncements] = useState(false);

  const [loadingMsg, setLoadingMsg] = useState('');

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    if (devCounter >= 7) {
      setDemoMode(true);
    }
  }, [devCounter]);

  async function handleNotifData(notifData) {
    if (notifData?.NotifType == 'NOAH_CHAT' || notifData != undefined) {
      if (props.navigation.isFocused()) {
        if (biometricUse == true && biometricAsked == true && (loginToken != undefined || loginToken != '')) {
          loginWithFingerprint();
        }
      } else {
        if (getCurrentParentName('V3_DashboardNavigator') == 'V3_DashboardNavigator') {
          const routeParams = getCurrentRouteParams();
          const screenName = getCurrentRouteName();

          if (notifData != undefined) {
            NmHomeDrawerNavigate({navProps: props, notificationData: notifData, routeParams: routeParams, screenName: screenName, setHeaderTitle: setHeaderTitle});
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
      if (notifContext != undefined) {
        handleNotifData(notifContext);
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        (async () => {
          //Carried over to other screens, clear this once logged in (with biometrics) or return from log-in screen
          let CurrentNotifData = await NmGetSetting(APP_KEYS.NOTIF_CURRENT_DATA);

          if (CurrentNotifData?.NotifType == 'NOAH_CHAT') {
            let messagingData = await NmGetSetting(APP_KEYS.MESSAGE_SVD_DATA);
            EventRegister.emit('UpdateMessages', {data: messagingData, fromBackground: true});
            EventRegister.emit('UpdateNotifData', CurrentNotifData);
            await NmSaveSetting(APP_KEYS.NOTIF_CURRENT_DATA, undefined);
          }

          if (CurrentNotifData == undefined) {
            CurrentNotifData = notifContext;
          }
          handleNotifData(CurrentNotifData);
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
      if (!props.navigation.isFocused()) {
        return false;
      }

      if (loading) {
        setLoading(false);
        return false;
      }

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

  async function GetToken() {
    const token = await messaging().getToken();
    return token;
  }

  function navigateTo(where) {
    if (where == 'V3_DashboardNavigator') {
      if (Platform.OS == 'ios') {
        setLoading(false);
        props.navigation.navigate(where);
        return;
      }

      GetToken().then(NotifToken => {
        NmStoreUserToken(recuser, NotifToken, DeviceInfo.getDeviceId(), loginToken).then(() => {
          setLoading(false);
          props.navigation.navigate(where);
        }, 500);
      });
    } else {
      setLoading(false);
      props.navigation.navigate(where);
    }
  }

  const loginWithFingerprint = (firstLogin = false) => {
    NmHasInternet().then(result => {
      if (result == true) {
        rnBiometrics
          .simplePrompt({promptMessage: 'Confirm biometrics to login'})
          .then(resultObject => {
            const {success} = resultObject;

            if (success) {
              if (firstLogin) {
                navigateTo('V3_DashboardNavigator');
              } else {
                reloginUser();
              }
            } else {
              deleteNotifData();
              EventRegister.emit('UpdateNotifData', undefined);
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

  async function deleteNotifData() {
    await NmSaveSetting(APP_KEYS.NOTIF_CURRENT_DATA, undefined);
  }

  const showError = err => {
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  function loginBiometric() {
    if (biometricUse == false && biometricAsked == true) {
      showError('Biometric login disabled.');
      return;
    }

    if (biometricUse == false || biometricUse == undefined) {
      showError('Please login first to enable biometric login.');
      return;
    }

    if (loginToken == undefined || loginToken == '') {
      showError('Please login first to enable biometric login.');
      return;
    }

    loginWithFingerprint();
  }

  function reloginUser() {
    setLoading(true);
    NmGetMobileAppData().then(responseData => {
      const tempAppItems = {};

      tempAppItems.Module = responseData.Module;
      tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
      tempAppItems.MenuDriven = responseData.MenuDriven;

      AssetManager.setAppitems(tempAppItems);

      NmInitializeDrawer(AssetManager, tempAppItems).then(() => {
        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
          NmRefreshAllNotifications(recuser, notifManager).then(result => {
            if (result == true) {
              navigateTo('V3_DashboardNavigator');
            }
          });
        }

        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
          NmInitUserApprovals(recuser, loginToken).then(result => {
            if (result == true) {
              navigateTo('V3_DashboardNavigator');
            } else {
              showError('Server Error: Please contact customer support (Approval List).');
            }
          });
        }
      });
    });
  }

  function setFingerprintSettings(useFingerprint) {
    NmSaveSetting(APP_KEYS.APP_BIOMETRIC_USE, useFingerprint);
    NmSaveSetting(APP_KEYS.APP_BIOMETRIC_ASKED, true);

    setBiometricUse(useFingerprint);
    setBiometricAsked(true);

    setBiometricPromptVisible(false);
    setLoading(false);

    if (useFingerprint) {
      loginWithFingerprint(true);
    } else {
      navigateTo('V3_DashboardNavigator');
    }
  }

  function resetFields() {
    setUsername('');
    setPassword('');
    setErrorMessage('');
  }

  function goToHomeScreen() {
    NmGetMobileAppData().then(responseData => {
      const tempAppItems = {};

      tempAppItems.Module = responseData.Module;
      tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
      tempAppItems.MenuDriven = responseData.MenuDriven;

      AssetManager.setAppitems(tempAppItems);

      NmInitializeDrawer(AssetManager, tempAppItems).then(res => {
        setLoading(false);
        props.navigation.navigate('V3_DashboardNavigator');
      });
    });
  }

  const Login = () => {
    Keyboard.dismiss();
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        NmLogin(username, password).then(responseData => {
          if (responseData.status == 200) {
            if (recuser != undefined && NmStringUCaseTrim(recuser) != NmStringUCaseTrim(username)) {
              NmClearLoginData();
            }
            setTmpResponse(responseData);

            if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
              NmTermsConditions(responseData.data[0]['user'], APP_CONST.TAC_LOGIN).then(result => {
                if (result?.status != '404') {
                  if (result.data.TACStatus == '3' || result.data.TACStatus == '2') {
                    initUserDetails(responseData);
                  } else {
                    setUserAcc(responseData.data[0]['user']);
                    setLoading(false);
                    setShowModalTaC(true);
                  }
                } else {
                  setLoading(false);
                  showError('Server Error: Please contact customer support (USR_TAC).');
                }
              });
            }

            if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
              initUserDetails(responseData);
            }
          } else {
            setLoading(false);
            showError(responseData.message);
          }
        });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };

  const initUserDetails = response => {
    let responseData = response;
    setLoading(true);

    //PORTAL TYPE (STANDARD)
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
      NmInitGetUserDetails(responseData.data[0]['user'], responseData.data[0]['access_token'], loginSetters, noahStandard).then(result => {
        if (result) {
          NmRefreshAllNotifications(responseData.data[0]['user'], notifManager).then(result => {
            if (result) {
              completeLogin(responseData, APP_CONST.APP_TYPE_PORTAL);
            }
          });
        } else {
          setLoading(false);
          showError('Cannot get user details');
        }
      });
    }

    //APPROVER TYPE
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
      NmInitUserApprovals(responseData.data[0]['user'], NmCreateWebToken(responseData.data[0]['access_token'])).then(result => {
        if (result == true) {
          completeLogin(responseData, APP_CONST.APP_TYPE_APPROVER);
        } else {
          setLoading(false);
          showError('Server Error: Please contact customer support (Approval List).');
        }
      });
    }
  };

  const completeLogin = (response, type) => {
    const responseData = response;

    loginSetters.setLoginToken(NmCreateWebToken(responseData.data[0]['access_token']));
    loginSetters.setTokenExpiration(responseData.data[0]['expires']);

    NmSaveSetting(APP_KEYS.ACCESS_TOKEN, responseData.data[0]['access_token']);
    NmSaveSetting(APP_KEYS.ACCESS_TOKEN_EXPIRE, responseData.data[0]['expires']);
    NmSaveSetting(APP_KEYS.ACCESS_LOGIN_TIME, NmGetLoginTime());

    if (type == APP_CONST.APP_TYPE_APPROVER) {
      loginSetters.setLoginToken(NmCreateWebToken(responseData.data[0]['access_token']));
      //loginSetters.setRecname(responseData.data[0]['name']);
    }

    // NmAddLoginHistory(username).then(result => {
    //   if (result == true) {

    // if (type == APP_CONST.APP_TYPE_APPROVER) {
    //
    // }

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType, error} = resultObject;

      if ((available && biometryType === BiometryTypes.TouchID) || (available && biometryType === BiometryTypes.FaceID) || (available && biometryType === BiometryTypes.Biometrics)) {
        if (biometricAsked == false || biometricAsked == undefined) {
          setBiometricPromptVisible(true);
        } else {
          goToHomeScreen();
        }
      } else {
        goToHomeScreen();
      }

      resetFields();
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' ? 0 : 0} behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} style={{flex: 1, width: '100%'}}>
        <ImageBackground
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          source={require('../../../assets/NOAH/NoahApp.png')}
          imageStyle={{opacity: 1, resizeMode: 'cover', alignSelf: 'center'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: useSafeAreaInsets().top, backgroundColor: theme.screenBackground, width: '100%'}}>
            {
              <NmBiometricPrompt
                isVisible={biometricPromptVisible}
                setIsVisible={setBiometricPromptVisible}
                // customAnimate={true}
                // customAnimateIn={'fadeIn'}
                // customAnimateOut={'fadeOut'}
                title={'Use Biometric Authentication'}
                message={'Your device is currently using Biometrics to enable some features, do you want to use it for faster login?'}
                onClickLater={() => {
                  //setBiometricPromptVisible(false);
                  setLoading(false);
                  navigateTo('V3_DashboardNavigator');
                }}
                onClickNo={() => setFingerprintSettings(false)}
                onClickYes={() => setFingerprintSettings(true)}
              />
            }

            <NmModal
              winVisible={showPublicAnnouncements}
              setWinVisible={setShowPublicAnnouncements}
              customAnimate={true}
              customAnimateIn={'slideInUp'}
              customAnimateOut={'slideOutDown'}
              customView={true}
              modalStyle={{justifyContent: 'flex-end'}}>
              <View style={{flex: 1, backgroundColor: theme.panelBackground, width: '100%', maxHeight: '40%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 12}}>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', paddingTop: 6}}>
                  <NmLabel style={[NmStyles.poppinsBold, {flex: 1, marginBottom: -3, color: theme.textColor}]}>{'Public Announcements'}</NmLabel>
                  <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                      setShowPublicAnnouncements(false);
                    }}>
                    <MaterialCommunityIcons name="close" size={24} color={'#4c5d72'} style={{marginTop: -10}} />
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 6, flex: 1}}>
                  <ScrollView contentContainerStyle={{flexGrow: 1}} style={{}}>
                    <NmLabel style={{fontSize: 14, color: theme.textColor}}>{'List of public announcements will appear here. No user login is required.'}</NmLabel>
                  </ScrollView>
                </View>
              </View>
            </NmModal>

            <View style={{width: '100%', flexDirection: 'row-reverse', height: 45, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setShowPublicAnnouncements(true)}>
                <Image source={require('../../../assets/Icons/component_notification_icon.png')} style={[{tintColor: theme.listTextColor, width: 25, height: 25, marginRight: 16}]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
              <View style={[styles.container]}>
                <NmEndpointPrompt
                  winVisible={changeEndpointVisible}
                  setWinVisible={setChangeEndpointVisible}
                  containerStyle={{}}
                  onButtonPress={(EndpointCode, Endpoint) => {
                    setChangeEndpointVisible(false);

                    switch (EndpointCode) {
                      case APP_CONST.ENDPOINT_CODE_CUS: {
                        navigateTo('EndpointScanner');
                        break;
                      }
                      case APP_CONST.ENDPOINT_CODE_CANCEL: {
                        break;
                      }
                      default: {
                        setLoading(true);
                        NmClearAppData().then(result => {
                          if (result == true) {
                            NmSaveSetting(APP_KEYS.ENDPOINT_URL, Endpoint);
                            NmSaveSetting(APP_KEYS.ENDPOINT_CODE, EndpointCode);
                            NmSaveSetting(APP_KEYS.ENDPOINT_KEY, APP_CONST.ENDPOINTKEY_SIT_UAT);

                            setTimeout(() => {
                              RNRestart.Restart();
                            }, 3000);
                          } else {
                            setLoading(false);
                            showError('Failed to clear application data. Exiting.');
                            setTimeout(() => {
                              //BackHandler.exitApp();
                              RNExitApp.exitApp();
                            }, 3000);
                          }
                        });
                        break;
                      }
                    }
                  }}
                  onClickClose={() => {
                    setChangeEndpointVisible(false);
                  }}
                  title={'Change Endpoint'}
                  message={'Current endpoint is:\n' + EndpointCode}
                />

                {/* {backgroundColor: '#1A3763AA'} */}
                <View style={{alignItems: 'center', width: '100%', marginBottom: 35}}>
                  <TouchableWithoutFeedback
                    style={{width: '100%', alignItems: 'center'}}
                    onLongPress={() => setChangeEndpointVisible(true)}
                    onPress={() => {
                      setDevCounter(devCounter + 1);
                    }}>
                    <Image source={theme.loginLogo} style={{width: 300, height: 220, resizeMode: 'contain', marginBottom: 80, marginTop: -60}} />
                  </TouchableWithoutFeedback>
                </View>

                <View style={{alignItems: 'center', width: '100%', paddingTop: 0}}>
                  <NmTextInput
                    containerStyle={{marginTop: 0, borderRadius: 12, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}}
                    textInputStyle={{fontFamily: 'Poppins-Medium', color: theme.textColor}}
                    clearTextButton={true}
                    placeholder="Username or Email"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onKeyPressNm={() => {
                      // if (nativeEvent.key == 'Enter') {
                      //   UserPassRef.focus();
                      // }
                    }}
                  />

                  <NmTextInput
                    ref={UserPassRef} //Add ref to access secureText function
                    containerStyle={{marginTop: 20, borderRadius: 12, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}} //View Style
                    textInputStyle={{fontFamily: 'Poppins-Medium', color: theme.textColor}} //TextInput Style
                    //clearTextButton={true}    //Normal entry input with clear text button
                    secureTextButton={true} //Password entry input with show password button
                    value={password} //TextInput value
                    onChangeText={setPassword} //value state handler (in partner with value state value)
                    placeholder="Password"
                    blurOnSubmit={false}
                    // ref={input => {
                    //   this.passwordField = input;
                    // }}
                  />

                  <View style={{flexDirection: 'row', marginTop: 19}}>
                    <NmButton
                      buttonTheme={'dark'}
                      style={[{flex: 1, borderRadius: 12, width: undefined}]}
                      titleStyle={styles.buttonTextStyle}
                      title="Login"
                      onPress={() => {
                        UserPassRef.current.enableSecureEntry();
                        Login();
                      }}
                    />
                    {mobileLockEnabled && (
                      <TouchableOpacity
                        onPress={() => loginBiometric()}
                        style={{marginLeft: 10, width: 45, height: 45, backgroundColor: NmColors.buttonDark, borderColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                          source={UIConfig.BiometricIcon}
                          style={{
                            tintColor: 'white',
                            height: 36,
                            width: 36,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={[{fontFamily: 'Poppins-Regular', fontSize: 13, textAlign: 'center', marginTop: 15, color: '#AAA', width: '100%', minHeight: 25}]}>{errorMessage}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    //backgroundColor: 'white',
    //justifyContent: 'center',
    //padding: 0,
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
  buttonTextStyle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default V3_LoginOptionScreen;

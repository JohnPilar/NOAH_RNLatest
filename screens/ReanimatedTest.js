import React, {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, KeyboardAvoidingView, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, BackHandler, Platform} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import {useDeviceOrientation} from '@react-native-community/hooks';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import RNRestart from 'react-native-restart';
import RNExitApp from 'react-native-exit-app';

import NmColors from '../constants/NmColors';
import NmStyles from '../constants/NmStyles';
import {NmTextInput, NmModalTerms, NmEndpointPrompt, LoadingScreen, NmBiometricPrompt} from '../components';

import {NmInitUserApprovals, NmSaveSetting, NmRefreshAllNotifications, NmClearAppData, NmHasInternet, NmInitGetUserDetails, NmGetLoginTime, NmCreateWebToken} from '../functions/NmFunctions';
import {NmLogin, NmTermsConditions} from '../functions/NmNetwork';
import {APP_CONST, APP_KEYS} from '../constants/NmConstants';

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

import Animated, {useSharedValue, withTiming, useAnimatedStyle, FadeIn, FadeOut, FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, runOnJS, FadeOutDown} from 'react-native-reanimated';
import {getEndpointDetails} from '../functions/NmEndpoint';
import {ConfigDetails} from '../functions/NmAppConfig';
import {UIConfig} from '../Global/UIConfig';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';

const ReanimatedTest = props => {
  const {recuser, loginToken, loginSetters} = useContext(AccountDetailsContext);
  const {biometricAsked, setBiometricAsked, biometricUse, setBiometricUse} = useContext(AppConfigContext);
  const {EndpointCode} = getEndpointDetails();
  let linkFail = props.route.params?.linkFail;
  let message = props.route.params?.message;
  let loginScreen = props.route.params?.message;

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const orientation = useDeviceOrientation();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [tmpResponse, setTmpResponse] = useState('');
  const UserPassRef = useRef();

  const [userAcc, setUserAcc] = useState();
  const [showModalTaC, setShowModalTaC] = useState(false);
  const [biometricPromptVisible, setBiometricPromptVisible] = useState(false);

  const [changeEndpointVisible, setChangeEndpointVisible] = useState(false);
  const [mobileLockEnabled, setMobileLockedEnabled] = useState(true);
  const [screenWidth, setScreenWidth] = useState('100%');
  const [logoBottomMargin, setLogoBottomMargin] = useState(60);

  const [viewHeight, setViewHeight] = useState();

  const biometricOpacity = useSharedValue(1);
  const inputTopMargin = useSharedValue(80);
  const buttonTopMargin = useSharedValue(40);

  const customErrorColor = useSharedValue(NmColors.errMessageWelcome);
  const buttonTheme = useSharedValue(NmColors.buttonLight);

  const [lightLogoVisible, setLightLogoVisible] = useState(true);
  const [inputsVisible, setInputsVisible] = useState(false);
  const [otherLinksVisible, setOtherLinksVisible] = useState(false);
  const [poweredLogoVisible, setPoweredLogoVisible] = useState(true);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    if (linkFail == true) {
      showError(message);
    }

    // const handleBackButton = () => {
    //   if (!props.navigation.isFocused()) {
    //     return false;
    //   }

    //   if (loading) {
    //     setLoading(false);
    //     return false;
    //   }

    //   BackHandler.exitApp();
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        handleActionButton(false);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [lightLogoVisible, inputsVisible]),
  );

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        //setLogoBottomMargin('75%');
        setScreenWidth('50%');
      } else {
        //setLogoBottomMargin(30);
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    //console.log(viewHeight);
  }, [viewHeight]);

  const Login = () => {
    Keyboard.dismiss();
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        NmLogin(username, password).then(responseData => {
          if (responseData.status == 200) {
            let tmpUser = username.toLowerCase();
            setTmpResponse(responseData);

            if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
              NmTermsConditions(responseData.data[0]['user'], APP_CONST.TAC_LOGIN).then(result => {
                if (result?.status != '404') {
                  if (result.data.TACStatus == '3' || result.data.TACStatus == '2') {
                    initializeUserDetails(responseData);
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
              initializeUserDetails(responseData);
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

  const initializeUserDetails = response => {
    let responseData = response;

    setLoading(true);

    //PORTAL TYPE
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
      NmInitGetUserDetails(responseData.data[0]['user'], responseData.data[0]['access_token']).then(result => {
        if (result) {
          NmRefreshAllNotifications(responseData.data[0]['user']).then(result => {
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
      //setRecname = responseData.data[0]['name'];
      //NmSaveSetting(APP_KEYS.ACCESS_NAME, recname);
    }

    // NmAddLoginHistory(username).then(result => {
    //   console.log('add login test');
    //   if (result == true) {

    if (type == APP_CONST.APP_TYPE_APPROVER) {
      //
    }

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType, error} = resultObject;

      if ((available && biometryType === BiometryTypes.TouchID) || (available && biometryType === BiometryTypes.FaceID) || (available && biometryType === BiometryTypes.Biometrics)) {
        if (biometricAsked == false || biometricAsked == undefined) {
          //offerBiometricLogin();
          setBiometricPromptVisible(true);
        } else {
          goToHomeScreen();
        }
      } else {
        goToHomeScreen();
      }

      resetFields();
    });
    //   }
    // });
  };

  const TACAccepted = () => {
    NmTermsConditions(userAcc, APP_CONST.TAC_UPDATE).then(result => {
      if (result.data.TACStatus == '2') {
        initializeUserDetails(tmpResponse);
      } else {
        showError('Server Error: Please contact customer support (USR_TAC_STAT).');
      }
    });
  };

  const loginWithFingerprint = () => {
    NmHasInternet().then(result => {
      if (result == true) {
        rnBiometrics
          .simplePrompt({promptMessage: 'Confirm biometrics to login'})
          .then(resultObject => {
            const {success} = resultObject;

            if (success) {
              setLoading(true);
              reloginUser();
            }
          })
          .catch(e => {
            setLoading(false);
            showError('Biometrics failed');
          });
      } else {
        showError('No Internet connection detected.');
      }
    });
  };

  function reloginUser() {
    // NmInitGetUserDetails(PrimeUser, loginToken).then(result => {
    //   if (result == true) {

    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
      NmRefreshAllNotifications(recuser).then(result => {
        if (result == true) {
          setLoading(false);
          navigateTo('HomeDrawer');
        }
      });
    }

    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
      NmInitUserApprovals(recuser, loginToken).then(result => {
        if (result == true) {
          setLoading(false);
          navigateTo('HomeDrawer');
        } else {
          showError('Server Error: Please contact customer support (Approval List).');
        }
      });
    }

    //   }
    // });
  }

  function setFingerprintSettings(useFingerprint) {
    NmSaveSetting(APP_KEYS.APP_BIOMETRIC_USE, useFingerprint);
    NmSaveSetting(APP_KEYS.APP_BIOMETRIC_ASKED, true);

    setBiometricUse(useFingerprint);
    setBiometricAsked(true);

    setBiometricPromptVisible(false);
    setLoading(false);

    if (useFingerprint) {
      loginWithFingerprint();
    } else {
      navigateTo('HomeDrawer');
    }
  }

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
    } else {
      loginWithFingerprint();
    }
  }

  function goToHomeScreen() {
    setLoading(false);
    props.navigation.navigate('HomeDrawer');
  }

  function navigateTo(where) {
    props.navigation.navigate(where);
  }

  function showError(err) {
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  }

  function resetFields() {
    setUsername('');
    setPassword('');
    setErrorMessage('');
  }

  //=============================================================
  //=============== Reanimated Styles/Code ======================
  //=============================================================

  const CustomFadeOutLeft = FadeOutLeft.withCallback(finished => {
    if (finished) {
      runOnJS(setInputsVisible)(true);
    }
  });

  const CustomFadeOutRight = FadeOutRight.withCallback(finished => {
    if (finished) {
      runOnJS(setInputsVisible)(false);
    }
  });

  const animBiometricStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(biometricOpacity.value, {duration: 500}),
    };
  });

  const animButtonStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(buttonTheme.value, {duration: 250}),
      marginTop: withTiming(buttonTopMargin.value, {duration: 250}),
    };
  });

  const animInputMarginTop = useAnimatedStyle(() => {
    return {
      paddingTop: withTiming(inputTopMargin.value, {duration: 250}),
    };
  });

  const animErrMessage = useAnimatedStyle(() => {
    return {
      color: withTiming(customErrorColor.value, {duration: 250}),
    };
  });

  const handleActionButton = fromButton => {
    if (fromButton == true) {
      if (lightLogoVisible) {
        setErrorMessage();

        customErrorColor.value = NmColors.errMessageLogin;
        biometricOpacity.value = 0;
        //setLogoBottomMargin(40);
        setLightLogoVisible(false);
        setPoweredLogoVisible(false);
        setInputsVisible(true);
      } else {
        UserPassRef.current.enableSecureEntry();
        Login();
      }
    } else {
      if (!lightLogoVisible) {
        setErrorMessage();

        buttonTheme.value = NmColors.buttonLight;
        // buttonTopMargin.value = 40;
        setOtherLinksVisible(false);

        customErrorColor.value = NmColors.errMessageWelcome;
        biometricOpacity.value = 1;
        //setLogoBottomMargin(80);
        setLightLogoVisible(true);
        setInputsVisible(false);
      } else {
        BackHandler.exitApp();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF'}}>
        <NmModalTerms isVisible={showModalTaC} setShowModalTaC={setShowModalTaC} onAccept={TACAccepted} />

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
              navigateTo('HomeDrawer');
            }}
            onClickNo={() => setFingerprintSettings(false)}
            onClickYes={() => setFingerprintSettings(true)}
          />
        }

        {loading && <LoadingScreen />}
        <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
          <View style={[styles.container]}>
            <NmEndpointPrompt
              winVisible={changeEndpointVisible}
              setWinVisible={setChangeEndpointVisible}
              containerStyle={{}}
              onButtonPress={(EndpointCode, Endpoint) => {
                setChangeEndpointVisible(false);

                if (EndpointCode != APP_CONST.ENDPOINT_CODE_CUS) {
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
                        RNExitApp.exitApp();
                      }, 3000);
                    }
                  });
                } else {
                  navigateTo('EndpointScanner');
                }
              }}
              onClickClose={() => {
                setChangeEndpointVisible(false);
              }}
              title={'Change Endpoint'}
              message={'Current endpoint is:\n' + EndpointCode}
            />

            {/* {backgroundColor: '#1A3763AA'} */}
            {/* <View style={{flex: 1, width: '100%'}}></View> */}

            {/* decrease margintop to 20 */}
            <Animated.View
              style={[{height: viewHeight, alignItems: 'center', width: '100%'}]}
              onLayout={event => {
                const {x, y, width, height} = event.nativeEvent.layout;
                setViewHeight(height);
              }}>
              {/* <View style={{minHeight: '12%', width: '100%'}}></View> */}

              {lightLogoVisible && (
                <Animated.View style={{alignItems: 'center', width: '100%', marginTop: -20}} entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)}>
                  <TouchableWithoutFeedback style={{width: '100%', alignItems: 'center'}} onLongPress={() => setChangeEndpointVisible(true)}></TouchableWithoutFeedback>
                </Animated.View>
              )}

              {!lightLogoVisible && (
                <Animated.View style={{alignItems: 'center', width: '100%', marginTop: -20}} entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)}>
                  <TouchableWithoutFeedback style={{width: '100%', alignItems: 'center'}}></TouchableWithoutFeedback>
                </Animated.View>
              )}

              {!inputsVisible && (
                <Animated.View
                  style={[{alignItems: 'center'}, animInputMarginTop]}
                  entering={FadeInLeft.duration(500).withCallback(finished => {
                    if (finished) {
                      inputTopMargin.value = 80;
                      buttonTopMargin.value = 40;
                      runOnJS(setPoweredLogoVisible)(true);
                    }
                  })}
                  exiting={CustomFadeOutLeft}>
                  {mobileLockEnabled ? (
                    <TouchableOpacity
                      onPress={() => loginBiometric()}
                      style={{width: 76, height: 76, backgroundColor: '#1A3763', borderColor: 'white', borderWidth: 5, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                      <Image
                        source={UIConfig.BiometricIcon}
                        style={{
                          tintColor: 'white',
                          height: 60,
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={{width: 76, height: 76}}></View>
                  )}

                  <View style={{marginTop: 40, flexDirection: 'row', alignItem: 'center', justifyContent: 'center'}}>
                    <View style={[styles.horizontalLine, {marginRight: 20}]}></View>
                    <Text style={styles.textStyle}>{mobileLockEnabled ? ' or Login with' : 'Login with'}</Text>
                    <View style={[styles.horizontalLine, {marginLeft: 20}]}></View>
                  </View>
                </Animated.View>
              )}

              {inputsVisible && (
                <Animated.View
                  style={[animInputMarginTop]}
                  entering={FadeInRight.duration(500).withCallback(finished => {
                    if (finished) {
                      inputTopMargin.value = 50;
                      buttonTopMargin.value = 20;
                      buttonTheme.value = NmColors.buttonDark;
                      runOnJS(setOtherLinksVisible)(true);
                    }
                  })}
                  exiting={CustomFadeOutRight}>
                  <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={{width: '100%'}}>
                    <NmTextInput
                      containerStyle={{marginTop: 29}}
                      textInputStyle={{fontFamily: 'Poppins-Medium'}}
                      clearTextButton={true}
                      placeholder="Email"
                      value={username}
                      onChangeText={setUsername}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onKeyPressNm={({nativeEvent}) => {}}
                    />

                    <NmTextInput
                      ref={UserPassRef} //Add ref to access secureText function
                      containerStyle={{marginTop: 20}} //View Style
                      textInputStyle={{fontFamily: 'Poppins-Medium'}} //TextInput Style
                      //clearTextButton={true}    //Normal entry input with clear text button
                      secureTextButton={true} //Password entry input with show password button
                      value={password} //TextInput value
                      onChangeText={setPassword} //value state handler (in partner with textValue state value)
                      placeholder="*******"
                      blurOnSubmit={false}
                    />
                  </KeyboardAvoidingView>
                </Animated.View>
              )}

              <View style={{width: '100%', alignItems: 'center'}}>
                {/* const buttonStyle = props.buttonTheme == 'dark' ? NmStyles.buttonDark : NmStyles.buttonLight; */}

                <AnimatedButton style={[NmStyles.buttonLight, animButtonStyles]} onPress={() => handleActionButton(true)} disabled={props.disabled}>
                  {!otherLinksVisible && <Animated.Text style={[NmStyles.buttonTextStyle]}>{'Email and Password'}</Animated.Text>}
                  {otherLinksVisible && <Animated.Text style={[NmStyles.buttonTextStyle, {fontFamily: 'Poppins-Bold', fontSize: 14}]}>{'Login'}</Animated.Text>}
                </AnimatedButton>

                <Animated.Text style={[styles.errorMessage, animErrMessage]}>{errorMessage}</Animated.Text>
              </View>

              {otherLinksVisible && (
                <Animated.View style={{marginTop: 5}} entering={FadeIn} exiting={FadeOut}>
                  <Text
                    style={[styles.forgotPasswordLink]}
                    onPress={() => {
                      resetFields();
                      props.navigation.navigate('ResetPasswordForm', {changeType: 0});
                    }}>
                    Forgot Password?
                  </Text>
                  <View style={{flexDirection: 'row', opacity: ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? 1 : 1}}>
                    <Text style={[styles.forgotPasswordLink, {color: 'black'}]}>
                      Don't have an account?{' '}
                      <Text
                        style={styles.forgotPasswordLink}
                        onPress={() => {
                          resetFields();
                          props.navigation.navigate('RegistrationOption');
                        }}>
                        Sign up here
                      </Text>
                    </Text>
                  </View>
                </Animated.View>
              )}

              {poweredLogoVisible && (
                <Animated.View style={{width: '100%', alignItems: 'center'}} entering={FadeIn} exiting={FadeOutDown}>
                  <Image source={UIConfig.PoweredLogo} style={[{height: 44, resizeMode: 'contain', paddingBottom: 10}]} />
                </Animated.View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginVertical: 50,
  },
  svg: {
    height: 100,
    width: '100%',
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
  forgotPasswordLink: {
    alignSelf: 'center',
    //textDecorationLine: 'underline',
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1974D1',
    fontWeight: '500',
  },
  errorMessage: {
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
    width: '100%',
    minHeight: 24,
    padding: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ReanimatedTest;

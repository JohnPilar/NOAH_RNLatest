import React, {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, Platform, ScrollView, View, TouchableWithoutFeedback, Keyboard, BackHandler, DimensionValue} from 'react-native';

import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';

import {
  NmInitGetUserDetails,
  NmCreateWebToken,
  NmInitUserApprovals,
  NmSaveSetting,
  NmGetLoginTime,
  NmHasInternet,
  NmRefreshAllNotifications,
  NmInitializeDrawer,
  NmClearLoginData,
  NmStringUCaseTrim,
  NmGetSetting,
} from '../functions/NmFunctions';
import {NmLogin, NmTermsConditions, NmGetMobileAppData} from '../functions/NmNetwork';
import {APP_CONST, APP_KEYS} from '../constants/NmConstants';

import {NmButton, NmTextInput, LoadingScreen, NmModalTerms, NmBiometricPrompt, NmLabel} from '../components';
import {ThemesContext} from '../functions/ThemeContext';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {ConfigDetails} from '../functions/NmAppConfig';

import {getEndpointDetails} from '../functions/NmEndpoint';
import {INmInitGetUserDetails} from '../constructs/interfaces/NmFunctionsInterface.tsx';
import {StackScreenProps} from '../navigation/NavigationTypes.tsx';

const ApiConfig = {
  get url(): string | undefined {
    return getEndpointDetails().Endpoint;
  },
  get code(): string | undefined {
    return getEndpointDetails().EndpointCode;
  },
  get edp(): boolean | undefined {
    return getEndpointDetails().StandardEndpoint;
  },
};

type Props = StackScreenProps<'LoginScreen'>;

const LoginScreen = ({navigation}: Props) => {
  const {theme} = useContext(ThemesContext);
  const {biometricAsked, setBiometricAsked, setBiometricUse, AssetManager} = useContext(AppConfigContext);
  const {recuser, loginSetters, notifManager, noahStandard} = useContext(AccountDetailsContext);
  const orientation = useDeviceOrientation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorPanel, setShowErrorPanel] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [userAcc, setUserAcc] = useState<any>();
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tmpResponse, setTmpResponse] = useState<any>();
  const [tmpUserDetails, setTmpUserDetails] = useState<any>();
  const [showModalTaC, setShowModalTaC] = useState<boolean>(false);
  const [biometricPromptVisible, setBiometricPromptVisible] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const UserPassRef = useRef<any>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const pressStartTime = useRef<number>(0);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    const handleBackButton = () => {
      if (loading == true) {
        setLoading(false);
        return false;
      }

      if (!navigation.isFocused()) {
        return false;
      }

      (async () => {
        await NmSaveSetting(APP_KEYS.NOTIF_CURRENT_DATA, undefined);
        await NmSaveSetting(APP_KEYS.NOTIF_ACTION_CLICK, undefined);
      })();

      navigation.navigate('LoginOptionScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  function setFingerprintSettings(useFingerprint: boolean): void {
    setBiometricUse(useFingerprint);
    setBiometricAsked(true);

    setBiometricPromptVisible(false);
    setLoading(false);

    if (useFingerprint) {
      const responseData = tmpResponse;

      (async () => {
        const loginTime = NmGetLoginTime();
        const endpointUsers = (await NmGetSetting(APP_KEYS.ENDPOINT_CREDENTIALS)) || [];

        const userDetails = {
          EndpointCode: ApiConfig.code,
          UserCode: username.toUpperCase(),
          UserDescription: tmpUserDetails?.Username,
          LoginToken: responseData.data[0]['access_token'],
          LoginTokenExpire: responseData.data[0]['expires'],
          LoginTime: loginTime,
          AccountToken: tmpUserDetails?.AccessToken,
          CompanyToken: tmpUserDetails?.CompanyToken,
          Accounts: tmpUserDetails?.Accounts,
          BiometricAsked: true,
          BiometricUse: useFingerprint,
          DarkTheme: false,
        };

        if (endpointUsers && endpointUsers.length > 0) {
          const savedUserDetails = endpointUsers.find((val: any) => val.EndpointCode == ApiConfig.code);

          if (savedUserDetails) {
            const updatedUsers = endpointUsers.map((item: any) => (item.EndpointCode == ApiConfig.code ? userDetails : item));
            await NmSaveSetting(APP_KEYS.ENDPOINT_CREDENTIALS, updatedUsers);
          } else {
            endpointUsers.push(userDetails);
            await NmSaveSetting(APP_KEYS.ENDPOINT_CREDENTIALS, endpointUsers);
          }
        } else {
          endpointUsers.push(userDetails);
          await NmSaveSetting(APP_KEYS.ENDPOINT_CREDENTIALS, endpointUsers);
        }
      })();

      loginWithFingerprint();
    } else {
      navigateTo('HomeDrawer');
    }
  }
  function navigateTo(where: string): void {
    resetFields();
    navigation.navigate(where as never);
  }

  const loginWithFingerprint = (): void => {
    rnBiometrics
      .simplePrompt({promptMessage: 'Confirm biometrics to continue'})
      .then(resultObject => {
        const {success} = resultObject;

        if (success) {
          navigateTo('HomeDrawer');
        } else {
          setBiometricAsked(false);
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  };

  function resetFields(): void {
    setUsername('');
    setPassword('');
    setErrorMessage('');
  }

  function goToHomeScreen(): void {
    NmGetMobileAppData().then(responseData => {
      const tempAppItems: Record<string, unknown> = {};

      tempAppItems.Module = responseData.Module;
      tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
      tempAppItems.MenuDriven = responseData.MenuDriven;

      AssetManager.setAppitems(tempAppItems);

      NmInitializeDrawer(AssetManager, tempAppItems).then(() => {
        resetFields();
        setLoading(false);
        navigation.navigate('HomeDrawer');
      });
    });
  }

  const Login = (): void => {
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

            if (!showErrorPanel) {
              showError(responseData.message);
            }
          }
        });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };

  const initUserDetails = (response: any): void => {
    const responseData = response;

    setLoading(true);

    // PORTAL TYPE (STANDARD)
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
      NmInitGetUserDetails(responseData.data[0]['user'], responseData.data[0]['access_token'], loginSetters, noahStandard).then((response: unknown) => {
        const result = response as INmInitGetUserDetails;
        if (result) {
          setTmpUserDetails(result?.data);

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

    // APPROVER TYPE
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
      NmInitUserApprovals(responseData.data[0]['user'], NmCreateWebToken(responseData.data[0]['access_token'])).then((response: unknown) => {
        const result = response as INmInitGetUserDetails;
        if (result?.status == true) {
          setTmpUserDetails(result?.data);
          completeLogin(responseData, APP_CONST.APP_TYPE_APPROVER);
        } else {
          setLoading(false);
          showError('Server Error: Please contact customer support (Approval List).');
        }
      });
    }
  };

  const completeLogin = (response: any, type: number): void => {
    const responseData = response;

    loginSetters.setLoginToken(NmCreateWebToken(responseData.data[0]['access_token']));
    loginSetters.setTokenExpiration(responseData.data[0]['expires']);
    loginSetters.setLastLogin(NmGetLoginTime());
    loginSetters.setRecuser(username.toUpperCase());

    if (type == APP_CONST.APP_TYPE_APPROVER) {
      loginSetters.setLoginToken(NmCreateWebToken(responseData.data[0]['access_token']));
    }

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if ((available && biometryType == BiometryTypes.TouchID) || (available && biometryType == BiometryTypes.FaceID) || (available && biometryType == BiometryTypes.Biometrics)) {
        if (biometricAsked == false || biometricAsked == undefined) {
          setBiometricPromptVisible(true);
        } else {
          goToHomeScreen();
        }
      } else {
        goToHomeScreen();
      }

      // resetFields();
    });
  };

  const TACAccepted = (): void => {
    setLoading(true);

    NmTermsConditions(userAcc, APP_CONST.TAC_UPDATE).then(result => {
      if (result.data.TACStatus == '2') {
        initUserDetails(tmpResponse);
      } else {
        showError('Server Error: Please contact customer support (USR_TAC_STAT).');
      }
    });
  };

  const showError = (err: string): void => {
    setShowErrorPanel(true);
    setErrorMessage(err);

    setTimeout(() => {
      setShowErrorPanel(false);
      setErrorMessage('');
    }, 7000);
  };

  const handlePressIn = (): void => {
    pressStartTime.current = Date.now();
  };

  const handlePressOut = (): void => {
    const duration = Date.now() - pressStartTime.current;
    const type = duration < APP_CONST.EDP_TAPTHRESHOLD ? 'dot' : 'dash';

    if (type == APP_CONST.EDP_PATTERN[currentStep]) {
      const nextStep = currentStep + 1;

      if (nextStep == APP_CONST.EDP_PATTERN.length) {
        navigation.navigate('NmDevTools', {userIntent: true});
        setCurrentStep(0);
      } else {
        setCurrentStep(nextStep);
      }
    } else {
      setCurrentStep(0);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -140 : 0} style={{flex: 1}}>
        <View style={{flex: 1, alignItems: 'center', backgroundColor: theme.loginBackgroundColor}}>
          <NmModalTerms isVisible={showModalTaC} setShowModalTaC={setShowModalTaC} onAccept={TACAccepted} />

          <NmBiometricPrompt
            isVisible={biometricPromptVisible}
            setIsVisible={setBiometricPromptVisible}
            title={'Use Biometric Authentication'}
            message={'Your device is currently using Biometrics to enable some features, do you want to use it for faster login?'}
            onClickLater={() => {
              resetFields();
              setLoading(false);
              navigateTo('HomeDrawer');
            }}
            onClickNo={() => setFingerprintSettings(false)}
            onClickYes={() => setFingerprintSettings(true)}
          />

          {loading ? <LoadingScreen /> : null}

          <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
            <View style={[styles.container, {backgroundColor: theme.loginBackgroundColor}]}>
              <View style={{width: '100%', alignItems: 'center'}}>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onLongPress={() => {
                    // navigation.navigate('NmDevTools', { userIntent: true });
                  }}>
                  <Image
                    source={theme.logo.loginMain}
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

              <View style={{width: '100%'}}>
                <NmTextInput
                  containerStyle={{marginTop: 40}}
                  textInputStyle={{fontFamily: 'Poppins-Medium'}}
                  clearTextButton={true}
                  placeholder="Username or Email"
                  value={username}
                  onChangeText={setUsername}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onKeyPressNm={({nativeEvent}: any) => {
                    // if (nativeEvent.key == 'Enter') {
                    //   UserPassRef.current?.focus();
                    // }
                  }}
                />

                <NmTextInput
                  ref={UserPassRef}
                  containerStyle={{marginTop: 20}}
                  textInputStyle={{fontFamily: 'Poppins-Medium'}}
                  secureTextButton={true}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="*******"
                  blurOnSubmit={false}
                />

                <NmButton
                  buttonTheme={'dark'}
                  style={styles.buttonStyle}
                  titleStyle={styles.buttonTextStyle}
                  title="Login"
                  onPress={() => {
                    UserPassRef.current?.enableSecureEntry();
                    Login();
                  }}
                />
              </View>

              <View style={[styles.errorMessageContainer, {opacity: showErrorPanel ? 1 : 0}]}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>

              <NmLabel
                style={[styles.forgotPasswordLink, {color: '#1974D1'}]}
                onPress={() => {
                  resetFields();
                  navigation.navigate('ResetPasswordForm', {changeType: 0});
                }}>
                {'Forgot Password?'}
              </NmLabel>

              <View
                style={{
                  flexDirection: 'row',
                  opacity: ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? 1 : 0,
                }}>
                <NmLabel style={[styles.forgotPasswordLink, {color: theme.loginHelpText}]}>
                  {"Don't have an account? "}
                  <Text
                    style={[styles.forgotPasswordLink, {color: '#1974D1'}]}
                    onPress={() => {
                      resetFields();
                      navigation.navigate('RegistrationOption');
                    }}>
                    {'Sign up here'}
                  </Text>
                </NmLabel>
              </View>
            </View>
          </ScrollView>
        </View>
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
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 16,
    //padding: 0,
  },
  textInputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    //borderColor: '#bec8d9',
  },
  textInputStyle: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    borderRadius: 6,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
  buttonStyle: {
    marginTop: 20,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  errorMessageContainer: {
    marginTop: 10,
    width: '100%',
  },
  errorMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#DF3E3E',
    textAlign: 'center',
    fontWeight: '400',
    padding: 10,
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;

import {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, BackHandler} from 'react-native';

import {NmStyles} from '../../constants';
import {NmTextInput, NmButton, NmCheckbox, LoadingScreen, NmBiometricPrompt, NmEndpointPrompt} from '../../components';
import {NmGetTodayTimeRecords, NmLogin} from '../../functions/NmNetwork';
import {NmHasInternet, NmInitGetUserDetails, NmCreateWebToken, NmSaveSetting} from '../../functions/NmFunctions';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {APP_CONST, APP_KEYS} from '../../constants/NmConstants';
import {NmGetLoginTime} from '../../functions/NmFunctions';
import RNExitApp from 'react-native-exit-app';
import {ThemesContext} from '../../functions/ThemeContext';
import {AccountDetailsContext, AppConfigContext} from '../../functions/Contexts';
import {getEndpointDetails} from '../../functions/NmEndpoint';
import {UIConfig} from '../../Global/UIConfig';

function LoginVariantOne(props) {
  const {recuser, loginToken, loginSetters, noahStandard} = useContext(AccountDetailsContext);
  const {biometricAsked, setBiometricAsked, biometricUse, setBiometricUse} = useContext(AppConfigContext);
  const {EndpointCode} = getEndpointDetails();
  const [username, setUsername] = useState('');
  const [userpass, setUserpass] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errResponse, setErrResponse] = useState('');
  const [biometricPromptVisible, setBiometricPromptVisible] = useState(false);
  const [changeEndpointVisible, setChangeEndpointVisible] = useState(false);
  const {theme} = useContext(ThemesContext);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    const handleBackButton = () => {
      if (!props.navigation.isFocused()) {
        return false;
      }

      if (loading) {
        setLoading(false);
        return false;
      }

      RNExitApp.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => backHandler.remove();
  }, []);

  const Login = () => {
    if (username == '' || userpass == '' || username == undefined || userpass == undefined) {
      showError('Please provide your username and passowrd');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        NmLogin(username, userpass).then(responseData => {
          if (responseData.status == 200) {
            initializeUser(responseData);
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

  function showError(message) {
    setErrResponse(message);
    setTimeout(() => {
      setErrResponse('');
    }, 5000);
  }

  function initializeUser(responseData) {
    NmInitGetUserDetails(responseData.data[0]['user'], responseData.data[0]['access_token'], loginSetters, noahStandard).then(result => {
      if (result) {
        completeLogin(responseData, APP_CONST.APP_TYPE_PORTAL);
      } else {
        setLoading(false);
        showError('Cannot get user details');
      }
    });
  }

  function completeLogin(response, type) {
    const responseData = response;

    loginSetters.setLoginToken(NmCreateWebToken(responseData.data[0]['access_token']));
    loginSetters.setTokenExpiration(responseData.data[0]['expires']);

    NmSaveSetting(APP_KEYS.ACCESS_TOKEN, responseData.data[0]['access_token']);
    NmSaveSetting(APP_KEYS.ACCESS_TOKEN_EXPIRE, responseData.data[0]['expires']);
    NmSaveSetting(APP_KEYS.ACCESS_LOGIN_TIME, NmGetLoginTime());

    // if (type == APP_CONST.APP_TYPE_APPROVER) {
    // }

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType, error} = resultObject;

      if ((available && biometryType === BiometryTypes.TouchID) || (available && biometryType === BiometryTypes.FaceID) || (available && biometryType === BiometryTypes.Biometrics)) {
        if (biometricAsked == false || biometricAsked == undefined) {
          setBiometricPromptVisible(true);
        } else {
          GetUserTimeData();
        }
      } else {
        GetUserTimeData();
      }
      resetFields();
    });
  }

  function resetFields() {
    setUsername('');
    setUserpass('');
    setErrResponse('');
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
      GetUserTimeData();
    }
  }

  function loginWithFingerprint() {
    rnBiometrics
      .simplePrompt({promptMessage: 'Confirm biometrics to continue'})
      .then(resultObject => {
        const {success} = resultObject;

        if (success) {
          setLoading(true);
          GetUserTimeData();
        } else {
          setBiometricAsked(false);
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  }

  function checkLoginStatus() {
    if (biometricUse == false && biometricAsked == true) {
      showError('Biometric login disabled.');
      return;
    }
    if (biometricUse == false || biometricUse == undefined) {
      showError('Please login first to enable biometric login.');
      return;
    }
    if (loginToken == undefined || loginToken == '' || recuser == '') {
      showError('Please login first to enable biometric login.');
      return;
    } else {
      loginWithFingerprint();
    }
  }

  function GetUserTimeData() {
    NmGetTodayTimeRecords(recuser, loginToken).then(response => {
      setLoading(false);
      if (response.status == '200') {
        const clockData = response.data;

        props.navigation.navigate('ClockingHome', {clockedData: clockData});
      } else {
        showError('Error occured when fetching user data.');
      }
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {loading ? <LoadingScreen /> : null}
        {
          <NmBiometricPrompt
            isVisible={biometricPromptVisible}
            setIsVisible={setBiometricPromptVisible}
            title={'Use Biometric Authentication'}
            message={'Your device is currently using Biometrics to enable some features, do you want to use it for faster login?'}
            onClickLater={() => {
              GetUserTimeData();
            }}
            onClickNo={() => setFingerprintSettings(false)}
            onClickYes={() => setFingerprintSettings(true)}
          />
        }

        {
          <NmEndpointPrompt
            winVisible={changeEndpointVisible}
            setWinVisible={setChangeEndpointVisible}
            containerStyle={{}}
            hideUAT={true}
            hideSIT={true}
            onButtonPress={(EndpointCode, Endpoint) => {
              setChangeEndpointVisible(false);

              switch (EndpointCode) {
                case APP_CONST.ENDPOINT_CODE_CUS: {
                  props.navigation.navigate('EndpointScanner');
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
        }

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 0}}>
          <TouchableWithoutFeedback onLongPress={() => setChangeEndpointVisible(true)}>
            <Image source={theme.logo.login} style={styles.logo} />
          </TouchableWithoutFeedback>
          <Text style={[NmStyles.poppinsRegular, {fontSize: 18, color: '#000'}]}>{'Please login to your account'}</Text>

          <Text style={[NmStyles.poppinsRegular, {fontSize: 18, color: '#888', marginTop: 20}]}>{'Username'}</Text>
          <NmTextInput value={username} onChangeText={setUsername} clearTextButton={true} />

          <Text style={[NmStyles.poppinsRegular, {fontSize: 18, color: '#888', marginTop: 20}]}>{'Password'}</Text>
          <NmTextInput value={userpass} onChangeText={setUserpass} secureTextButton={true} />
          <NmCheckbox
            value={remember}
            onValueChange={setRemember}
            label={'Remember me'}
            labelStyle={{color: '#888', marginBottom: -3, fontSize: 16}}
            style={{width: '50%', justifyContent: 'left', alignItems: 'center'}}
            containerStyle={{marginTop: 6, opacity: 0.7}}
            checkboxStyle={{marginLeft: -4}}
            androidTransform={[{scaleX: 1.1}, {scaleY: 1.1}]}
          />

          <NmButton title={'Login'} style={[NmStyles.buttonDark, {marginTop: 26, height: 48}]} titleStyle={{fontSize: 18}} onPress={Login} />
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={styles.errText}>{errResponse}</Text>
          </View>

          <View style={{width: '100%', alignItems: 'center', marginTop: 70}}>
            <TouchableOpacity onPress={() => checkLoginStatus()} style={{width: 76, height: 76, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={UIConfig.BiometricIcon}
                style={{
                  tintColor: '#DDD',
                  height: 70,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 100,
    width: '65%',
    resizeMode: 'contain',
    marginLeft: -60,
    marginBottom: 10,
  },
  errText: {
    marginTop: 3,
    fontSize: 14,
    color: 'red',
  },
});

export default LoginVariantOne;

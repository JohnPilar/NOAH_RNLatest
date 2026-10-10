import React, {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, TextInput, ScrollView, View, TouchableWithoutFeedback, Keyboard, BackHandler, DimensionValue, Platform} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions.tsx';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {NmResendEmailOTP, NmValidateOTP, NmResendOTPCode} from '../../functions/NmNetwork.tsx';
import {NmHasInternet} from '../../functions/NmFunctions.tsx';
import {APP_CONST} from '../../constants/NmConstants.js';

import {NmButton, LoadingScreen} from '../../components/index.jsx';
import {ThemesContext} from '../../functions/ThemeContext.tsx';
import {UIConfig} from '../../Global/UIConfig.js';
import {AccountDetailsContext} from '../../functions/Contexts.tsx';
import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'OTPEmail'>;

const OTPEmail = ({navigation, route}: Props): React.JSX.Element => {
  const otpInput = useRef<React.ComponentRef<typeof TextInput>>(null);

  const orientation = useDeviceOrientation();

  const {theme} = useContext(ThemesContext);
  const {recuser} = useContext(AccountDetailsContext);

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [mobileOTP, setMobileOTP] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resendDecor, setResendDecor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {ChangeEmail, user, pwtku, newAccount, changeType} = route.params;

  useEffect(() => {
    const handleBackButton = () => {
      if (loading) {
        setLoading(false);
        return false;
      }

      if (ChangeEmail == true) {
        navigation.goBack();
      } else {
        if (changeType == 1) {
          navigation.pop();
          navigation.navigate('Home');
          return true;
        } else {
          navigation.navigate('LoginOptionScreen');
          return true;
        }
      }
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

  const checkOTP = (): void => {
    Keyboard.dismiss();
    setLoading(true);

    NmValidateOTP(user, mobileOTP).then(result => {
      setLoading(false);

      if (result?.status != '404') {
        const otpStatus = result?.data?.OTPStatus;

        if (otpStatus == APP_CONST.OTP_RESULT_VALID) {
          if (ChangeEmail == true) {
            navigation.navigate('NewEmail', {
              user,
            });
          } else {
            if (newAccount == false) {
              navigation.navigate('NewPassword', {
                newAccount: false,
                pwtku,
              });
            }
          }
        } else if (otpStatus == APP_CONST.OTP_RESULT_INVALID) {
          showError('Error: Invalid OTP Code. Please try again.');
          clearText();
        } else if (otpStatus == APP_CONST.OTP_RESULT_EXPIRED) {
          showError('Error: OTP Code Expired. Please request a new one.');
        } else {
          showError('Error: Unknown error occured.');
        }
      } else {
        showError('Error: Unable to request new OTP code');
      }
    });
  };

  const TIMER_COOLDOWN = 120;

  const [timerCount, setTimerCount] = useState<number>(TIMER_COOLDOWN);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const timerText = `${String(Math.floor(timerCount / 60)).padStart(2, '0')}:${String(timerCount % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!timerActive) {
      return;
    }

    const interval = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          return TIMER_COOLDOWN;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  function startTimer(): void {
    setTimerCount(TIMER_COOLDOWN);
    setTimerActive(true);
  }

  function clearText(): void {
    otpInput.current?.clear();
  }

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  return (
    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -50 : -70} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
          {/* <View style={{height: 100}}></View> */}
          <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%', paddingHorizontal: 16}} keyboardShouldPersistTaps="handled">
            <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1}}>
              {loading ? <LoadingScreen /> : null}

              <View style={{width: '100%', alignItems: 'center'}}>
                <Image source={UIConfig.RegOTPEmailIcon} style={{height: 150, resizeMode: 'contain', marginBottom: 40}} />
                <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Enter OTP Verification'}</Text>
                <Text style={styles.iconDescription}>{'Enter verification code sent to your email address'}</Text>
              </View>

              <View style={{minHeight: 24, width: '100%', justifyContent: 'center', marginTop: 10}}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>

              <View style={[styles.textInputContainer, {marginTop: 20, marginBottom: 20, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
                <TextInput ref={otpInput} maxLength={16} style={[styles.textInputStyle, {color: theme.textColor}]} onChangeText={value => setMobileOTP(value)} value={mobileOTP} />
              </View>

              <View style={{width: '100%'}}>
                <NmButton
                  buttonTheme="dark"
                  titleStyle={styles.buttonTextStyle}
                  title="Submit"
                  onPress={() => {
                    Keyboard.dismiss;
                    NmHasInternet().then(result => {
                      if (result == true) {
                        checkOTP();
                      } else {
                        showError('No Internet connection detected.');
                      }
                    });
                  }}
                />
              </View>

              <Text style={[styles.resendCodeLink, {color: theme.textColor}]}>
                {"Didn't Receive Code?"}
                {!timerActive && (
                  <Text
                    style={[styles.resendCodeLink, {textDecorationLine: resendDecor ? 'underline' : 'none'}]}
                    onPress={() => {
                      if (!timerActive) {
                        NmHasInternet().then(result => {
                          if (result == true) {
                            setLoading(true);
                            let APIResult = {} as any;
                            if (ChangeEmail == true) {
                              NmResendEmailOTP(APP_CONST.OTP_TYPE_EMAIL, recuser).then(result => {
                                APIResult = result;
                                setLoading(false);
                              });
                            } else {
                              NmResendOTPCode(APP_CONST.OTP_TYPE_EMAIL, user).then(result => {
                                APIResult = result;
                                setLoading(false);
                              });
                            }

                            if (APIResult?.status == '200') {
                              setMobileOTP('');
                              startTimer();
                            } else {
                              showError('Error Requesting New OTP Code');
                            }

                            clearText();
                            setErrorMessage('');
                          } else {
                            showError('No Internet connection detected.');
                          }
                        });
                      }
                    }}>
                    {' '}
                    {'Resend New Code'}
                  </Text>
                )}
              </Text>

              <Text style={[styles.errorMessage, {color: '#777', opacity: timerActive ? 1 : 0, marginBottom: 5}]}>
                {'Resend code after '}
                <Text style={{color: '#466DC6'}}>{timerText}</Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.6)',
    zIndex: 1,
  },
  iconTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#13151B',
  },
  iconDescription: {
    width: '60%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A4A8B0',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 60,
  },
  textInputContainer: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    //borderColor: '#bec8d9',
  },
  textInputStyle: {
    height: 45,
    paddingVertical: 0,
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  actionButtons: {
    backgroundColor: '#7F8083',
    borderRadius: 6,
    width: '100%',
    height: 45,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  errorMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#ff005e',
    textAlign: 'center',
    fontWeight: '400',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#777',
    height: 40,
    color: '#000',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    fontWeight: '800',
    color: '#333',
    fontSize: 12,
  },
  labels: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  resendCodeLink: {
    alignSelf: 'center',
    //textDecorationLine: 'underline',
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#466DC6',
    fontWeight: '500',
  },
  inputs: {
    flex: 2,
  },
});

export default OTPEmail;

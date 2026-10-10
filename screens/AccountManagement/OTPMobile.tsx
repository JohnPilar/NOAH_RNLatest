import React, {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, Image, ScrollView, View, TouchableWithoutFeedback, Keyboard, BackHandler, DimensionValue, Platform} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {NmHasInternet} from '../../functions/NmFunctions';
import {NmResendOTPCode, NmResendRegOTPCode, NmValidateOTP, NmSendRegConfirmation} from '../../functions/NmNetwork';
import {APP_CONST} from '../../constants/NmConstants';

import {NmButton, LoadingScreen, NmMobileOTP} from '../../components';
import {ThemesContext} from '../../functions/ThemeContext';
import {UIConfig} from '../../Global/UIConfig';
import {AccountDetailsContext} from '../../functions/Contexts';
import {getEndpointDetails} from '../../functions/NmEndpoint';

import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'OTPMobile'>;

const OTPMobile = ({navigation, route}: Props): React.JSX.Element => {
  const otpInput = useRef<any>(null);
  const OTPInputRef = useRef<any>(null);

  const orientation = useDeviceOrientation();
  const {loginSetters} = useContext(AccountDetailsContext);
  const {theme} = useContext(ThemesContext);
  const {Endpoint} = getEndpointDetails();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const [mobileOTP, setMobileOTP] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resendDecor, setResendDecor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {mobToken, newAccount, userDetails, proofData, selfieData, userExists, userLoggedIn, changeType, user, pwtku} = route.params ?? {};

  const tmpUserDetails = {...userDetails};

  const OTPUser = user ?? userDetails?.accountEmailInfo;
  const OTPInputCount = 6;

  useEffect(() => {
    const handleBackButton = () => {
      if (loading) {
        setLoading(false);
        return true;
      }

      if (userLoggedIn === true) {
        navigation.pop();
        navigation.navigate('SettingsScreen');
        return true;
      }

      if (changeType === 1) {
        navigation.pop();
        navigation.navigate('SettingsScreen');
        return true;
      }

      if (changeType === 'NEW_REG') {
        navigation.goBack();
        return true;
      }

      navigation.navigate('LoginOptionScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, [loading, userLoggedIn, changeType, navigation]);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() === 'TABLET') {
      if (orientation === 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {}, []);

  const checkOTP = (): void => {
    Keyboard.dismiss();
    setLoading(true);

    NmValidateOTP(OTPUser, mobileOTP).then(result => {
      if (result?.status !== '404') {
        const OTPStatus = result?.data?.OTPStatus;

        if (OTPStatus === APP_CONST.OTP_RESULT_VALID) {
          if (newAccount === true) {
            uploadIDProof();
          } else {
            navigation.navigate('NewPassword', {
              newAccount: false,
              pwtku,
            });
          }
        } else if (OTPStatus === APP_CONST.OTP_RESULT_INVALID) {
          clearOTP();
          setLoading(false);
          showError('Error: Invalid OTP Code. Please try again.');
        } else if (OTPStatus === APP_CONST.OTP_RESULT_EXPIRED) {
          clearOTP();
          setLoading(false);
          showError('Error: OTP Code Expired. Please request a new one.');
        } else {
          setLoading(false);
          showError('Error: Unknown error occured.');
        }
      } else {
        setLoading(false);
        showError('Error: Unable to request new OTP code');
      }
    });
  };

  function clearOTP(): void {
    try {
      OTPInputRef.current?.clearText?.();
    } catch (error) {
      console.log('clearOTP', error);
    }

    setMobileOTP('');
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const beginRegistration = (): void => {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result === true) {
        const parentCode = userExists === true ? 0 : 1;

        const completeUserDetails = tmpUserDetails;
        const stringObj = JSON.stringify(completeUserDetails);

        ReactNativeBlobUtil.config({})
          .fetch('POST', `${Endpoint}APIM/RegisterNew?_token=${mobToken}&_parent=${parentCode}`, {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; ',
            userInfo: stringObj,
          })
          .then(response => response.json())
          .then(responseData => {
            if (responseData.status === 200) {
              const refCode = responseData.data.RefCode;

              loginSetters.setRecuser(userDetails.accountEmailInfo);

              NmSendRegConfirmation(userDetails.accountEmailInfo, refCode).then(() => {
                navigation.navigate('RegistrationSubmitted', {
                  userLoggedIn,
                  regReferenceNo: refCode,
                });
              });
            } else {
              setLoading(false);
              showError('An error occured while submitting your account details. Please contact customer support.');
            }
          })
          .catch(() => {
            setLoading(false);
            showError('An error occured while submitting your account details. Please contact customer support.');
          });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };
  const uploadIDProof = (): void => {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result === true) {
        try {
          ReactNativeBlobUtil.config({})
            .fetch(
              'POST',
              `${Endpoint}APIM/UploadIDProof?_usercode=${userDetails.accountNoInfo}&_compcode=${userDetails.accountProperty}`,
              {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data; ',
              },
              [
                {
                  name: proofData?.name,
                  filename: proofData?.fileName,
                  data: ReactNativeBlobUtil.wrap(proofData?.uri ?? ''),
                  type: proofData?.type,
                },
              ],
            )
            .then(response => response.json())
            .then(responseData => {
              if (responseData.status === '200') {
                tmpUserDetails.accountIdPath = responseData.data.subpath;
                uploadSelfieProof();
              } else {
                setLoading(false);
                showError(`Error uploading Id Proof B: ${responseData.message}`);
              }
            })
            .catch(() => {
              setLoading(false);
              showError('ID File Error: Please try selecting a different file');
            });
        } catch (err) {
          setLoading(false);
          showError(`ID Error: ${String(err)}`);
        }
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const uploadSelfieProof = (): void => {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result === true) {
        try {
          ReactNativeBlobUtil.config({})
            .fetch(
              'POST',
              `${Endpoint}APIM/UploadSelfieProof?_usercode=${userDetails.accountNoInfo}&_compcode=${userDetails.accountProperty}`,
              {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data; ',
              },
              [
                {
                  name: selfieData?.name,
                  filename: selfieData?.fileName,
                  data: ReactNativeBlobUtil.wrap(selfieData?.uri ?? ''),
                  type: selfieData?.type,
                },
              ],
            )
            .then(response => response.json())
            .then(responseData => {
              if (responseData.status === '200') {
                tmpUserDetails.accountSelfiePath = responseData.data.subpath;
                beginRegistration();
              } else {
                setLoading(false);
                showError(`Error uploading Selfie Proof: ${responseData.message}`);
              }
            })
            .catch(() => {
              setLoading(false);
              showError('Selfie File Error: Please try selecting a different file');
            });
        } catch (err) {
          setLoading(false);
          showError(`Selfie Error: ${String(err)}`);
        }
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
          clearInterval(interval);
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

  const clearText = (): void => {
    otpInput.current?.clear?.();
  };

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  return (
    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -90 : -70} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {backgroundColor: theme.otpmBackground}]}>
          {/* <View style={{height: 100}}></View> */}
          <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%', paddingHorizontal: 16}} keyboardShouldPersistTaps="handled">
            <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1, marginTop: 0}}>
              {loading ? <LoadingScreen /> : null}

              <View style={{width: '100%', alignItems: 'center', marginTop: 0}}>
                <Image source={UIConfig.RegOTPMobileIcon} style={{height: 150, resizeMode: 'contain', marginBottom: 40}} />
                <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Enter OTP Verification'}</Text>
                <Text style={styles.iconDescription}>{'Enter verification code sent your registered number'}</Text>
              </View>

              <View style={{minHeight: 24, width: '100%', justifyContent: 'center', marginTop: 10}}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>

              <View style={[{width: '100%', justifyContent: 'center', marginTop: 20, marginBottom: 20}]}>
                {/* <Text style={styles.errorMessage}>{'Custom OTP Component'}</Text> */}
                <NmMobileOTP
                  ref={OTPInputRef}
                  inputCount={OTPInputCount}
                  onOTPChange={(value: string) => {
                    setMobileOTP(value);
                  }}
                  textInputContainerStyle={{marginHorizontal: 8}}
                />
              </View>

              <View style={{width: '100%'}}>
                <NmButton
                  buttonTheme="dark"
                  style={{}}
                  titleStyle={styles.buttonTextStyle}
                  title="Submit"
                  onPress={() => {
                    Keyboard.dismiss;
                    NmHasInternet().then(result => {
                      if (result == true) {
                        if (mobileOTP.length < OTPInputCount) {
                          showError('Please enter the OTP code correctly.');
                        } else {
                          checkOTP();
                        }
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
                            if (newAccount == true) {
                              NmResendRegOTPCode(userDetails.accountEmailInfo, userDetails.accountPhoneInfo, userDetails.accountProperty).then(result => {
                                setLoading(false);
                                if (result.status == '200') {
                                  clearOTP();
                                  startTimer();
                                  setTimerActive(true);
                                } else {
                                  showError('Error Requesting New OTP Code');
                                }
                              });
                            } else {
                              NmResendOTPCode(APP_CONST.OTP_TYPE_SMS, user).then(result => {
                                setLoading(false);
                                let resultStatus = result.status;
                                if (resultStatus == '200') {
                                  clearOTP();
                                  startTimer();
                                  setTimerActive(true);
                                } else {
                                  showError('Error Requesting New OTP Code');
                                }
                              });
                            }
                            clearOTP();
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
  resendCodeLink: {
    alignSelf: 'center',
    //textDecorationLine: 'underline',
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#466DC6',
    fontWeight: '500',
  },
});

export default OTPMobile;

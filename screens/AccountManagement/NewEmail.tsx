import React, {useState, useEffect, useRef, useContext} from 'react';
import {Text, StyleSheet, TextInput, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, BackHandler, Platform, DimensionValue} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNRestart from 'react-native-restart';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, interpolate} from 'react-native-reanimated';

import {NmCheckRegCount} from '../../functions/NmNetwork';
import {NmHasInternet, NmClearLoginData, NmCheckEmailFormat} from '../../functions/NmFunctions';

import {NmButton, LoadingScreen, NmModal} from '../../components';
import {ThemesContext} from '../../functions/ThemeContext';
import {getEndpointDetails} from '../../functions/NmEndpoint';
import {UIConfig} from '../../Global/UIConfig';
import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'NewEmail'>;

const NewEmail = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);
  const {Endpoint} = getEndpointDetails();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const [email, setEmail] = useState<string>('');
  const [emailVerify, setEmailVerify] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalChanged, setModalChanged] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showClrEmail, setShowClrEmail] = useState<boolean>(false);
  const [showClrEmailVerify, setShowClrEmailVerify] = useState<boolean>(false);

  const emailRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const emailVerifyRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const {user} = route.params;

  // ========================== ANIMATION FUNCION/VALUES ========================== //

  const REANIMATED_LIFT_HEIGHT = -12;
  const ANIMATION_DURATION = 50;

  const emailFocusedOrFilled = useSharedValue<number>(0);
  const verifyFocusedOrFilled = useSharedValue<number>(0);

  const handleFocus = (index: number): void => {
    if (index == 1) {
      setShowClrEmail(true);

      if (email.trim().length == 0) {
        emailFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setShowClrEmailVerify(true);

      if (emailVerify.trim().length == 0) {
        verifyFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const handleBlur = (index: number): void => {
    if (index == 1) {
      setShowClrEmail(false);

      if (email.trim().length == 0) {
        emailFocusedOrFilled.value = withTiming(0, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setShowClrEmailVerify(false);

      if (emailVerify.length == 0) {
        verifyFocusedOrFilled.value = withTiming(0, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const handleChangeText = (text: string, index: number): void => {
    if (index == 1) {
      setEmail(text.trim());

      if (text.trim().length > 0) {
        emailFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setEmailVerify(text);

      if (text.trim().length > 0) {
        verifyFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const emailAnimatedLabelStyle = useAnimatedStyle(() => {
    const animationProgress = emailFocusedOrFilled.value;

    return {
      transform: [
        {
          translateY: interpolate(animationProgress, [0, 1], [0, REANIMATED_LIFT_HEIGHT]),
        },
      ],
      fontSize: interpolate(animationProgress, [0, 1], [16, 11]),
    };
  });

  const verifyAnimatedLabelStyle = useAnimatedStyle(() => {
    const animationProgress = verifyFocusedOrFilled.value;

    return {
      transform: [
        {
          translateY: interpolate(animationProgress, [0, 1], [0, REANIMATED_LIFT_HEIGHT]),
        },
      ],
      fontSize: interpolate(animationProgress, [0, 1], [16, 11]),
    };
  });

  const clearInput = (index: number): void => {
    if (index == 1) {
      setEmail('');
    } else if (index == 2) {
      setEmailVerify('');
    }
  };

  useEffect(() => {
    const handleBackButton = (): boolean => {
      if (loading) {
        setLoading(false);
        return false;
      }

      if (!navigation.isFocused()) {
        return false;
      }

      navigation.navigate('SettingsScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, [loading, navigation]);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  function checkFields(): void {
    if (email == '' || emailVerify == '') {
      showError('Error: Please complete all fields!');
      return;
    }

    if (email != emailVerify) {
      showError('Error: Email do not match!');
      return;
    }

    setModalVisible(true);
  }

  const processChangeEmail = (): void => {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        NmCheckRegCount(email).then(result => {
          if (result.status != '404') {
            if (result.data.emailCount > 0) {
              setLoading(false);
              showError('Error: New email address is already registered or under approval.');
            } else {
              ReactNativeBlobUtil.config({})
                .fetch('POST', Endpoint + 'APIM/UpdateEmailLogin?_account=' + user + '&_newEmail=' + email, {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                })
                .then(response => response.json())
                .then((responseData: any) => {
                  setLoading(false);

                  if (responseData.status == 200) {
                    setModalChanged(true);
                  } else {
                    showError('Error: Unable to change email login. Please contact customer support.');
                  }
                })
                .catch((err: any) => {
                  setLoading(false);
                  showError('Server Error: Please contact customer support (Code).');
                });
            }
          } else {
            setLoading(false);
            showError('Server Error: Please contact customer support (USR_CTR).');
          }
        });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  };

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  return (
    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -60 : -90} style={{flex: 1}}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
          {loading ? <LoadingScreen /> : null}

          <NmModal
            winVisible={modalVisible}
            setWinVisible={setModalVisible}
            containerStyle={{}}
            onClickYes={() => {
              setModalVisible(false);
              setLoading(true);
              processChangeEmail();
            }}
            onClickNo={() => {
              setModalVisible(false);
            }}
            onClickClose={() => {
              setModalVisible(false);
            }}
            modalType={'WIN_QUESTION'}
            title={'Change Email'}
            message={'Are you sure you want to change your email login?.'}
          />

          <NmModal
            winVisible={modalChanged}
            setWinVisible={setModalChanged}
            containerStyle={{}}
            onClickOk={() => {
              NmClearLoginData().then(result => {
                if (result == true) {
                  RNRestart.Restart();
                }
              });
            }}
            onClickClose={() => {
              NmClearLoginData().then(result => {
                if (result == true) {
                  RNRestart.Restart();
                }
              });
            }}
            modalType={'WIN_INFO'}
            title={'New Email Saved!'}
            message={'You have successfully updated your login email. Please login with your new email.'}
          />

          <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%'}} keyboardShouldPersistTaps="handled">
            <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1}}>
              <View style={{width: '100%', alignItems: 'center', marginTop: -40}}>
                <Image source={UIConfig.AccNewPassIcon} style={{height: 150, resizeMode: 'contain', marginBottom: 40, marginTop: 20}} />

                <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Enter New Email'}</Text>

                <Text style={styles.iconDescription}>{'Enter your new email login below'}</Text>
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.textInputContainer,
                    {
                      marginTop: 0,
                      backgroundColor: theme.panelBackground,
                      borderColor: theme.panelBorder,
                    },
                  ]}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Animated.Text
                      style={[
                        {
                          position: 'absolute',
                          left: 10,
                          marginBottom: -2,
                          color: '#b6becc',
                          fontFamily: 'Poppins-Regular',
                          fontSize: 16,
                        },
                        emailAnimatedLabelStyle,
                      ]}>
                      {'Email'}
                    </Animated.Text>

                    <TextInput
                      ref={emailRef}
                      onFocus={() => {
                        handleFocus(1);
                      }}
                      onBlur={() => {
                        handleBlur(1);
                      }}
                      style={[
                        styles.textInputStyle,
                        {
                          marginBottom: -12,
                          color: theme.textColor,
                        },
                      ]}
                      placeholderTextColor="#b6becc"
                      onChangeText={(value: string) => handleChangeText(value, 1)}
                      value={email}
                      returnKeyType="next"
                      autoFocus={true}
                      onSubmitEditing={() => {
                        emailVerifyRef.current?.focus();
                      }}
                      blurOnSubmit={false}
                      onEndEditing={() => {
                        if (email != '') {
                          if (NmCheckEmailFormat(email) == true) {
                            showError('');
                          } else {
                            showError('Invalid Email Address.');
                            clearInput(1);
                          }
                        }
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      clearInput(1);
                      emailRef.current?.focus();
                    }}>
                    {showClrEmail && <MaterialCommunityIcons style={{paddingHorizontal: 5, marginRight: 5}} name={'close-circle-outline'} size={20} color={'#b6becc'} />}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.textInputContainer,
                    {
                      backgroundColor: theme.panelBackground,
                      borderColor: theme.panelBorder,
                    },
                  ]}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Animated.Text
                      style={[
                        {
                          position: 'absolute',
                          left: 10,
                          marginBottom: -2,
                          color: '#b6becc',
                          fontFamily: 'Poppins-Regular',
                          fontSize: 16,
                        },
                        verifyAnimatedLabelStyle,
                      ]}>
                      {'Verify Email'}
                    </Animated.Text>

                    <TextInput
                      ref={emailVerifyRef}
                      onFocus={() => {
                        handleFocus(2);
                      }}
                      onBlur={() => {
                        handleBlur(2);
                      }}
                      style={[
                        styles.textInputStyle,
                        {
                          marginBottom: -12,
                          color: theme.textColor,
                        },
                      ]}
                      placeholderTextColor="#b6becc"
                      onChangeText={(value: string) => handleChangeText(value, 2)}
                      value={emailVerify}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      blurOnSubmit={false}
                      onEndEditing={() => {
                        Keyboard.dismiss();

                        if (emailVerify != '') {
                          if (NmCheckEmailFormat(emailVerify) == true) {
                            showError('');
                          } else {
                            showError('Invalid Email Address.');
                            clearInput(2);
                          }
                        }
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      clearInput(2);
                      emailVerifyRef.current?.focus();
                    }}>
                    {showClrEmailVerify && <MaterialCommunityIcons style={{paddingHorizontal: 5, marginRight: 5}} name={'close-circle-outline'} size={20} color={'#b6becc'} />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{width: '100%'}}>
                <NmButton
                  buttonTheme="dark"
                  titleStyle={styles.buttonTextStyle}
                  title="Change Email"
                  onPress={() => {
                    Keyboard.dismiss();
                    checkFields();
                  }}
                />
              </View>

              <Text style={styles.errorMessage}>{errorMessage}</Text>
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
    paddingTop: 24,
    paddingHorizontal: 16,
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
    marginTop: 20,
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
  inputs: {
    flex: 2,
  },
});

export default NewEmail;

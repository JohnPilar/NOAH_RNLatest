import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, TextInput, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, BackHandler, Platform, DimensionValue} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, interpolate} from 'react-native-reanimated';

import {NmChangePassword, NmSendNewPassConfirmation} from '../../functions/NmNetwork';
import {NmHasInternet, NmPasswordCheck, NmClearLoginData} from '../../functions/NmFunctions';

import {NmButton, LoadingScreen, NmHelpTip, NmModal} from '../../components';

import {SafeAreaView} from 'react-native-safe-area-context';
import {AccountDetailsContext, AppConfigContext} from '../../functions/Contexts';
import {ThemesContext} from '../../functions/ThemeContext';
import {Config} from '../../app.config';
import {UIConfig} from '../../Global/UIConfig';

import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'NewPassword'>;

const NewPassword = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();

  const {ctxClearUserData} = useContext(AccountDetailsContext);
  const {ctxClearUserConfig} = useContext(AppConfigContext);
  const {theme} = useContext(ThemesContext);

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const [userPassword, setUserPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showConfirmPasswordIcon, setShowConfirmPasswordIcon] = useState<boolean>(false);

  const tooltipMargin: number = 50;

  const [showHelp, setShowHelp] = useState<boolean>(false);

  const helpTip =
    'Your new password must:\n• Be at least 8 characters\n• Have at least one number\n• Have at least one symbol\n• Have at least one upper case letter\n• Have at least one lower case letter';

  const {newAccount, pwtku} = route.params;

  const message = newAccount == true ? 'Account password successfully saved. Kindly log in using your Email and Password.' : 'New password saved! Kindly log in using your Email and Password.';

  useEffect(() => {
    const handleBackButton = (): boolean => {
      if (loading) {
        setLoading(false);
        return false;
      }

      navigation.navigate('LoginOptionScreen');
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

  // ========================== ANIMATION FUNCION/VALUES ========================== //

  const REANIMATED_LIFT_HEIGHT = -12;
  const ANIMATION_DURATION = 50;

  const passwordFocusedOrFilled = useSharedValue<number>(0);
  const confirmFocusedOrFilled = useSharedValue<number>(0);

  const handleFocus = (index: number): void => {
    setShowHelp(false);

    if (index == 1) {
      setShowPasswordIcon(true);

      if (userPassword.trim().length === 0) {
        passwordFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setShowConfirmPasswordIcon(true);

      if (confirmPassword.trim().length == 0) {
        confirmFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const handleBlur = (index: number): void => {
    if (index == 1) {
      setShowPasswordIcon(false);

      if (userPassword.trim().length == 0) {
        passwordFocusedOrFilled.value = withTiming(0, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setShowConfirmPasswordIcon(false);

      if (confirmPassword.trim().length == 0) {
        confirmFocusedOrFilled.value = withTiming(0, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const handleChangeText = (text: string, index: number): void => {
    if (index == 1) {
      setUserPassword(text.trim());

      if (text.trim().length > 0) {
        passwordFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    } else {
      setConfirmPassword(text);

      if (text.trim().length > 0) {
        confirmFocusedOrFilled.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    }
  };

  const passwordAnimatedLabelStyle = useAnimatedStyle(() => {
    const animationProgress = passwordFocusedOrFilled.value;

    return {
      transform: [
        {
          translateY: interpolate(animationProgress, [0, 1], [0, REANIMATED_LIFT_HEIGHT]),
        },
      ],
      fontSize: interpolate(animationProgress, [0, 1], [16, 11]),
    };
  });

  const confirmAnimatedLabelStyle = useAnimatedStyle(() => {
    const animationProgress = confirmFocusedOrFilled.value;

    return {
      transform: [
        {
          translateY: interpolate(animationProgress, [0, 1], [0, REANIMATED_LIFT_HEIGHT]),
        },
      ],
      fontSize: interpolate(animationProgress, [0, 1], [16, 11]),
    };
  });

  const checkPasswordCriteria = (): void => {
    NmPasswordCheck(userPassword, confirmPassword, 8).then(result => {
      if (result == true) {
        startChangePassword();
      } else {
        showError(result as string);
      }
    });
  };

  interface ChangePasswordRequest {
    nwtku?: string;
    NewPass: string;
    Confirm: string;
  }

  const startChangePassword = (): void => {
    NmHasInternet().then(result => {
      if (result == true) {
        setLoading(true);

        const userProps: ChangePasswordRequest = {
          nwtku: pwtku,
          NewPass: userPassword,
          Confirm: confirmPassword,
        };

        NmChangePassword(userProps).then(response => {
          if (response.status == 200) {
            NmSendNewPassConfirmation(pwtku).then(() => {
              NmClearLoginData(ctxClearUserData, ctxClearUserConfig).then(() => {
                setLoading(false);
                setModalVisible(true);
              });
            });
          } else {
            setLoading(false);
            showError(response.message);
          }
        });
      } else {
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
      <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss;
            setShowHelp(false);
          }}>
          <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            {loading ? <LoadingScreen /> : null}
            {
              <NmHelpTip
                isVisible={showHelp}
                onPress={() => setShowHelp(false)}
                customView={true}
                onBackButtonPress={() => setShowHelp(false)}
                style={{justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: Platform.OS == 'android' ? tooltipMargin + 16 : tooltipMargin}}>
                <View
                  style={{
                    backgroundColor: theme.tooltipBackground,
                    elevation: 4,
                    borderRadius: 8,
                    width: '70%',
                    padding: 10,
                    borderWidth: Platform.OS == 'ios' ? StyleSheet.hairlineWidth : 0,
                    borderColor: Platform.OS == 'ios' ? '#BBB' : undefined,
                  }}>
                  <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.textColor}}>{helpTip}</Text>
                </View>
              </NmHelpTip>
            }

            <NmModal
              winVisible={modalVisible}
              setWinVisible={setModalVisible}
              containerStyle={{}}
              onClickOk={() => {
                setModalVisible(() => false);
                navigation.pop();
                navigation.navigate('LoginOptionScreen');
              }}
              onClickClose={() => {
                setModalVisible(() => false);
                navigation.pop();
                navigation.navigate('LoginOptionScreen');
              }}
              OkTitle="Return to Login"
              modalType={'WIN_INFO'}
              title={Config.APP_NAME + ' Mobile App'}
              message={message}></NmModal>

            <View style={{width: '100%', marginTop: Platform.OS == 'android' ? 16 : 0, paddingHorizontal: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                  navigation.navigate('LoginOptionScreen');
                }}
                style={{backgroundColor: theme.tooltipControls, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                <MaterialCommunityIcons name={'arrow-left'} size={30} color={'#516DF6'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowHelp(!showHelp)}
                style={{backgroundColor: theme.tooltipControls, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                <MaterialCommunityIcons name={'help-circle-outline'} size={30} color={'#516DF6'} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%'}} keyboardShouldPersistTaps="handled">
              <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1}}>
                <View style={{width: '100%', alignItems: 'center', marginTop: -40}}>
                  <Image source={UIConfig.AccNewPassIcon} style={{height: 150, resizeMode: 'contain', marginBottom: 40}} />
                  <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Enter New Password'}</Text>
                  <Text style={styles.iconDescription}>{'Enter your new password below'}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <View style={[styles.textInputContainer, {backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Animated.Text style={[{position: 'absolute', left: 10, color: '#b6becc', fontFamily: 'Poppins-Regular', fontSize: 16, marginBottom: -2}, passwordAnimatedLabelStyle]}>
                        {'New Password'}
                      </Animated.Text>
                      <TextInput
                        onFocus={() => {
                          handleFocus(1);
                        }}
                        onBlur={() => handleBlur(1)}
                        style={[styles.textInputStyle, {marginBottom: -12, color: theme.textColor}]}
                        placeholderTextColor="#b6becc"
                        returnKeyType="next"
                        value={userPassword}
                        secureTextEntry={!showPassword}
                        onChangeText={value => handleChangeText(value, 1)}
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPasswordIcon && (
                        <MaterialCommunityIcons style={{paddingHorizontal: 5, marginRight: 5}} name={!showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color={'#b6becc'} />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.textInputContainer, {backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Animated.Text style={[{position: 'absolute', left: 10, color: '#b6becc', fontFamily: 'Poppins-Regular', fontSize: 16, marginBottom: -2}, confirmAnimatedLabelStyle]}>
                        {'Confirm Password'}
                      </Animated.Text>
                      <TextInput
                        onFocus={() => {
                          handleFocus(2);
                          // setShowConfirmPasswordIcon(true);
                          // setShowHelp(false);
                        }}
                        onBlur={() => handleBlur(2)}
                        style={[styles.textInputStyle, {marginBottom: -12, color: theme.textColor}]}
                        placeholderTextColor="#b6becc"
                        returnKeyType="next"
                        value={confirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={value => handleChangeText(value, 2)}
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPasswordIcon && (
                        <MaterialCommunityIcons style={{paddingHorizontal: 5, marginRight: 5}} name={!showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={'#b6becc'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{width: '100%'}}>
                  <NmButton
                    buttonTheme="dark"
                    titleStyle={styles.buttonTextStyle}
                    title="Change Password"
                    onPress={() => {
                      Keyboard.dismiss();
                      checkPasswordCriteria();
                    }}
                  />
                </View>

                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    alignItems: 'center',
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
    marginTop: 0,
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
});

export default NewPassword;

import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Platform, DimensionValue} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import RNRestart from 'react-native-restart';
import ClearCache from '@type-any/react-native-clear-cache';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {NmSaveSetting, NmHasInternet, NmClearAppData, NmUpdateUserConfig, NmHardwareBackPress} from '../functions/NmFunctions';
import {NmLogin, NmResendEmailOTP, NmGetUserInfo} from '../functions/NmNetwork';
import {APP_CONST, APP_KEYS} from '../constants/NmConstants';
import {ThemesContext} from '../functions/ThemeContext';
import {NmButton, NmTextInput, LoadingScreen, NmLogoutModal, NmModal, LoadingPanel, NmSettingItem} from '../components';
import {EndpointReset} from '../functions/NmEndpoint';
import {ConfigDetails} from '../functions/NmAppConfig';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {WINDOW_WIDTH} from '../constants/NmStyles';
import {StackScreenProps} from '../navigation/NavigationTypes';

type Props = StackScreenProps<'SettingsScreen'>;

const SettingsScreen = ({navigation, route}: Props): React.JSX.Element => {
  const {darkTheme, setDarkTheme, theme} = useContext(ThemesContext);
  const {recuser, EndpointCurrent, showClearCache, showClearData} = useContext(AccountDetailsContext);
  const {biometricUse, setBiometricUse, enableNotification, setEnableNotification} = useContext(AppConfigContext);
  const orientation = useDeviceOrientation();
  const {thirdLayout} = route.params || {};

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [modalWidth, setModalWidth] = useState<DimensionValue>('95%');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [settingErrorMessage, setSettingErrorMessage] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);
  const [clearDataVisible, setClearDataVisible] = useState<boolean>(false);

  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [passModalVisible, setPassModalVisible] = useState<boolean>(false);
  const [loginErrorVisible, setLoginErrorVisible] = useState<boolean>(false);
  const [userPass, setUserPass] = useState<string>('');

  const [showCheck, setShowCheck] = useState<boolean>(false);

  const toggleTheme = async () => {
    const newValue = !darkTheme;
    setDarkTheme(newValue);

    try {
      await NmUpdateUserConfig(EndpointCurrent?.Code, {DarkTheme: newValue});
    } catch (error) {
      setDarkTheme(darkTheme);
    }
  };

  const customBackpress = useCallback(() => {
    saveSettings(true);
    navigation.navigate('Home');
    return true;
  }, [enableNotification, biometricUse]);

  NmHardwareBackPress(customBackpress);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setModalWidth('50%');
        setScreenWidth('70%');
      } else {
        setModalWidth('35%');
        setScreenWidth('60%');
      }
    }
  }, [orientation]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        saveSettings(false);
      };
    }, [enableNotification, biometricUse]),
  );

  async function saveSettings(showDialog: boolean) {
    await NmSaveSetting(APP_KEYS.SETT_PUSHNOTIF, enableNotification);
    await NmSaveSetting(APP_KEYS.APP_BIOMETRIC_USE, biometricUse);
  }

  function processChangeEmail() {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        NmResendEmailOTP(APP_CONST.OTP_TYPE_EMAIL, recuser).then(result => {
          setLoading(false);
          if (result.status == '200') {
            navigation.navigate('OTPEmail', {
              ChangeEmail: true,
              OTPCode: result.data.OTPCode,
              user: recuser,
            });
          } else {
            setSettingErrorMessage(true);
            showError('Server Error: Please contact customer support (Code).');
          }
        });
      } else {
        showError('No Internet connection detected.');
      }
    });
  }

  function navigateTo(link: string) {
    navigation.navigate('WebViewerHome', {
      link,
      newPage: true,
    });
  }

  function resetPropertyModalValues() {
    setPassModalVisible(false);
  }

  function validateUserPassword() {
    setModalLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        const email = recuser.toLowerCase();

        NmLogin(email, userPass).then(result => {
          if (result?.status == 200) {
            NmGetUserInfo(email).then(result => {
              setModalLoading(false);

              if (result.status == '200') {
                const userData = result.data;

                const userDetails = {
                  LName: userData.UserName,
                  LEmail: email,
                  LMobile: userData.Mobile,
                };
                resetPropertyModalValues();
                navigation.navigate('RegistrationScreen', {userExists: true, userDetails: userDetails, userLoggedIn: true});
              } else if (result.status == '404') {
                setLoginErrorVisible(true);
                showValidationError('Login Email not Found!');
              } else {
                setLoginErrorVisible(true);
                showValidationError(result.message);
              }
            });
          } else {
            setLoginErrorVisible(true);
            setModalLoading(false);
            showValidationError(result.message);
          }
        });
      } else {
        setLoginErrorVisible(true);
        setModalLoading(false);
        showValidationError('No Internet connection detected.');
      }
    });
  }

  const showError = (err: string) => {
    setSettingErrorMessage(true);
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage('');
      setSettingErrorMessage(false);
    }, 7000);
  };

  const showValidationError = (err: string) => {
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage('');
      setLoginErrorVisible(false);
    }, 7000);
  };

  async function clearAppCache() {
    await ClearCache.clearCacheDir().then(() => {
      setShowCheck(true);
    });
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
      {loading ? <LoadingScreen /> : null}
      <NmModal
        winVisible={modalVisible}
        setWinVisible={setModalVisible}
        containerStyle={{}}
        onClickYes={() => {
          setModalVisible(false);
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
        message={'Do you want to change your login email?\nA One Time Pin (OTP) will be sent to your current login email.'}></NmModal>

      <NmModal
        winVisible={clearDataVisible}
        setWinVisible={setClearDataVisible}
        containerStyle={{width: WINDOW_WIDTH * 0.9}}
        messageStyle={{fontSize: 15}}
        onClickYes={() => {
          setClearDataVisible(false);
          setLoading(true);
          NmClearAppData().then(result => {
            EndpointReset();
            setTimeout(() => {
              RNRestart.Restart();
            }, 3000);
          });
        }}
        onClickNo={() => {
          setClearDataVisible(false);
        }}
        onClickClose={() => {
          setClearDataVisible(false);
        }}
        modalType={'WIN_QUESTION'}
        title={'Clear App Data?'}
        message={'This action will delete all app settings and data, Do you want to continue? (application will restart)'}></NmModal>

      <NmModal winVisible={passModalVisible} setWinVisible={setPassModalVisible} customView={true}>
        <View
          style={[
            {
              width: modalWidth,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              backgroundColor: theme.notifModalBackgroundColor,
            },
          ]}>
          {modalLoading ? <LoadingPanel panelStyle={{borderRadius: 6}} /> : null}
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? 0 : 0}>
            <View
              style={{
                height: 40,
                backgroundColor: '#1974D1',
                width: '100%',
                borderTopStartRadius: 6,
                borderTopEndRadius: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{color: '#FFF', fontFamily: 'Poppins-Regular', fontSize: 18, marginLeft: 10, marginTop: 5}}>{'Enroll New Property'}</Text>
              <TouchableOpacity
                onPress={() => {
                  resetPropertyModalValues();
                }}>
                <Image source={require('../assets/Icons/component_close_icon.png')} style={{resizeMode: 'contain', height: 26, marginRight: -10}} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: theme.notifModalBackgroundColor,
                padding: 10,
                borderBottomStartRadius: 6,
                borderBottomEndRadius: 6,
              }}>
              <Text
                style={[
                  {
                    color: '#000',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14,
                    marginBottom: 10,
                    textAlign: 'left',
                  },
                ]}>
                {'Please re-enter your password to continue.'}
              </Text>

              <NmTextInput
                // Add ref to access secureText function
                containerStyle={{marginBottom: 15}} // View Style
                textInputStyle={{}} // TextInput Style
                secureTextButton={true} // Password entry input with show password button
                value={userPass} // TextInput value
                onChangeText={setUserPass} // Value state handler
                placeholder="*******"
                blurOnSubmit={false}
                // ref={(input) => {
                //   passwordField.current = input;
                // }}
              />

              {loginErrorVisible && (
                <Text
                  style={[
                    styles.errorMessageStyle,
                    {
                      alignSelf: 'center',
                      marginVertical: 5,
                      marginTop: 0,
                    },
                  ]}>
                  {errorMessage}
                </Text>
              )}

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <NmButton
                  style={[styles.modalButton, {marginRight: 5}]}
                  titleStyle={styles.modalButtonText}
                  onPress={() => {
                    if (!userPass?.trim()) {
                      setLoginErrorVisible(true);
                      showValidationError('Please enter your password.');
                    } else {
                      validateUserPassword();
                    }
                  }}
                  buttonTitle
                  title="Ok"
                />

                <NmButton
                  style={[styles.modalButton, {marginLeft: 5}]}
                  titleStyle={styles.modalButtonText}
                  onPress={() => {
                    resetPropertyModalValues();
                  }}
                  buttonTitle
                  title="Cancel"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </NmModal>

      <NmLogoutModal visible={logoutVisible} setVisible={setLogoutVisible} />

      <View style={styles.titleContainer}>
        {!thirdLayout && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={{
              marginHorizontal: 10,
              backgroundColor: '#F0F4F9',
              width: 26,
              height: 26,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <MaterialCommunityIcons name={'arrow-left'} size={20} color={'#516DF6'} />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.title,
            {
              color: theme.color,
              marginBottom: -2,
              marginLeft: thirdLayout ? 12 : 0,
              fontSize: thirdLayout ? 24 : 18,
            },
          ]}>
          {'Settings'}
        </Text>
      </View>

      {settingErrorMessage && (
        <View
          style={{
            backgroundColor: '#E72929',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 10,
              color: '#FFF',
            }}>
            {errorMessage}
          </Text>
        </View>
      )}

      <ScrollView
        style={{
          width: '100%',
          flexGrow: 1,
          backgroundColor: theme.backgroundColor,
        }}
        contentContainerStyle={{alignItems: 'center'}}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.backgroundColor,
              width: screenWidth,
            },
          ]}>
          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <NmSettingItem
              onPress={() => {
                navigateTo(ConfigDetails().BaseLinkURL + 'PMOBasicInformation' + APP_CONST.WEB_QS_NWTKU);
              }}
              imageIcon={require('../assets/Icons/setting_profile.png')}
              title={'My Profile'}
              materialRightIcon={true}
            />
          )}

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <NmSettingItem
              onPress={() => {
                NmHasInternet().then((result: unknown) => {
                  if (result as boolean) {
                    setPassModalVisible(true);
                  } else {
                    showError('No Internet connection detected.');
                  }
                });
              }}
              imageIcon={require('../assets/Icons/setting_enroll_new.png')}
              title={'Enroll New Property'}
              description={'Add new Property (Re-login required)'}
              materialRightIcon={true}
            />
          )}

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <NmSettingItem
              onPress={() => {
                NmHasInternet().then((result: unknown) => {
                  if (result as boolean) {
                    setModalVisible(true);
                  } else {
                    showError('No Internet connection detected.');
                  }
                });
              }}
              imageIcon={require('../assets/Icons/setting_email.png')}
              title={'Change Login Email'}
              description={recuser}
              materialRightIcon={true}
            />
          )}

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <NmSettingItem
              onPress={() => {
                setEnableNotification(!enableNotification);
              }}
              imageIcon={require('../assets/Icons/setting_notifications.png')}
              title={'Push Notifications'}
              description={'Enable/Disable Push notifications'}
              isSwitch={true}
              switchValue={enableNotification}
              setSwitch={setEnableNotification}
            />
          )}
          <NmSettingItem
            onPress={async () => {
              const newValue = !biometricUse;
              setBiometricUse(newValue);

              try {
                await NmUpdateUserConfig(EndpointCurrent.Code, {
                  BiometricUse: newValue,
                });
              } catch (error: unknown) {
                setBiometricUse(biometricUse);
              }
            }}
            imageIcon={require('../assets/Icons/setting_biometric.png')}
            title={'Biometrics/Face ID'}
            description={'Enable/Disable application biometric login'}
            isSwitch={true}
            switchValue={biometricUse}
            setSwitch={setBiometricUse}
          />

          <NmSettingItem
            onPress={() => {
              toggleTheme();
            }}
            imageIcon={require('../assets/Icons/setting_theme.png')}
            title={'Dark Theme'}
            description={'Enable/Disable application dark theme'}
            isSwitch={true}
            switchValue={darkTheme}
            setSwitch={setDarkTheme}
            noImageTint={true}
          />

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <NmSettingItem
              onPress={() => {
                navigation.navigate('ResetPasswordForm', {
                  changeType: 1,
                });
              }}
              imageIcon={require('../assets/Icons/setting_password.png')}
              title={'Change Password'}
              description={'Change your password via OTP verification'}
              materialRightIcon={true}
            />
          )}

          {showClearCache && (
            <NmSettingItem
              onPress={() => {
                clearAppCache();
              }}
              animatedIcon={'delete-variant'}
              title={'Clear Cache'}
              description={'Clear the app cache (retains user login)'}
              showCheck={showCheck}
              setShowCheck={setShowCheck}
            />
          )}

          {showClearData && (
            <NmSettingItem
              onPress={() => {
                setClearDataVisible(true);
              }}
              materialIcon={'delete-empty-outline'}
              title={'Clear Data'}
              description={'Clears all app data (resets app)'}
            />
          )}

          {/* )} */}
        </View>
      </ScrollView>

      <View
        style={{
          width: '100%',
          marginBottom: 16,
          paddingHorizontal: 10,
          paddingTop: 10,
          alignItems: 'center',
        }}>
        <NmButton
          style={[
            styles.actionButtons,
            {
              borderColor: '#1974D1',
              borderWidth: 1,
              backgroundColor: theme.homeIconBackgroundColor,
              width: screenWidth,
            },
          ]}
          titleStyle={[
            styles.buttonTextStyle,
            {
              color: theme.notifContentTitleTextColor,
            },
          ]}
          onPress={() => {
            setLogoutVisible(true);
          }}
          buttonTitle
          title="Log Out"
        />
      </View>
    </View>
  );
};

interface AnimatedCheckSettingProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const AnimatedCheckSetting = ({visible, setVisible, children}: AnimatedCheckSettingProps): React.JSX.Element => {
  const [checkVisible, setCheckVisible] = useState<boolean>(true);

  if (visible == true) {
    setTimeout(() => {
      setCheckVisible(false);

      setTimeout(() => {
        setVisible(false);
        setCheckVisible(true);
      }, 2000);
    }, 250);
  }

  return (
    <View>
      {checkVisible && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(250)}>
          {children}
        </Animated.View>
      )}

      {!checkVisible && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(250)}>
          <MaterialCommunityIcons
            name="check-circle"
            size={21}
            style={[
              styles.boxImage,
              {
                width: undefined,
                height: undefined,
              },
            ]}
            color={'#1974D1'}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 3,
    paddingVertical: 10,
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  settingContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 5,
    elevation: 1.5,
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  settingName: {
    color: '#13151B',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A4A8B0',
  },
  actionButtons: {
    backgroundColor: '#7F8083',
    borderRadius: 6,
    width: '100%',
    height: 45,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1974D1',
  },
  modalButton: {
    height: 36,
    flex: 1,
    backgroundColor: '#1974D1',
  },
  modalButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
  boxImage: {
    width: 30,
    height: 30,
    margin: 2,
    resizeMode: 'contain',
  },
  boxImageContainer: {
    backgroundColor: '#1974D110',
    borderRadius: 6,
    margin: 10,
  },
  errorMessageStyle: {
    fontSize: 12,
    color: '#ff005e',
    fontFamily: 'Poppins-Regular',
  },
  textInputContainer: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});

export default SettingsScreen;

import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Image, ScrollView, View, TouchableWithoutFeedback, Keyboard, BackHandler, Platform, DimensionValue} from 'react-native';

import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../../functions/NmFunctions.tsx';

import {NmGetUserInfo, NmLogin} from '../../functions/NmNetwork.tsx';
import {NmHasInternet} from '../../functions/NmFunctions.tsx';

import {NmButton, NmTextInput, LoadingScreen} from '../../components/index.jsx';
import {ThemesContext} from '../../functions/ThemeContext.tsx';
import {UIConfig} from '../../Global/UIConfig.js';

import {StackScreenProps} from '../../navigation/NavigationTypes.tsx';
import {IUserDetails} from '../../constructs/interfaces/AccountFunctionsInterface.tsx';

type Props = StackScreenProps<'RegistrationOption'>;

const RegistrationOption = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [email, setEmail] = useState<string>('');
  const [pword, setPword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleBackButton = (): boolean => {
      if (loading) {
        setLoading(false);
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, [loading]);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  const verifyEmail = (): void => {
    NmHasInternet().then(result => {
      if (result == true) {
        if (email == '') {
          showError('Please complete all fields!');
          return;
        }

        setLoading(true);

        NmLogin(email, pword).then(response => {
          if (response?.status == 200) {
            NmGetUserInfo(email).then(result => {
              setLoading(false);

              if (result.status == '200') {
                const userData = result.data;

                const userDetails: IUserDetails = {
                  LName: userData.UserName,
                  LEmail: email,
                  LMobile: userData.Mobile,
                };

                clearFields();

                navigation.navigate('RegistrationScreen', {
                  userExists: true,
                  userDetails,
                });
              } else if (result.status == '404') {
                showError('Login Email not Found!');
              } else {
                showError(result.message);
              }
            });
          } else {
            setLoading(false);
            showError('Invalid User Credentials!');
          }
        });
      } else {
        showError('No Internet connection detected.');
      }
    });
  };

  function clearFields(): void {
    setEmail('');
    setPword('');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -20 : 0} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {backgroundColor: theme.regOpsBackground}]}>
          {/* <View style={{height: 100}}></View> */}
          <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%', paddingHorizontal: 16}} keyboardShouldPersistTaps="handled">
            <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1}}>
              {loading ? <LoadingScreen /> : null}

              <View style={{width: '100%', alignItems: 'center'}}>
                <Image source={UIConfig.RegPropertyIcon} style={{height: 150, resizeMode: 'contain', marginBottom: 20, marginTop: -40}} />
                {/* <Text style={styles.iconTitle}>Account Registration</Text> */}
                <Text style={styles.iconDescription}>{'New User?'}</Text>
                <View style={{width: '100%'}}>
                  <NmButton
                    buttonTheme={'dark'}
                    style={[styles.buttonStyle]}
                    titleStyle={styles.buttonTextStyle}
                    title="Register"
                    onPress={() => {
                      navigation.navigate('RegistrationScreen');
                    }}
                  />
                </View>
                <Text style={[styles.iconDescription, {color: theme.textColor, fontWeight: '300', marginTop: 30, marginBottom: 20}]}>{'OR'}</Text>
              </View>
              <Text style={styles.iconDescription}>{'Have existing user?'}</Text>

              <NmTextInput
                containerStyle={{marginTop: 10}}
                textInputStyle={{fontFamily: 'Poppins-Medium'}}
                clearTextButton={true}
                placeholder="Existing Login Email"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <NmTextInput
                containerStyle={{marginTop: 20, marginBottom: 20}}
                textInputStyle={{fontFamily: 'Poppins-Medium'}}
                secureTextButton={true}
                value={pword}
                onChangeText={setPword}
                placeholder="*******"
                blurOnSubmit={false}
              />

              <View style={{width: '100%'}}>
                <NmButton
                  buttonTheme="dark"
                  style={[styles.buttonStyle, {marginTop: 0}]}
                  titleStyle={styles.buttonTextStyle}
                  title="Verify"
                  onPress={() => {
                    Keyboard.dismiss();
                    verifyEmail();
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
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A4A8B0',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
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
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    borderRadius: 6,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
  buttonStyle: {
    marginTop: 10,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  errorMessage: {
    marginTop: 10,
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

export default RegistrationOption;

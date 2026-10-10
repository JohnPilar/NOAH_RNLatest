import {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Image, BackHandler, Platform, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, DimensionValue} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../../functions/NmFunctions';
import ReactNativeBlobUtil from 'react-native-blob-util';

import {APP_CONST} from '../../constants/NmConstants';
import {NmHasInternet} from '../../functions/NmFunctions';

import {NmButton, NmTextInput, NmHelpTip, LoadingScreen, NmLabel} from '../../components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemesContext} from '../../functions/ThemeContext';
import {getEndpointDetails} from '../../functions/NmEndpoint';
import {ConfigDetails} from '../../functions/NmAppConfig';
import {UIConfig} from '../../Global/UIConfig';
import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'ResetPasswordForm'>;

const ResetPasswordForm = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);
  const {Endpoint} = getEndpointDetails();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [accountInfo, setAccountInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const changeType = route.params?.changeType;

  const screenMessage = changeType == 0 ? 'Forgot Password' : 'Change Password';

  const goBackTo: 'LoginScreen' | 'SettingsScreen' = changeType == 0 ? 'LoginScreen' : 'SettingsScreen';

  const AppTypeMessage = ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? 'Please input your email or phone number below' : 'Please input your account number below';

  const infoPlaceholder = ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? 'Email Address or Phone Number' : 'Account number';

  const helpMessage =
    ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL
      ? 'Enter your email or phone number and we will send you a one-time pin to reset your password'
      : 'Enter your account number and we will send you a one-time pin to your email to reset your password';

  const tooltipMargin: number = 50;

  useEffect(() => {
    const handleBackButton = () => {
      if (loading) {
        setLoading(false);
        return false;
      }

      if (!navigation.isFocused()) {
        return false;
      }

      if (changeType == undefined) {
        navigation.goBack();
        return true;
      }

      navigation.navigate(goBackTo);
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

  async function validateUserInfo(): Promise<void> {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        ReactNativeBlobUtil.config({})
          .fetch('GET', Endpoint + 'APIM/CheckUser?_accountInfo=' + accountInfo + '&_reqType=' + ConfigDetails().AppType, {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          })
          .then(response => response.json())
          .then((responseData: any) => {
            setLoading(false);

            switch (responseData.status) {
              case '200': {
                const OTPType = responseData.data.OTPType;

                const myParams = {
                  newAccount: false,
                  OTPCode: responseData.data?.OTPCode,
                  pwtku: responseData.data.TokenKey,
                  user: ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? accountInfo : responseData.data.UserApprover,
                  changeType: changeType,
                };

                if (OTPType == 2) {
                  navigation.navigate('OTPEmail', myParams);
                } else {
                  navigation.navigate('OTPMobile', myParams);
                }
                break;
              }

              case '202':
                showError('Error: OTP Error, Please contact customer support.');
                break;

              case '404':
                showError('Error: User not found');
                break;

              default:
                showError(responseData?.message);
                break;
            }
          })
          .catch(() => {
            setLoading(false);
            showError('Error checking user information. Please contact customer support.');
          });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout(() => {
      setErrorMessage('');
    }, 7000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -100 : -100} style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setShowHelp(false);
          }}>
          <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
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
                  <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.textColor}}>{helpMessage}</Text>
                </View>
              </NmHelpTip>
            }
            <View style={{width: '100%', marginTop: Platform.OS == 'android' ? 16 : 0, paddingHorizontal: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate(goBackTo as never)}
                style={{backgroundColor: theme.tooltipControls, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                <MaterialCommunityIcons name={'arrow-left'} size={30} color={'#516DF6'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowHelp(!showHelp);
                }}
                style={{backgroundColor: theme.tooltipControls, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                <MaterialCommunityIcons name={'help-circle-outline'} size={30} color={'#516DF6'} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%'}}>
              <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1}}>
                {loading && <LoadingScreen />}

                <View style={{width: '100%', alignItems: 'center', marginTop: -40}}>
                  <Image source={UIConfig.AccResetPassIcon} style={{height: 150, resizeMode: 'contain'}} />
                  <Text style={[styles.iconTitle, {color: theme.textColor}]}>{screenMessage}</Text>
                  <Text style={styles.iconDescription}>{AppTypeMessage}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <NmTextInput
                    containerStyle={styles.textInputContainer}
                    placeholder={infoPlaceholder}
                    returnKeyType="next"
                    value={accountInfo}
                    onChangeText={setAccountInfo}
                    onFocus={() => setShowHelp(false)}
                    blurOnSubmit={false}
                  />
                </View>
                <View style={{width: '100%'}}>
                  <NmButton
                    buttonTheme={'dark'}
                    titleStyle={styles.buttonTextStyle}
                    buttonTitle
                    title="Submit"
                    onPress={() => {
                      Keyboard.dismiss();
                      if (accountInfo == '' || accountInfo == undefined) {
                        showError('Error: Please enter a valid email account or mobile number!');
                      } else {
                        validateUserInfo();
                      }
                    }}
                  />
                </View>

                <NmLabel style={styles.errorMessage}>{errorMessage}</NmLabel>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    paddingVertical: 0,
    marginBottom: 20,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 14,
    color: '#ff005e',
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default ResetPasswordForm;

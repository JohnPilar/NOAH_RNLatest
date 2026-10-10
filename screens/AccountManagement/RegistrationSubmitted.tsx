import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Image, ScrollView, View, TouchableWithoutFeedback, Keyboard, BackHandler, DimensionValue} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions';
import DeviceInfo from 'react-native-device-info';

import {NmButton} from '../../components';
import {ThemesContext} from '../../functions/ThemeContext';
import {UIConfig} from '../../Global/UIConfig';

import {StackScreenProps} from '../../navigation/NavigationTypes';
import {RegSubmittedTargetWindow} from '../../constructs/types/AccountFunctionsTypes';

type Props = StackScreenProps<'RegistrationSubmitted'>;

const RegistrationSubmitted = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);

  const userLoggedIn = route.params?.userLoggedIn;
  const registrationRegNo = route.params?.regReferenceNo;

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [btnMessage, setBtnMessage] = useState<string>('Return to Login');
  const [targetWindow, setTargetWindow] = useState<RegSubmittedTargetWindow>('LoginOptionScreen');

  useEffect((): void => {
    if (userLoggedIn == true) {
      setBtnMessage('Return to Settings');
      setTargetWindow('SettingsScreen');
    }
  }, []);

  useEffect((): void => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    const handleBackButton = (): boolean => {
      if (userLoggedIn == true) {
        navigation.pop();
        navigation.navigate('SettingsScreen');
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}} style={{width: '100%', paddingHorizontal: 16}} keyboardShouldPersistTaps="handled">
          <View style={{alignItems: 'center', justifyContent: 'center', width: screenWidth, flex: 1, marginTop: -20}}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Image source={UIConfig.RegSubmittedIcon} style={{height: 150, resizeMode: 'contain'}} />
              <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Reference No.'}</Text>
              <Text style={[styles.iconTitle, {color: '#1974D1'}]}>{registrationRegNo}</Text>
              <Text style={styles.iconDescription}>{'We are currently validating your details'}</Text>
              <Text style={styles.iconDescription}>{'We will send you an email within 24-48 hrs once your account is ready to use'}</Text>
            </View>

            <View style={{width: '100%', marginTop: 20}}>
              <NmButton
                buttonTheme="dark"
                titleStyle={styles.buttonTextStyle}
                title={btnMessage}
                onPress={() => {
                  navigation.pop();
                  navigation.navigate(targetWindow);
                }}
              />
            </View>
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
    marginTop: 10,
    width: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A4A8B0',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 60,
  },
  textInputStyle: {
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
  resendCodeLink: {
    alignSelf: 'center',
    //textDecorationLine: 'underline',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#466DC6',
    fontWeight: '500',
  },
  inputs: {
    flex: 2,
  },
});

export default RegistrationSubmitted;

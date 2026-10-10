import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, DimensionValue, TouchableOpacity} from 'react-native';

import {useDeviceOrientation} from '@react-native-community/hooks';
import DeviceInfo from 'react-native-device-info';
import RNRestart from 'react-native-restart';

import {NmGetNextEdpCode, NmGetSetting, NmHardwareBackPress, NmNullOrEmpty, NmSaveSetting} from '../functions/NmFunctions';
import {APP_ENDPOINT_CONFIGS, APP_KEYS} from '../constants/NmConstants';

import {NmButton, LoadingScreen, NmDropdown, NmLabel, NmTextInput, NmModalDevOptions} from '../components';
import {ThemesContext} from '../functions/ThemeContext';

import {StackScreenProps} from '../navigation/NavigationTypes';
import {NmEndpointCheck} from '../functions/NmNetwork';
import {NmStyles} from '../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WINDOW_WIDTH} from '../constants/NmStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

type Props = StackScreenProps<'EndpointInput'>;

const EndpointInput = ({route, navigation}: Props): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);

  const [EndpointCode, setEndpointCode] = useState<string>('');
  const [EndpointDesc, setEndpointDesc] = useState<string>('');
  const [EndpointEnv, setEndpointEnv] = useState<string>('');
  const [EndpointLink, setEndpointLink] = useState<string>('');
  const [EndpointKey, setEndpointKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [showOptions, setShowOptions] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [devOptions, setDevOptions] = useState<Array<string>>([]);

  const orientation = useDeviceOrientation();

  useEffect((): void => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  NmHardwareBackPress();

  /* UPDATE THIS FUNCTION FOR THE DYNAMIC ENDPOINT LIST */
  const saveEndpoint = async (): Promise<void> => {
    setLoading(true);

    const blankFields = NmNullOrEmpty([EndpointEnv, EndpointCode, EndpointDesc, EndpointLink, EndpointKey]);
    if (blankFields) {
      setLoading(false);
      showError('Please Complete all Fields!');
      return;
    }

    const endpointWorking = await NmEndpointCheck(EndpointLink);

    if (!endpointWorking) {
      setLoading(false);
      showError('Invalid Endpoint');
      return;
    }

    const CleanEndpointLink = EndpointLink.replace(/\/?$/, '/');

    const providedEndpoint = {
      Code: EndpointCode,
      Description: EndpointDesc,
      EndpointLink: CleanEndpointLink,
      SecretKey: EndpointKey,
      Environment: EndpointEnv,
      DeveloperOptions: devOptions,
    };

    const savedEndpointList = await NmGetSetting(APP_KEYS.ENDPOINT_LIST);

    const defaultList = [...APP_ENDPOINT_CONFIGS];
    if (savedEndpointList?.length) {
      const EdpCodeIndex = savedEndpointList.findIndex((item: any) => item.Code == EndpointCode);
      // Check the new endpoint code and make it unique if it exists
      providedEndpoint.Code = NmGetNextEdpCode(EndpointCode, savedEndpointList);

      const newList = [...savedEndpointList];
      if (EdpCodeIndex > -1) {
        newList[EdpCodeIndex] = providedEndpoint;
      } else {
        newList.push(providedEndpoint);
      }

      await NmSaveSetting(APP_KEYS.ENDPOINT_LIST, newList);
    } else {
      defaultList.push(providedEndpoint);
      await NmSaveSetting(APP_KEYS.ENDPOINT_LIST, defaultList);
    }

    await NmSaveSetting(APP_KEYS.ENDPOINT_CURRENT, providedEndpoint);
    await NmSaveSetting(APP_KEYS.ENDPOINT_INIT, true);
    await NmSaveSetting(APP_KEYS.APP_SETUP_FINISHED, true);

    setTimeout((): void => {
      setLoading(false);
      RNRestart.Restart();
    }, 3000);
  };

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout((): void => {
      setErrorMessage('');
    }, 5000);
  };

  const Endpoint_Environment = [
    {value: 'SIT', label: 'SIT: System Integration Testing'},
    {value: 'UAT', label: 'UAT: User Acceptance Testing'},
    {value: 'LIVE', label: 'LIVE: Production'},
  ];

  return (
    // <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? 20 : 0} style={{flex: 1, backgroundColor: '#ffffff0e'}}>
    <View style={[styles.container, {backgroundColor: theme.backgroundColor, marginTop: useSafeAreaInsets().top}]}>
      <NmModalDevOptions visible={showOptions} setVisible={setShowOptions} values={devOptions} setValues={setDevOptions} />

      {loading && <LoadingScreen />}
      <KeyboardAwareScrollView style={{width: screenWidth, paddingHorizontal: 16}} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          delayLongPress={500}
          activeOpacity={0.9}
          onLongPress={() => {
            setShowOptions(true);
          }}
          style={{width: '100%', height: WINDOW_WIDTH * 0.7, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={theme.logo.login} style={{height: 120, resizeMode: 'contain'}} />
        </TouchableOpacity>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <NmLabel style={[NmStyles.poppinsBold]}>{'Environment'}</NmLabel>
          <NmDropdown items={Endpoint_Environment} value={EndpointEnv} setValue={setEndpointEnv} blankDefault={true} />

          <NmLabel style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Code'}</NmLabel>
          <NmTextInput
            minLength={25}
            value={EndpointCode}
            onChangeText={(text: string) => {
              const alphanumericText = text.replace(/[^a-zA-Z0-9_-]/g, '');
              setEndpointCode(alphanumericText);
            }}
            placeholder="Unique Endpoint Code"
            placeholderTextColor="#b6becc"
            clearTextButton={true}
            autoCapitalize="characters"
            maxLength={24}
          />

          <NmLabel style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Description'}</NmLabel>
          <NmTextInput value={EndpointDesc} onChangeText={setEndpointDesc} placeholder="Endpoint Description" placeholderTextColor="#b6becc" clearTextButton={true} maxLength={200} />

          <NmLabel style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Endpoint Link'}</NmLabel>
          <NmTextInput value={EndpointLink} onChangeText={setEndpointLink} placeholder="Enter Endpoint URL here" placeholderTextColor="#b6becc" clearTextButton={true} maxLength={2000} />

          <NmLabel style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Secret Key'}</NmLabel>
          <NmTextInput value={EndpointKey} onChangeText={setEndpointKey} placeholder="Enter Endpoint Secret Key here" placeholderTextColor="#b6becc" clearTextButton={true} maxLength={50} />

          <NmButton
            style={{marginTop: 40}}
            title="Save"
            onPress={() => {
              saveEndpoint();
            }}
          />
          <NmButton
            style={{marginTop: 10}}
            title="Back"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={[styles.errorMessageStyle]}>{errorMessage}</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
    // </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555',
  },
  textInputContainer: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    height: 45,
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
  actionButtons: {
    marginTop: 40,
  },
  dropdown: {
    marginTop: 120,
    height: 50,
  },
  errorMessageStyle: {
    marginVertical: 10,
    fontSize: 14,
    color: '#ff005e',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default EndpointInput;

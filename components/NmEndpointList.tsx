import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList, DimensionValue, ScrollView} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import RNRestart from 'react-native-restart';
import {Animation} from 'react-native-animatable';

import {NmLabel} from './NmComponents';
import {ThemesContext} from '../functions/ThemeContext';
import {AccountDetailsContext} from '../functions/Contexts';
import {APP_CONST, APP_ENDPOINT_CONFIGS, APP_KEYS} from '../constants/NmConstants';
import {getEndpointDetails} from '../functions/NmEndpoint';
import {NmGetSetting, NmSaveSetting} from '../functions/NmFunctions';
import {WINDOW_HEIGHT} from '../constants/NmStyles';
import {LoadingPanel} from './NmLoadingComponents';
import {NmGetEndpointsList} from '../functions/NmNetwork';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../navigation/NavigationTypes';

const ApiConfig = {
  get code(): string | undefined {
    return getEndpointDetails().EndpointCode;
  },
};

export type EndpointItem = {
  Code: string;
  Description: string;
  Environment: string;
  EndpointLink: string;
  SecretKey: string;
};

type Props = {
  onClickClose?: () => void;
  winVisible: boolean;
  setWinVisible: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
  hideSIT?: boolean;
  hideUAT?: boolean;
  hideScan?: boolean;
  customAnimate?: boolean;
  customAnimateIn?: Animation;
  customAnimateOut?: Animation;
  containerStyle?: any;
  errorMsg?: string;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function NmEndpointList(props: Props): React.JSX.Element {
  const {winVisible, setWinVisible, setLoading, customAnimate, customAnimateIn, customAnimateOut, containerStyle, errorMsg, onBackButtonPress, onBackdropPress} = props;

  const {theme} = useContext(ThemesContext);
  const {loginSetters} = useContext(AccountDetailsContext);

  const [EndpointList, setEndpointList] = useState<EndpointItem[]>([]);
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('90%');
  const [panelLoading, setPanelLoading] = useState<boolean>(false);

  const currentEPCode: string | undefined = ApiConfig.code;
  const orientation = useDeviceOrientation();
  const navigation = useNavigation<NavigationProp>();

  const animateIn: Animation = customAnimate == true ? customAnimateIn ?? 'slideInLeft' : 'slideInLeft';
  const animateOut: Animation = customAnimate == true ? customAnimateOut ?? 'slideOutRight' : 'slideOutRight';

  useEffect((): void => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect((): void => {
    setEndpointList(loginSetters.EndpointsList);
  }, [loginSetters.EndpointsList]);

  const renderItem = ({item, index}: {item: EndpointItem; index: number}): React.JSX.Element => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={(): void => {
          changeEndpoint(item);
        }}
        style={{
          width: '100%',
          flexDirection: 'row',
          borderBottomWidth: index < EndpointList.length - 1 ? StyleSheet.hairlineWidth : undefined,
          borderColor: '#AAA',
        }}>
        <View style={{flex: 1, padding: 6}}>
          <View style={{flexDirection: 'row'}}>
            <NmLabel style={{fontSize: 12, color: '#AAA'}}>{'Environment:'}</NmLabel>
            <NmLabel style={{fontSize: 12, color: '#1974D1'}}>{` (${item.Environment})`}</NmLabel>
          </View>

          <NmLabel>{item.Description}</NmLabel>
        </View>

        <View style={{justifyContent: 'center'}}>{currentEPCode == item.Code && <MaterialCommunityIcons name={'check-circle'} size={20} color={'#3885d2'} />}</View>
      </TouchableOpacity>
    );
  };

  async function changeEndpoint(item: EndpointItem): Promise<void> {
    setWinVisible(false);
    setLoading(true);

    try {
      await NmSaveSetting(APP_KEYS.ENDPOINT_CURRENT, item);
      await new Promise<void>(resolve => setTimeout(resolve, 800));

      RNRestart.Restart();
    } catch (error) {
      console.error('Critical Failure in changeEndpoint:', error);
      setLoading(false);
    }
  }

  async function refreshEndpointList(): Promise<void> {
    setPanelLoading(true);

    try {
      const savedEndpointList = (await NmGetSetting(APP_KEYS.ENDPOINT_LIST)) || [];
      const defaultList = [...APP_ENDPOINT_CONFIGS];

      const response = await NmGetEndpointsList();
      const remoteList = response.status == APP_CONST.RESPONSE_OK ? response.data : [];

      let finalArray: Array<any> = [];

      if (savedEndpointList.length > 0) {
        const newRemoteItems = remoteList.filter((item2: any) => !savedEndpointList.some((item1: any) => item1.Code === item2.Code));

        finalArray = [...savedEndpointList, ...newRemoteItems];
      } else {
        finalArray = [...defaultList, ...remoteList];
      }

      await NmSaveSetting(APP_KEYS.ENDPOINT_LIST, finalArray);
      await NmSaveSetting(APP_KEYS.ENDPOINT_INIT, true);

      loginSetters.setEndpointsList(finalArray);
    } catch (error) {
      console.error('Failed to refresh endpoints:', error);
    } finally {
      setPanelLoading(false);
    }
  }

  return (
    <Modal
      isVisible={winVisible}
      onBackButtonPress={(): void => {
        onBackButtonPress?.();
        setPanelLoading(false);
        setWinVisible(false);
      }}
      onBackdropPress={(): void => {
        onBackdropPress?.();
        setPanelLoading(false);
        setWinVisible(false);
      }}
      backdropOpacity={0.3}
      style={{alignItems: 'center', margin: 0}}
      //backdropColor={'white'}
      animationIn={animateIn}
      animationOut={animateOut}
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionOutTiming={0}>
      <View
        style={[
          styles.container,
          containerStyle,
          {
            width: screenWidth,
            backgroundColor: theme.biometricPromptBackground,
          },
        ]}>
        {panelLoading && <LoadingPanel />}
        <View
          style={{
            height: 40,
            backgroundColor: theme.biometricPromptHeader,
            width: '100%',
            borderTopStartRadius: 6,
            borderTopEndRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={refreshEndpointList}>
              <MaterialCommunityIcons style={{marginLeft: 6}} name={'refresh'} size={26} color={'#FFF'} />
            </TouchableOpacity>

            <Text style={[styles.title, {lineHeight: 22, marginLeft: 6}]} numberOfLines={1}>
              {'Switch Endpoint'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={(): void => {
                setWinVisible(false);
                navigation.navigate('EndpointInput');
              }}>
              <MaterialCommunityIcons style={{marginRight: 14}} name={'square-edit-outline'} size={26} color={'#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(): void => {
                setWinVisible(false);
                navigation.navigate('EndpointScanner');
              }}>
              <MaterialCommunityIcons style={{marginRight: 12}} name={'qrcode-scan'} size={20} color={'#FFF'} />
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg && (
          <ScrollView style={{width: '100%'}} contentContainerStyle={{backgroundColor: '#f85b5b', width: '100%', padding: 6}}>
            <Text style={[styles.message, {color: theme.nkProfileInfoText, textAlign: 'justify', marginBottom: 0}]}>{errorMsg}</Text>
          </ScrollView>
        )}

        <View
          style={{
            width: '100%',
            backgroundColor: theme.biometricPromptBackground,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomStartRadius: 6,
            borderBottomEndRadius: 6,
          }}>
          {/* Add Extra UI Here */}
          <FlatList data={EndpointList} renderItem={renderItem} keyExtractor={(_item, index): string => index.toString()} contentContainerStyle={{}} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    maxHeight: WINDOW_HEIGHT * 0.5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  title: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginLeft: 10,
  },
  message: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonTextStyle: {
    fontSize: 14,
  },
  textInputStyle: {
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
});

import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import NmButton from './NmButton';

import {ThemesContext} from '../functions/ThemeContext';
import {APP_CONST} from '../constants/NmConstants';
import {useNavigation} from '@react-navigation/native';
import {WINDOW_HEIGHT} from '../constants/NmStyles';
import {Config} from '../app.config';

export default function NmEndpointPrompt(props) {
  const orientation = useDeviceOrientation();
  const navigation = useNavigation();
  const {theme} = useContext(ThemesContext);

  const [screenWidth, setScreenWidth] = useState('80%');

  const {onButtonPress, onClickClose, winVisible, setWinVisible, hideSIT, hideUAT, hideScan} = props || {};

  const animateIn = props.customAnimate == true ? props.customAnimateIn : 'slideInLeft';
  const animateOut = props.customAnimate == true ? props.customAnimateOut : 'slideOutRight';

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  return (
    <Modal
      isVisible={winVisible}
      onBackButtonPress={() => setWinVisible(false)}
      backdropOpacity={0.3}
      style={{alignItems: 'center', margin: 0}}
      //backdropColor={'white'}
      animationIn={animateIn}
      animationOut={animateOut}
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionOutTiming={0}>
      {props.customView ? (
        props.children
      ) : (
        <View style={[styles.container, props.containerStyle, {width: screenWidth, backgroundColor: theme.biometricPromptBackground}]}>
          <View
            style={{
              height: 40,
              backgroundColor: theme.biometricPromptHeader, //'#1974D1',
              width: '100%',
              borderTopStartRadius: 6,
              borderTopEndRadius: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={[styles.title, {lineHeight: 22, flex: 1}]} numberOfLines={1}>
              {props.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                onClickClose();
              }}>
              <MaterialCommunityIcons style={[{marginRight: 8}]} name={'close-circle-outline'} size={26} color={'#FFF'} />
              {/* <Image source={require('../assets/Icons/component_close_icon.png')} style={{resizeMode: 'contain', height: 26, marginRight: -10}} /> */}
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', backgroundColor: theme.biometricPromptBackground, padding: 10, borderBottomStartRadius: 6, borderBottomEndRadius: 6}}>
            <ScrollView>
              <Text style={[styles.message, {color: theme.nkProfileInfoText}]}>{props.message}</Text>
            </ScrollView>
            {Config.APP_COMP_LOCKED == true ? (
              <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                {!hideSIT && (
                  <NmButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTextStyle}
                    numberOfLines={1}
                    onPress={() => {
                      onButtonPress(APP_CONST.ENDPOINT_CODE_SIT, APP_CONST.ENDPOINT_SIT);
                      setWinVisible(false);
                      //onClickYes();
                    }}
                    title="Change to SIT"
                  />
                )}

                {!hideUAT && (
                  <NmButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTextStyle}
                    numberOfLines={1}
                    onPress={() => {
                      onButtonPress(APP_CONST.ENDPOINT_CODE_UAT, APP_CONST.ENDPOINT_UAT);
                      setWinVisible(false);
                      //onClickYes();
                    }}
                    title="Change to UAT"
                  />
                )}

                {Config.APP_LIVE && (
                  <NmButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTextStyle}
                    numberOfLines={1}
                    onPress={() => {
                      onButtonPress(APP_CONST.ENDPOINT_CODE_LIVE, APP_CONST.ENDPOINT_LIVE);
                      setWinVisible(false);
                      //onClickYes();
                    }}
                    title="Change to LIVE"
                  />
                )}

                {Config.APP_LIVE && (
                  <NmButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTextStyle}
                    numberOfLines={1}
                    onPress={() => {
                      setWinVisible(false);
                      navigation.navigate('NmDevTools', {userIntent: true});
                    }}
                    title="Developer Tools"
                  />
                )}

                {!hideScan && (
                  <NmButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTextStyle}
                    numberOfLines={1}
                    onPress={() => {
                      onButtonPress(APP_CONST.ENDPOINT_CODE_CUS, APP_CONST.ENDPOINT_CUS);
                      setWinVisible(false);
                    }}
                    title="Scan new Endpoint"
                  />
                )}
              </View>
            ) : (
              <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                <NmButton
                  style={styles.buttonStyle}
                  titleStyle={styles.buttonTextStyle}
                  numberOfLines={1}
                  onPress={() => {
                    onButtonPress(APP_CONST.ENDPOINT_CODE_CUS, APP_CONST.ENDPOINT_CUS);
                    setWinVisible(false);
                  }}
                  title="Scan new endpoint"
                />
                <NmButton
                  style={[styles.buttonStyle, {backgroundColor: '#FFF', borderColor: '#777', borderWidth: StyleSheet.hairlineWidth}]}
                  titleStyle={[styles.buttonTextStyle, {color: '#000'}]}
                  numberOfLines={1}
                  onPress={() => {
                    onButtonPress(APP_CONST.ENDPOINT_CODE_CANCEL, APP_CONST.ENDPOINT_CANCEL);
                    setWinVisible(false);
                  }}
                  title="Cancel"
                />
              </View>
            )}
          </View>
        </View>
      )}
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

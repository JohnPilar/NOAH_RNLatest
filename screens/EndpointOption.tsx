import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, ImageBackground, TouchableOpacity, BackHandler, DimensionValue} from 'react-native';

import {useDeviceOrientation} from '@react-native-community/hooks';
import DeviceInfo from 'react-native-device-info';

import {NmButton, LoadingScreen} from '../components';
import {ThemesContext} from '../functions/ThemeContext';
import {UIConfig} from '../Global/UIConfig';
import {NmHardwareBackPress} from '../functions/NmFunctions';

import {StackScreenProps} from '../navigation/NavigationTypes';

type Props = StackScreenProps<'EndpointOption'>;

const EndpointOption = ({route, navigation}: Props): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const {theme} = useContext(ThemesContext);

  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  NmHardwareBackPress(() => {
    BackHandler.exitApp();
    return true;
  });

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={{flex: 1, alignItems: 'center'}} source={theme.logopBackground} imageStyle={{opacity: 0.9, resizeMode: 'cover', alignSelf: 'flex-end'}}>
        {/* <NmStatusBar barColor="transparent" translucent={true} /> */}
        <ScrollView
          style={{width: '100%', backgroundColor: theme.backgroundColor, paddingHorizontal: 16}}
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
          keyboardShouldPersistTaps="handled">
          {loading && <LoadingScreen />}
          <View style={{flex: 1, width: screenWidth, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: '100%', alignItems: 'center', marginTop: 0}}>
              <Image source={theme.logo.login} style={{height: 120, resizeMode: 'contain'}} />
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EndpointScanner');
                }}
                style={{
                  marginTop: 120,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={UIConfig.QRCodeIcon} style={{height: 100, resizeMode: 'contain', tintColor: theme.loginScanIcon}} />
                <Text style={[styles.textStyle, {color: theme.endointText}]}>{'Scan QR'}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={[styles.horizontalLine, {marginRight: 20, borderBottomColor: theme.endointLine}]}></View>
              <Text style={[styles.textStyle, {color: theme.endointText, marginTop: -10}]}>{'or'}</Text>
              <View style={[styles.horizontalLine, {marginLeft: 20, borderBottomColor: theme.endointLine}]}></View>
            </View>
            <NmButton
              style={styles.actionButtons}
              titleStyle={styles.buttonTextStyle}
              buttonTitle
              title="Enter Endpoint and Key"
              onPress={() => {
                navigation.navigate('EndpointInput');
              }}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
  },
  horizontalLine: {
    borderBottomColor: '#777',
    borderBottomWidth: 3,
    flex: 1,
    marginBottom: 14,
  },
  actionButtons: {
    marginTop: 30,
  },
});

export default EndpointOption;

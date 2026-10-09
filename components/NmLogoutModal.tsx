import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, DimensionValue} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '../navigation/NavigationTypes';

import {ThemesContext} from '../functions/ThemeContext';
import {NmClearLoginData} from '../functions/NmFunctions';

import {useStyles} from '../functions/Orientation';
import NmButton from './NmButton';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';

interface NmLogoutModalProps {
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  setParentVisible?: (callback: () => boolean) => void;
  customLogin?: string;
  containerStyle?: any;
}

export default function NmLogoutModal(props: NmLogoutModalProps): React.JSX.Element {
  const {theme, setDarkTheme} = useContext(ThemesContext);
  const {ctxClearUserData} = useContext(AccountDetailsContext);
  const {ctxClearUserConfig} = useContext(AppConfigContext);

  const {visible, setVisible, setParentVisible, customLogin} = props;
  const navigation = useNavigation<StackNavigationProp>();
  const orientation = useDeviceOrientation();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('80%');

  useEffect((): void => {
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
      isVisible={visible}
      onBackButtonPress={() => setVisible?.(false)}
      backdropOpacity={0.3}
      style={{alignItems: 'center', margin: 0}}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionOutTiming={0}>
      <View style={[styles.container, props.containerStyle, {backgroundColor: theme.notifModalBackgroundColor, width: screenWidth}]}>
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
          <Text style={styles.title}>{'Log Out Confirmation'}</Text>
          <TouchableOpacity
            onPress={() => {
              setVisible?.(false);
            }}>
            <Image source={require('../assets/Icons/component_close_icon.png')} style={{resizeMode: 'contain', height: 26, marginRight: -10}} />
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor: theme.notifModalBackgroundColor, padding: 10, borderBottomStartRadius: 6, borderBottomEndRadius: 6}}>
          <Text style={[styles.message, {color: theme.nkProfileInfoText}]}>{'Are you sure you want to Log out?'}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <NmButton
              style={[styles.buttonStyle, {marginRight: 5}]}
              onPress={() => {
                NmClearLoginData(ctxClearUserData, ctxClearUserConfig).then(() => {
                  try {
                    setParentVisible?.(() => {
                      return false;
                    });
                  } catch (error) {
                    //for modal parent
                  }

                  setVisible?.(false);
                  setDarkTheme(false);
                  navigation.pop();
                  navigation.navigate((customLogin == undefined ? 'LoginOptionScreen' : customLogin) as never);
                });
              }}
              buttonTitle
              title="Yes"
            />
            <NmButton
              style={[styles.buttonStyle, {marginLeft: 5}]}
              onPress={() => {
                setVisible?.(false);
              }}
              buttonTitle
              title="No"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
  },
  message: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#1974D1',
    height: 36,
  },
});

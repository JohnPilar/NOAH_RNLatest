import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  DimensionValue,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import { useDeviceOrientation } from '../functions/NmFunctions';
import Modal, { Animations } from 'react-native-modal';

import NmButton from './NmButton';
import { ThemesContext } from '../functions/ThemeContext';

interface NmBiometricPromptProps {
  onClickYes: () => void;
  onClickNo: () => void;
  onClickLater: () => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  customAnimate?: boolean;
  customAnimateIn?: Animations;
  customAnimateOut?: Animations;
  customView?: boolean;
  children?: React.ReactNode;
  containerStyle?: any;
  title?: string;
  message?: string;
}

export default function NmBiometricPrompt(
  props: NmBiometricPromptProps,
): React.JSX.Element {
  const orientation = useDeviceOrientation();
  const { theme } = useContext(ThemesContext);
  const {
    customAnimate,
    customAnimateIn,
    customAnimateOut,
    customView,
    children,
    containerStyle,
    title,
    message,
  } = props || {};

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('80%');
  const [buttonClicked, setButtonClicked] = useState<number | undefined>();

  const { onClickYes, onClickNo, onClickLater, isVisible, setIsVisible } =
    props;

  const animateIn = customAnimate ? customAnimateIn : 'slideInLeft';
  const animateOut = customAnimate ? customAnimateOut : 'slideOutRight';

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
      isVisible={isVisible}
      onModalHide={() => {
        switch (buttonClicked) {
          case 0:
            onClickLater();
            break;
          case 1:
            onClickYes();
            break;
          case 2:
            onClickNo();
            break;
        }
      }}
      onBackButtonPress={() => setIsVisible(false)}
      backdropOpacity={0.3}
      style={{ alignItems: 'center', margin: 0 }}
      animationIn={animateIn}
      animationOut={animateOut}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionOutTiming={0}
    >
      {customView ? (
        children
      ) : (
        <View
          style={[
            styles.container,
            containerStyle,
            {
              width: screenWidth,
              backgroundColor: theme.notifModalBackgroundColor,
            },
          ]}
        >
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
            }}
          >
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.title}>{title}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setButtonClicked(0);
                setIsVisible(false);
              }}
            ></TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: theme.notifModalBackgroundColor,
              padding: 10,
              borderBottomStartRadius: 6,
              borderBottomEndRadius: 6,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 10,
                marginVertical: 5,
              }}
            >
              <Text
                style={[styles.message, { color: theme.nkProfileInfoText }]}
              >
                {message}
              </Text>
            </View>

            <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
              <NmButton
                style={styles.buttonStyle}
                titleStyle={styles.buttonTextStyle}
                numberOfLines={1}
                onPress={() => {
                  setButtonClicked(1);
                  setIsVisible(false);
                }}
                title="Yes"
              />

              <NmButton
                style={[
                  styles.buttonStyle,
                  {
                    backgroundColor: theme.biometricLater,
                    borderColor: '#777',
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                ]}
                titleStyle={[styles.buttonTextStyle, { color: '#AAA' }]}
                numberOfLines={1}
                onPress={() => {
                  setButtonClicked(0);
                  setIsVisible(false);
                }}
                title="Ask me later"
              />

              <NmButton
                style={[
                  styles.buttonStyle,
                  {
                    backgroundColor: theme.biometricNo,
                    borderColor: '#777',
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                ]}
                titleStyle={[styles.buttonTextStyle, { color: '#000' }]}
                numberOfLines={1}
                onPress={() => {
                  setButtonClicked(2);
                  setIsVisible(false);
                }}
                title="No"
              />
            </View>
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
    borderRadius: 6,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  message: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: '#1974D1',
    marginHorizontal: 5,
    marginBottom: 13,
  },
  buttonTextStyle: {
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
});

import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, DimensionValue} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions';
import Modal, {SupportedAnimation} from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmButton from './NmButton';
import {ThemesContext} from '../functions/ThemeContext';

interface NmModalProps {
  onClickYes?: () => void;
  onClickNo?: () => void;
  onClickOk?: () => void;
  onClickThird?: () => void;
  onClickClose?: () => void;
  winVisible: boolean;
  setWinVisible: (visible: boolean) => void;
  showCloseButton?: boolean;
  hideNoButton?: boolean;
  OkTitle?: string;
  YesTitle?: string;
  NoTitle?: string;
  ThirdButton?: boolean;
  ThirdButtonTitle?: string;
  customAnimate?: boolean;
  customAnimateIn?: SupportedAnimation;
  customAnimateOut?: SupportedAnimation;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  backdropOpacity?: number;
  modalStyle?: any;
  backdropColor?: string;
  hasBackdrop?: boolean;
  inTiming?: number;
  outTiming?: number;
  customView?: boolean;
  children?: React.ReactNode;
  containerStyle?: any;
  headerContainerStyle?: any;
  title?: string;
  closeButtonStyle?: any;
  customContent?: boolean;
  message?: string;
  messageStyle?: any;
  modalType?: string;
  actionButtonStyle?: any;
  yesButtonStyle?: any;
  noButtonStyle?: any;
  thirdButtonStyle?: any;
  okButtonStyle?: any;
}

export default function NmModal(props: NmModalProps): React.JSX.Element {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('95%');

  const {
    onClickYes,
    onClickNo,
    onClickOk,
    onClickThird,
    onClickClose,
    winVisible,
    setWinVisible,
    OkTitle,
    YesTitle,
    NoTitle,
    ThirdButton,
    ThirdButtonTitle,
    customAnimate,
    customAnimateIn,
    customAnimateOut,
    onBackButtonPress,
    onBackdropPress,
    backdropOpacity,
    modalStyle,
    backdropColor,
    hasBackdrop,
    inTiming,
    outTiming,
    customView,
    children,
    containerStyle,
    headerContainerStyle,
    title,
    closeButtonStyle,
    customContent,
    message,
    messageStyle,
    modalType,
    actionButtonStyle,
    yesButtonStyle,
    noButtonStyle,
    thirdButtonStyle,
    okButtonStyle,
    showCloseButton = true,
    hideNoButton = false,
  } = props;

  const OkTitleVal = OkTitle != undefined ? OkTitle : 'Ok';
  const YesTitleVal = YesTitle != undefined ? YesTitle : 'Yes';
  const NoTitleVal = NoTitle != undefined ? NoTitle : 'No';

  const ThirdButtonVal = ThirdButton != undefined ? ThirdButton : false;
  const ThirdButtonTitleVal = ThirdButtonTitle != undefined ? ThirdButtonTitle : 'Not Sure';

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  function closeFunction(actionProps?: () => void): void {
    if (actionProps) {
      actionProps();
      return;
    }
    setWinVisible(false);
  }

  const animateIn = customAnimate ? customAnimateIn : 'slideInLeft';
  const animateOut = customAnimate ? customAnimateOut : 'slideOutRight';

  return (
    <Modal
      isVisible={winVisible}
      onBackButtonPress={() => closeFunction(onBackButtonPress)}
      onBackdropPress={() => closeFunction(onBackdropPress)}
      backdropOpacity={backdropOpacity || 0.3}
      style={[{alignItems: 'center', margin: 0}, modalStyle]}
      backdropColor={backdropColor}
      hasBackdrop={hasBackdrop}
      animationIn={animateIn}
      animationOut={animateOut}
      animationInTiming={inTiming || 400}
      animationOutTiming={outTiming || 400}
      backdropTransitionOutTiming={0}>
      {customView ? (
        children
      ) : (
        <View style={[styles.container, {width: screenWidth, backgroundColor: theme.notifModalBackgroundColor}, containerStyle]}>
          <View
            style={[
              {
                height: 40,
                backgroundColor: '#1974D1',
                width: '100%',
                borderTopStartRadius: 6,
                borderTopEndRadius: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              },
              headerContainerStyle,
            ]}>
            <Text style={styles.title}>{title}</Text>
            {showCloseButton && (
              <TouchableOpacity
                onPress={() => {
                  closeFunction(onClickClose);
                }}
                style={closeButtonStyle}>
                <MaterialCommunityIcons style={[{marginRight: 8}]} name={'close-circle-outline'} size={28} color={'#FFF'} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{width: '100%', backgroundColor: theme.notifModalBackgroundColor, padding: 10, borderBottomStartRadius: 6, borderBottomEndRadius: 6}}>
            {customContent ? children : <Text style={[styles.message, {color: theme.nkProfileInfoText}, messageStyle]}>{message}</Text>}
            {modalType == 'WIN_QUESTION' && (
              <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <NmButton
                    style={[styles.buttonStyle, {marginRight: 5}, actionButtonStyle, yesButtonStyle]}
                    titleStyle={[styles.buttonTextStyle]}
                    onPress={() => {
                      onClickYes?.();
                    }}
                    buttonTitle
                    title={YesTitleVal}
                  />
                  {!hideNoButton && (
                    <NmButton
                      style={[styles.buttonStyle, {marginLeft: 5}, actionButtonStyle, noButtonStyle]}
                      titleStyle={styles.buttonTextStyle}
                      onPress={() => {
                        onClickNo?.();
                      }}
                      buttonTitle
                      title={NoTitleVal}
                    />
                  )}
                </View>
                {ThirdButtonVal && (
                  <NmButton
                    style={[styles.buttonStyle, {marginTop: 5}, actionButtonStyle, thirdButtonStyle]}
                    titleStyle={styles.buttonTextStyle}
                    onPress={() => {
                      onClickThird?.();
                    }}
                    buttonTitle
                    title={ThirdButtonTitleVal}
                  />
                )}
              </View>
            )}
            {modalType == 'WIN_INFO' && (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <NmButton
                  style={[styles.buttonStyle, actionButtonStyle, okButtonStyle]}
                  titleStyle={styles.buttonTextStyle}
                  onPress={() => {
                    onClickOk?.();
                  }}
                  buttonTitle
                  title={OkTitleVal}
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
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
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
    fontSize: 14,
    marginBottom: 15,
    marginTop: 0,
    textAlign: 'justify',
  },
  buttonStyle: {
    height: 36,
    flex: 1,
    backgroundColor: '#1974D1',
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

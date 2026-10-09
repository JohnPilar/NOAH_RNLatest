import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, DimensionValue, ScrollView} from 'react-native';
import {Checkbox} from 'react-native-paper';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmButton from './NmButton';
import {ThemesContext} from '../functions/ThemeContext';
import {NmLabel} from './NmComponents';
import {DevOptionKeys} from '../constants/NmConstants';
import {NmStyles} from '../constants';
import {WINDOW_HEIGHT} from '../constants/NmStyles';

export default function NmModalDevOptions(props: any) {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);
  const {
    visible,
    setVisible,
    values = [],
    setValues,
    showCloseButton,
    onClickClose,
    onBackButtonPress,
    onBackdropPress,
    modalStyle,
    containerStyle,
    headerContainerStyle,
    closeButtonStyle,
    customAnimateIn,
    customAnimateOut,
    inTiming,
    outTiming,
    checkboxStyle,
  } = props || {};

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('95%');
  const [devOptions, setDevOptions] = useState<Array<string>>(values);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    if (visible) {
      setDevOptions(values);
    }
  }, [visible, values]);

  function closeFunction(actionProps?: any) {
    if (actionProps) {
      actionProps();
      return;
    }
    setDevOptions([]);
    setVisible(false);
  }

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => closeFunction(onBackButtonPress)}
      onBackdropPress={() => closeFunction(onBackdropPress)}
      backdropOpacity={props?.backdropOpacity || 0.3}
      style={[{alignItems: 'center', margin: 0}, modalStyle]}
      animationIn={customAnimateIn || 'slideInLeft'}
      animationOut={customAnimateOut || 'slideOutRight'}
      animationInTiming={inTiming || 400}
      animationOutTiming={outTiming || 400}
      backdropTransitionOutTiming={0}>
      <View style={[styles.container, {width: screenWidth, backgroundColor: theme.notifModalBackgroundColor, maxHeight: WINDOW_HEIGHT / 2}, containerStyle]}>
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
          <Text style={styles.title}>{'Endpoint Dev Options'}</Text>
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
        <View
          style={{
            width: '100%',
            backgroundColor: theme.notifModalBackgroundColor,
            paddingHorizontal: 10,
            paddingBottom: 10,
            borderBottomStartRadius: 6,
            borderBottomEndRadius: 6,
          }}>
          <ScrollView contentContainerStyle={{flexGrow: 1}} style={{paddingVertical: 6}}>
            {DevOptionKeys.map((item: any, _) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  style={{flexDirection: 'row', paddingVertical: 6, alignItems: 'center'}}
                  onPress={() => {
                    try {
                      setDevOptions(
                        (currentItems: Array<any>) =>
                          currentItems.some(v => v == item.value)
                            ? currentItems.filter(v => v != item.value) // Remove if exists
                            : [...currentItems, item.value], // Add if missing
                      );
                    } catch {}
                  }}>
                  <View pointerEvents="none">
                    <Checkbox.Android status={devOptions.includes(item?.value) ? 'checked' : 'unchecked'} color="#2E7FF9" uncheckedColor="gray" style={[checkboxStyle]} />
                  </View>
                  <View style={{flex: 1, marginHorizontal: 5, marginLeft: 10}}>
                    <NmLabel style={[NmStyles.poppinsRegular, {fontSize: 14}]} numberOfLines={1}>
                      {item?.description}
                    </NmLabel>
                    <NmLabel style={[NmStyles.poppinsRegular, {fontSize: 10, color: '#A4A8B0'}]}>{item?.longDescription}</NmLabel>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <NmButton
                style={[styles.buttonStyle, {marginRight: 5}]}
                titleStyle={[styles.buttonTextStyle]}
                onPress={() => {
                  setValues(devOptions);
                  setVisible(false);
                }}
                buttonTitle
                title={'Save'}
              />
              <NmButton
                style={[styles.buttonStyle, {marginLeft: 5}]}
                titleStyle={styles.buttonTextStyle}
                onPress={() => {
                  setDevOptions([]);
                  setVisible(false);
                }}
                buttonTitle
                title={'Cancel'}
              />
            </View>
          </View>
        </View>
      </View>
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

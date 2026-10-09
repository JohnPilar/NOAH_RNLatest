import React, {useContext} from 'react';
import {StyleSheet, Text, StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {ThemesContext} from '../functions/ThemeContext';

// =============================================================================================
// =================================== BASIC COMPONENTS ========================================
// =============================================================================================

export const NmLabel = (props: any) => {
  const {onPress, style} = props || {};
  const {theme} = useContext(ThemesContext);
  return (
    <Text style={[styles.labelStyle, {color: theme.textColor}, style]} onPress={onPress}>
      {props.children}
    </Text>
  );
};

export const NmStatusBar = (props: any) => {
  const barColor = props.barColor == undefined ? '#FFF' : props.barColor;
  const isFocused = useIsFocused();

  return isFocused && <StatusBar backgroundColor={barColor} {...props} barStyle={props?.barStyle} />;
};

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
  },
});

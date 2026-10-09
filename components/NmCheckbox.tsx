import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Platform} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {ThemesContext} from '../functions/ThemeContext';

export default function NmCheckbox(props: any) {
  const {value, onValueChange, label, labelPlacement, containerStyle, style, labelStyle, checkboxStyle, disabled = false, androidTransform, enabled = true} = props || {};
  const {theme} = useContext(ThemesContext);

  const labelPosition: string = labelPlacement == undefined ? 'RIGHT' : labelPlacement;
  const isComponentDisabled = disabled || !enabled;

  return (
    <TouchableOpacity disabled={isComponentDisabled} onPress={() => onValueChange?.(!value)} style={containerStyle} activeOpacity={0.6}>
      <View style={[styles.checkboxContainer, style]} pointerEvents="none">
        {labelPosition === 'LEFT' && (
          <Text style={[styles.labelStyle, {marginBottom: -2, color: theme.chkradText}, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.checkboxWrapper,
            {
              transform: Platform.OS === 'ios' ? [{scaleX: 0.8}, {scaleY: 0.8}] : androidTransform || [],
            },
          ]}>
          <Checkbox.Android status={value ? 'checked' : 'unchecked'} disabled={isComponentDisabled} color="#2E7FF9" uncheckedColor="gray" style={[styles.checkboxStyle, checkboxStyle]} />
        </View>

        {labelPosition === 'RIGHT' && (
          <Text style={[styles.labelStyle, {marginBottom: -2, color: theme.chkradText}, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  checkboxWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxStyle: {
    margin: 0,
    padding: 0,
  },
});

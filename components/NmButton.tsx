import {TouchableOpacity, Text} from 'react-native';

import {NmColors, NmStyles} from '../constants';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';

export default function NmButton(props: any) {
  const buttonStyle = props.buttonTheme == 'dark' ? NmStyles.buttonDark : NmStyles.buttonLight;
  const {theme} = useContext(ThemesContext);

  const buttonColor = props?.buttonTheme ? (props.buttonTheme == 'dark' ? NmColors.buttonDark : NmColors.buttonLight) : theme.name == 'dark' ? NmColors.buttonDark : NmColors.buttonLight;

  return (
    <TouchableOpacity {...props} style={[buttonStyle, {backgroundColor: props.disabled ? NmColors.buttonDisabled : buttonColor}, props.style]} onPress={props.onPress} disabled={props.disabled}>
      {props.children}
      <Text style={[NmStyles.buttonTextStyle, props.titleStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

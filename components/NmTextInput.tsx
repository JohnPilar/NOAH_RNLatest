import {useState, forwardRef, useRef, useImperativeHandle, useContext, ForwardedRef} from 'react';
import {View, TextInput, TouchableOpacity, ViewStyle, TextStyle, StyleProp, TextInputProps} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NmStyles, NmColors} from '../constants';
import {ThemesContext} from '../functions/ThemeContext';

interface NmTextInputRef {
  enableSecureEntry: () => void;
}

interface NmTextInputProps extends TextInputProps {
  onChangeText?: (val: string) => void;
  clearTextButton?: boolean;
  secureTextButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  inputFormat?: string;
  minLength?: number;

  editable?: boolean;
  secureTextValue?: string;
  disabled?: boolean;
  onKeyPressNm?: ({nativeEvent}: any) => void;
  onFocus?: ({nativeEvent}: any) => void;
  onSubmitEditing?: ({nativeEvent}: any) => void;
  value: string;
}

type ValidationState = 'default' | 'focused' | 'invalid' | 'valid';

const NmTextInput = forwardRef((props: NmTextInputProps, ref: ForwardedRef<NmTextInputRef>) => {
  const {theme} = useContext(ThemesContext);
  const {clearTextButton, secureTextButton, containerStyle, textInputStyle, autoCapitalize, onKeyPressNm, minLength, onFocus, value, onChangeText, ...rest} = props || {};

  const [showClearTextIcon, setShowClearTextIcon] = useState<boolean>(false);
  const [secureText, setSecureText] = useState(secureTextButton == undefined ? true : !secureTextButton);
  const [focused, setFocused] = useState<boolean>(false);

  const currentText = value?.toString() ?? '';
  const validationState: ValidationState = (() => {
    if (!focused) return 'default';

    if (minLength == undefined) return 'focused';

    if (currentText.length == 0) return 'focused';

    if (currentText.length < minLength) return 'invalid';

    return 'valid';
  })();

  const borderColors: Record<ValidationState, string> = {
    default: theme.panelBorder,
    focused: '#1976D2',
    invalid: '#E53935',
    valid: '#43A047',
  };

  const TextboxRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const enableSecureEntry = () => {
    setSecureText(false);
  };

  useImperativeHandle(ref, () => ({
    enableSecureEntry,
  }));

  return (
    <View
      style={[
        NmStyles.textInputContainer,
        {
          backgroundColor: theme.panelBackground,
          borderColor: theme.panelBorder,
        },
        containerStyle,
        {borderColor: borderColors[validationState]},
      ]}>
      <TextInput
        ref={TextboxRef}
        style={[NmStyles.textInput, textInputStyle, {color: theme.textColor}]}
        onFocus={() => {
          setFocused(true);
          setShowClearTextIcon(true);
        }}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setFocused(false);
          setShowClearTextIcon(false);
        }}
        placeholderTextColor={NmColors.placeholderTextColor}
        // onChangeText={value => {
        //   textValueHandler?.(value);
        // }}
        //value={textValue}
        onKeyPress={onKeyPressNm}
        secureTextEntry={!secureText}
        autoCapitalize={autoCapitalize}
        {...rest}
      />
      {secureTextButton && (
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          {showClearTextIcon && <MaterialCommunityIcons style={{paddingHorizontal: 5, marginHorizontal: 5}} name={!secureText ? 'eye-off-outline' : 'eye-outline'} size={20} color={'#b6becc'} />}
        </TouchableOpacity>
      )}
      {clearTextButton && (
        <TouchableOpacity
          onPress={() => {
            onChangeText?.('');
            TextboxRef?.current?.focus();
          }}>
          {showClearTextIcon && <MaterialCommunityIcons style={{paddingHorizontal: 5, marginHorizontal: 5}} name={'close-circle-outline'} size={20} color={'#b6becc'} />}
        </TouchableOpacity>
      )}
    </View>
  );
});

export default NmTextInput;

import React, {useState, useRef, useImperativeHandle, forwardRef, useContext, ForwardedRef} from 'react';
import {StyleSheet, View, TextInput, ViewStyle} from 'react-native';
import {ThemesContext} from '../functions/ThemeContext';

interface NmMobileOTPRef {
  clearText: () => void;
}

interface NmMobileOTPProps {
  inputCount: number;
  onOTPChange: (val: string) => void;
  customBorderColor?: string;
  customBorderHighlightColor?: string;
  textInputContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  textInputStyle?: ViewStyle;
}

const NmMobileOTP = forwardRef((props: NmMobileOTPProps, ref: ForwardedRef<NmMobileOTPRef>) => {
  const {inputCount, onOTPChange, customBorderColor, customBorderHighlightColor, textInputContainerStyle, containerStyle, textInputStyle} = props || {};
  const {theme} = useContext(ThemesContext);

  const otpLength = inputCount < 4 || inputCount == undefined ? 4 : inputCount;

  const inputReference = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);
  const textInputBorderColor = customBorderColor == undefined ? theme.otpmTextBorder : customBorderColor;
  const textInputBorderHighlightColor = customBorderHighlightColor == undefined ? '#466DC6' : customBorderHighlightColor;

  const [boxBorderColor, setBoxBorderColor] = useState(Array(otpLength).fill(textInputBorderColor));
  const [otpValue, setOtpValue] = useState(Array(otpLength).fill(''));

  function updateFocusColor(index: number, color: string): void {
    let tmpColorArray = boxBorderColor.slice();
    tmpColorArray[index] = color;
    setBoxBorderColor(tmpColorArray);
  }

  function updateOTPValue(index: number, value: string): void {
    let tmpOTPAray = otpValue.slice();
    tmpOTPAray[index] = value;

    setOtpValue(tmpOTPAray);
    onOTPChange(tmpOTPAray.join(''));
  }

  const clearText = () => {
    setOtpValue(Array(otpLength).fill(''));
    onOTPChange('');
    setBoxBorderColor(Array(otpLength).fill(textInputBorderColor));
  };

  useImperativeHandle(ref, () => ({
    clearText,
  }));

  return (
    <View style={[containerStyle, styles.container]}>
      {Array.from({length: otpLength}).map((_, index) => {
        return (
          <View key={index} style={[styles.textInputContainerStyle, textInputContainerStyle]}>
            <TextInput
              ref={el => {
                inputReference.current[index] = el;
              }}
              style={[styles.textInputStyle, {borderColor: boxBorderColor[index], backgroundColor: theme.otpmTextBackground, color: theme.otpmTextColor}, textInputStyle]}
              onFocus={() => {
                updateFocusColor(index, textInputBorderHighlightColor);
              }}
              onBlur={() => {
                updateFocusColor(index, textInputBorderColor);
              }}
              onChangeText={value => {
                let navIndex: number = value != '' ? (index < otpLength - 1 ? index + 1 : index) : index == 0 ? index : index - 1;
                inputReference.current[navIndex]?.focus();
                updateOTPValue(index, value);
              }}
              value={otpValue[index]}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  if (otpValue[index] == '') {
                    let tmpIndex = index - 1;

                    if (tmpIndex > -1) {
                      updateOTPValue(tmpIndex, '');
                      inputReference.current[tmpIndex]?.focus();
                      inputReference.current[tmpIndex]?.clear();
                    }
                  }
                }
              }}
              caretHidden={true}
              maxLength={1}
              selectTextOnFocus={true}
              selectionColor={'rgba(0,0,0,0)'}
              keyboardType="numeric"></TextInput>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  textInputContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
  },
  textInputStyle: {
    color: '#466DC6',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    padding: 0,
    paddingTop: 3,
    borderWidth: 1.4,
    borderRadius: 6,
    width: 45,
    height: 45,
  },
});

export default NmMobileOTP;

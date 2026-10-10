import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {NmLabel} from '../../../components';
import {DynamicRender} from './DynamicComponents';
import {NmColors, NmStyles} from '../../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

export default function DynamicView(props) {
  const {miComponents, menuTitle} = props;
  const [componentsList, setComponentsList] = useState(miComponents);

  const [values, setValues] = useState(miComponents?.length > 0 ? new Array(miComponents.length) : []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? -140 : 0} style={{flex: 1}}>
        <View style={[styles.container, props.style]}>
          <View style={{backgroundColor: NmColors.buttonDark, paddingHorizontal: 16, paddingTop: useSafeAreaInsets().top}}>
            <NmLabel style={[NmStyles.poppinsBold, {fontSize: 20, paddingVertical: 10, color: '#FFF'}]}>{menuTitle}</NmLabel>
          </View>

          <View style={{flex: 1, padding: 16}}>
            {componentsList ? (
              componentsList.map((item, index) => {
                return (
                  <DynamicRender
                    key={index.toString()}
                    type={item?.type}
                    label={item?.label}
                    style={item?.style}
                    value={values[index]}
                    setValue={val => {
                      let tmpVal = [...values];
                      tmpVal[index] = val;
                      setValues(tmpVal);
                    }}
                    items={item?.data}
                    readOnly={item?.readOnly}
                    disabled={item?.disabled}
                    required={item?.required}
                  />
                );
              })
            ) : (
              <NmLabel>{'No Components Found'}</NmLabel>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
  },
});

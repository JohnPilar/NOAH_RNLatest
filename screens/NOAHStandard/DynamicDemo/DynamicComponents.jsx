import {Image, ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {NmDateModal, NmDropdown, NmLabel, NmTextInput} from '../../../components';
var XDate = require('xdate');
var keyCtr = 0;

export const DynamicRender = objProps => {
  const {type, label, value, setValue, items, style, readOnly, disabled, required} = objProps;

  keyCtr += 1;

  switch (type) {
    case 'TextInput': {
      return (
        <View style={[styles.container, style]}>
          <NmLabel style={styles.labelStyle}>
            {label}
            {required && <RequireAsterisk />}
          </NmLabel>
          <NmTextInput value={value} onChangeText={value => setValue(value)} placeholder="" readOnly={readOnly} />
        </View>
      );
    }

    case 'Dropdown': {
      return (
        <View style={[styles.container, style]}>
          <NmLabel style={styles.labelStyle}>
            {label}
            {required && <RequireAsterisk />}
          </NmLabel>
          <NmDropdown items={items} value={value} setValue={setValue} disabled={disabled} />
        </View>
      );
    }

    case 'DatePicker': {
      const compValue = value == '' || value == undefined ? new XDate() : value;
      return (
        <View style={[styles.container, style]}>
          <NmLabel style={styles.labelStyle}>
            {label}
            {required && <RequireAsterisk />}
          </NmLabel>
          <NmDateModal setDateValue={setValue} dateValue={compValue} pickerMode={'DEVICE'} />
        </View>
      );
    }

    // case 'TouchableWithoutFeedback': {
    //   return (
    //     <TouchableWithoutFeedback key={keyCtr} {...props}>
    //       {NMRenderer(children)}
    //     </TouchableWithoutFeedback>
    //   );
    // }

    // case 'ImageBackground': {
    //   return (
    //     <ImageBackground key={keyCtr} source={source} style={styles} {...props}>
    //       {children.map(item => NMRenderer(item))}
    //     </ImageBackground>
    //   );
    // }
  }
};

const RequireAsterisk = props => {
  return <NmLabel style={[{color: '#ff0000ff'}, props.style]}>{'*'}</NmLabel>;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelStyle: {
    marginLeft: 3,
  },
});

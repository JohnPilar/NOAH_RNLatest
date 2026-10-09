import React, {PureComponent, useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {useStyles} from '../functions/Orientation';
import {NmExec} from './NmExec';

var keyCtr = 0;

export const NMRenderer = objProps => {
  const {type, props, styles, textStyle, children, text, source, func} = objProps;

  const NwClass = useStyles();
  keyCtr += 1;

  switch (type) {
    case 'KeyboardAvoidingView': {
      return (
        <KeyboardAvoidingView key={keyCtr} {...props}>
          {children.map(item => NMRenderer(item))}
        </KeyboardAvoidingView>
      );
    }

    case 'View': {
      return (
        <View key={keyCtr} style={styles}>
          {children.map(item => NMRenderer(item))}
        </View>
      );
    }

    case 'Text': {
      return (
        <Text key={keyCtr} style={styles}>
          {text}
        </Text>
      );
    }

    // case 'Button': {
    //   return (
    //     <NkButton
    //       key={keyCtr}
    //       style={styles}
    //       titleStyle={textStyle}
    //       buttonTitle
    //       title="Test Button"
    //       customClick={() => {
    //         func.method();
    //         // var callFunc = new Function(func.method);
    //         // callFunc();
    //       }}
    //     />
    //   );
    // }

    case 'TouchableWithoutFeedback': {
      return (
        <TouchableWithoutFeedback key={keyCtr} {...props}>
          {NMRenderer(children)}
        </TouchableWithoutFeedback>
      );
    }

    case 'TextInput': {
      return <NmTextInput key={keyCtr} style={styles} placeholderTextColor="#b6becc" {...props} />;
    }

    case 'Image': {
      return <Image key={keyCtr} source={source} style={styles} {...props} />;
    }

    case 'ImageBackground': {
      return (
        <ImageBackground key={keyCtr} source={source} style={styles} {...props}>
          {children.map(item => NMRenderer(item))}
        </ImageBackground>
      );
    }
  }
};

const NmTextInput = props => {
  const [textValue, setTextValue] = useState();

  return <TextInput {...props} onChangeText={value => setTextValue(value)} value={textValue} />;
};

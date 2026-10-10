import React, {PureComponent, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, ToastAndroid, TextInput, ScrollView, Alert, RN} from 'react-native';

import {NMRenderer} from '../functions/NmRenderer';

const DynamicScreen = props => {
  const sty = {
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontWeight: '900',
      fontSize: 14,
    },
    button: {
      backgroundColor: '#00425A',
      width: 240,
      height: 50,
      margin: 10,
      alignItems: 'center', //horizontal
      justifyContent: 'center', //vertical
    },
  };

  const [testVal, setTestVal] = useState();
  const [changeVal, setChangeVal] = useState('from text input');

  const renderObject = {
    type: 'TouchableWithoutFeedback',
    //props: {onPress: 'Keyboard.dismiss'},
    children: {
      type: 'View',
      styles: styles.container,
      children: [
        {
          type: 'Image',
          styles: [{width: 200, height: 120, resizeMode: 'contain'}],
          //source: require('../assets/Logos/LogoWhite.png'),
        },
        {
          type: 'View',
          styles: {
            paddingHorizontal: 10,
            width: '100%',
          },
          children: [
            {
              type: 'Text',
              styles: styles.formText,
              text: 'Welcome to',
            },
            {
              type: 'Text',
              styles: styles.formGreetings,
              text: "Unit Owner's Portal",
            },
            {
              type: 'View',
              styles: {width: '100%'},
              children: [
                {
                  type: 'KeyboardAvoidingView',
                  props: [{behavior: 'height'}],
                  children: [
                    {
                      type: 'Text',
                      styles: {fontWeight: '800', color: 'black'},
                      text: 'Account No.',
                    },
                    {
                      type: 'Text',
                      styles: {fontWeight: '800', color: 'black'},
                      text: changeVal,
                    },
                  ],
                },
              ],
            },
            {
              type: 'TextInput',
              props: {placeholder: 'Sample Dynamic Placeholder'},
              styles: {width: '100%', height: 40, marginHorizontal: 0, borderColor: 'black', borderWidth: 1, color: 'black'},
            },
            {
              type: 'TextInput',
              props: {placeholder: 'Sample Dynamic Two'},
              styles: {width: '100%', height: 40, marginHorizontal: 0, borderColor: 'black', borderWidth: 1, color: 'black'},
            },
            {
              type: 'Button',
              styles: styles.actionButtons,
              textStyle: styles.buttonTextStyle,
              text: 'Sample Button',
            },
          ],
        },
      ],
    },
  };

  //console.log('String object tree', JSON.stringify(renderObject));
  const screenUI = NMRenderer(renderObject);

  return screenUI;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 0,
  },
  actionButtons: {
    marginTop: 20,
    borderRadius: 6,
    width: '100%',
    height: 45,
    backgroundColor: '#133561',
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: 'white',
  },
  formGreetings: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  formText: {
    fontSize: 16,
    opacity: 0.7,
    color: 'black',
    fontWeight: '800',
    marginTop: 0,
  },
  textboxContainer: {
    marginTop: 24,
  },
  textInput: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bec8d9',
    height: 50,
    color: '#000',
  },
  textInput2: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#bec8d9',
    height: 40,
  },
  captchaContainer: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 10,
  },
  captcha: {
    width: '100%',
    height: 100,
  },
  captchaText: {
    fontWeight: '400',
    color: '#06224d',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff005e',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: '400',
    padding: 10,
  },
  forgetPassword: {
    textDecorationLine: 'underline',
    paddingTop: 20,
    fontSize: 14,
    color: '#06224d',
    fontWeight: '500',
  },
});

export default DynamicScreen;

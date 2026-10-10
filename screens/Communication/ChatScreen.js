import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Image, KeyboardAvoidingView, BackHandler, TouchableOpacity, FlatList, Platform} from 'react-native';

import {useDeviceOrientation} from '../../functions/NmFunctions';

import {NmTextInput} from '../../components';

import {ThemesContext} from '../../functions/ThemeContext';
import {PropertyNameContext} from '../../functions/Contexts';

const ChatScreen = props => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);
  const PropNameContext = useContext(PropertyNameContext);

  const flatListRef = React.useRef();

  const [inputText, setInputText] = useState();

  let sampleMessage = [
    {
      role: 'user',
      content: 'Hello, I need help',
    },
    {
      role: 'system',
      content: 'Hello, please type your query and I will try my best to answer it',
    },
    {
      role: 'user',
      content: 'How to create a simple react native program?',
    },
    {
      role: 'system',
      content: 'First, you need to download and prepare all the required applications and libraries to start',
    },
    {
      role: 'user',
      content: 'What are the requirements?',
    },
    {
      role: 'system',
      content: 'First, download node.js',
    },
    {
      role: 'user',
      content: 'What else?',
    },
    {
      role: 'system',
      content: 'If you are on Windows, downloading Android Studio will greatly help you in setting up your workspace',
    },
    {role: 'user', content: 'Is that all I need?'},
  ];

  const [messagesObject, setMessagesObject] = useState(sampleMessage.reverse());

  useEffect(() => {
    function handleBackButton() {
      props.navigation.pop();
      props.navigation.navigate('LoginOptionScreen');
      return true;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  const renderMessage = ({item}) => {
    return (
      <View style={{alignItems: item.role == 'user' ? 'flex-end' : 'flex-start'}}>
        <View style={[styles.messageContainer, {backgroundColor: item.role == 'user' ? 'green' : '#FFF'}]}>
          <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: item.role == 'user' ? '#FFF' : '#000'}}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 10}}>
      <View style={{padding: 16, backgroundColor: 'green', width: '100%'}}>
        <Text>{'Recipient Name Here'}</Text>
      </View>
      <FlatList inverted ref={flatListRef} data={messagesObject} renderItem={renderMessage} keyExtractor={(item, index) => index} />

      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'android' ? -280 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
        style={{flexDirection: 'row', paddingVertical: 7, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 10, marginBottom: 5}}>
        <NmTextInput containerStyle={{width: 0, flex: 1}} placeholder={'Enter your message'} returnKeyType="next" value={inputText} onChangeText={setInputText} blurOnSubmit={false} />
        <TouchableOpacity
          onPress={() => {
            if (inputText != '') {
              let tmpObject = messagesObject;
              tmpObject.unshift({role: 'user', content: inputText});
              setMessagesObject(tmpObject);
              setInputText('');
            }
          }}>
          <Image source={require('../../assets/Icons/setting_email.png')} style={{width: 45, height: 45, margin: 2, resizeMode: 'contain'}} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: '#FFF',
    minWidth: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
    borderColor: '#000',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default ChatScreen;

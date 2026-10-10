import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Image, KeyboardAvoidingView, TouchableOpacity, Platform} from 'react-native';

import {NmTextInput} from '../../components/index.jsx';
import {ThemesContext} from '../../functions/ThemeContext.tsx';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatScreenProps {
  route?: {
    params?: {
      chatInfo?: any;
    };
  };
}

const ChatScreen = (props: ChatScreenProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const [inputText, setInputText] = useState<string>('');
  const [messagesObject, setMessagesObject] = useState<any[]>([]);

  return (
    <View style={{flex: 1, backgroundColor: '#FAFAFA'}}>
      <View style={{padding: 16, backgroundColor: 'green', width: '100%'}}>
        <Text>{'Recipient Name Here'}</Text>
      </View>

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

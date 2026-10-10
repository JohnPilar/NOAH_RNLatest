import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Platform, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
//import {KeyboardAvoidingView} from 'react-native';

import {APP_CONST, APP_KEYS, NmStyles} from '../../constants';
import {LoadingScreen} from '../../components';
import {NmHardwareBackPress, NmSaveSetting} from '../../functions/NmFunctions';
import {AccountDetailsContext, MessagesContext} from '../../functions/Contexts';
import MessageItem from './MessageItem';
import XDate from 'xdate';

export default function AssistantScreen(props) {
  const {recuser} = useContext(AccountDetailsContext);
  const messageContext = useContext(MessagesContext);

  const [loading, setLoading] = useState(false);
  const [userMessages, setUserMessages] = useState();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const upperUserID = 'NOAH_AI';
  useEffect(() => {
    const sampleAIresponse = [
      {
        fromUser: true,
        message: "Hello, I'm Baymax, your personal healthcare assistant!",
        dateTime: new XDate(),
      },
    ];

    setUserMessages(sampleAIresponse);
  }, []);

  useEffect(() => {
    if (upperUserID != undefined) {
      EventRegister.emit('MsgReadListener', {data: {userID: upperUserID}});
    }

    EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_ASST);
  }, []);

  //   useEffect(() => {
  //     const userIndex = messageContext?.findIndex(user => user.userID == upperUserID);

  //     if (userIndex > -1) {
  //       setUserMessages(messageContext[userIndex].messages);
  //     } else if (userIndex < 0) {
  //       setUserMessages([]);
  //     }
  //   }, [messageContext]);

  NmHardwareBackPress(async () => {
    await NmSaveSetting(APP_KEYS.MESSAGE_SVD_DATA, messageContext);
    EventRegister.emit('UpdateHeaderTitle', 'Messaging');
    EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_MENU);
    props.navigation.goBack();
    return true;
  });

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' ? 80 : 0} behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} style={{flex: 1, width: '100%'}}>
        <FlatList
          inverted={true}
          ref={flatListRef}
          data={userMessages}
          renderItem={(item, index) => {
            return <MessageItem data={item} user={upperUserID} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{flexGrow: 1, width: '100%', paddingHorizontal: 8}}
          // --- Potential additions for better initial loading ---
          initialNumToRender={20} // Render all 20 messages immediately
          maxToRenderPerBatch={10} // Process in batches if more are loaded later
          windowSize={21} // Keep around 21 items in memory (current + 10 above/below)
        />

        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 6, paddingBottom: 12, paddingLeft: 8}}>
          <TextInput
            placeholder="Enter your message"
            placeholderTextColor={'#CCC'}
            multiline={true}
            style={[NmStyles.poppinsRegular, {flex: 1, width: '100%', backgroundColor: '#FFF', color: '#000', borderRadius: 12, maxHeight: 72, paddingHorizontal: 8, paddingVertical: 6}]}
            onChangeText={value => setInputText(value)}
            value={inputText}
          />
          <TouchableOpacity
            style={{padding: 4, paddingHorizontal: 8}}
            onPress={() => {
              let myUserID = recuser;
              myUserID = myUserID.toString().toUpperCase();

              if (inputText != '' && inputText != undefined) {
                (async () => {
                  let newMessage = {
                    userID: upperUserID,
                    userDesc: 'NOAH Assistant',
                    fromUser: false,
                    dateTime: new XDate(),
                    message: inputText,
                  };

                  EventRegister.emit('UpdateMessages', {data: newMessage});
                  setInputText('');

                  // Send Here
                })();

                (async () => {
                  await NmSaveSetting(APP_KEYS.MESSAGE_SVD_DATA, messageContext);
                })();
              }
            }}>
            <MaterialCommunityIcons style={{padding: 8, backgroundColor: '#FFF', borderRadius: 12}} name={'send-outline'} size={24} color={'#133561'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
});

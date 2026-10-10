import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Platform, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
//import {KeyboardAvoidingView} from 'react-native';

import {NmStyles} from '../../constants';
import {LoadingScreen} from '../../components';
import {NmHardwareBackPress} from '../../functions/NmFunctions';
import {AccountDetailsContext, NotificationsContext} from '../../functions/Contexts';
import {NmSendMessage, NmGetPublicKey} from '../../functions/NmNetwork';
import {NmRSAEncrypt} from '../../functions/NmCipher';
import MessageItem from './MessageItem';
import XDate from 'xdate';
import {ThemesContext} from '../../functions/ThemeContext';
import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'MessageThread'>;

interface UserMessage {
  userID: string;
  userDesc: string;
  fromUser: boolean;
  dateTime: any;
  message: string;
}

export default function MessageThread({navigation, route}: Props): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {recuser, setHeaderTitle} = useContext(AccountDetailsContext);
  const {chatMessages, updateChatList} = useContext(NotificationsContext);

  const {chatDetails} = route.params ?? {};

  const [loading, setLoading] = useState<boolean>(true);
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [userPubKey, setUserPubkey] = useState<string>();
  const [enableControls, setEnableControls] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');

  const flatListRef = useRef<FlatList<UserMessage> | null>(null);

  const chatDetailsVal = chatDetails;
  const upperUserID = chatDetails?.userID?.toString().toUpperCase();

  useEffect(() => {
    if (upperUserID != undefined) {
      EventRegister.emit('MsgReadListener', {data: {userID: upperUserID}});

      NmGetPublicKey(upperUserID).then(response => {
        //console.log('NmGetPublicKey', response.keyData.pubKey);
        setLoading(false);
        if (response.status == '200') {
          setUserPubkey(response.keyData.pubKey);
          setEnableControls(true);
        } else {
          // Show error then prevent message sending
        }
      });
    }
  }, []);

  useEffect(() => {
    const userIndex = chatMessages?.findIndex((user: any) => user.userID == upperUserID);

    if (userIndex > -1) {
      setUserMessages(chatMessages[userIndex].messages);
    } else if (userIndex < 0) {
      setUserMessages([]);
    }
  }, [chatMessages]);

  NmHardwareBackPress((): boolean => {
    setHeaderTitle('Messaging');
    navigation.goBack();
    return true;
  });

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' ? 84 : 0} behavior={'padding'} style={{flex: 1, width: '100%'}}>
        <FlatList
          inverted={true}
          ref={flatListRef}
          data={userMessages}
          renderItem={(item: any) => {
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
            editable={enableControls}
            placeholder="Enter your message"
            placeholderTextColor={'#b1b1b1'}
            multiline={true}
            style={[
              NmStyles.poppinsRegular,
              {flex: 1, width: '100%', backgroundColor: theme.chatListTextInput, color: theme.chatListTextInputText, borderRadius: 12, maxHeight: 72, paddingHorizontal: 8, paddingVertical: 6},
            ]}
            onChangeText={value => setInputText(value)}
            value={inputText}
          />
          <TouchableOpacity
            disabled={!enableControls}
            style={{padding: 4, paddingHorizontal: 8}}
            onPress={() => {
              let myUserID = recuser;
              let rcpUserId = chatDetailsVal?.userID;
              myUserID = myUserID.toString().toUpperCase();
              rcpUserId = rcpUserId?.toString().toUpperCase();

              if (inputText != '' && inputText != undefined) {
                (async () => {
                  const EncMessage = await NmRSAEncrypt(inputText, userPubKey ?? '');

                  let newMessage = {
                    userID: rcpUserId,
                    userDesc: chatDetailsVal?.userName?.toString().toUpperCase(),
                    fromUser: false,
                    dateTime: new XDate(),
                    message: inputText,
                  };

                  //EventRegister.emit('UpdateMessages', {data: newMessage});
                  updateChatList(newMessage);
                  setInputText('');
                  NmSendMessage({
                    msgSender: myUserID,
                    msgRecipt: rcpUserId,
                    message: EncMessage,
                  }).then(res => {
                    //console.log(res);
                  });
                })();
              }
            }}>
            <MaterialCommunityIcons style={{padding: 8, backgroundColor: theme.chatSendButton, borderRadius: 12}} name={'send-outline'} size={24} color={theme.chatListWriteIcon} />
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

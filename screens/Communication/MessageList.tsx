import {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {NmStyles} from '../../constants';
import {NmModal, LoadingScreen, NmLabel} from '../../components';
import {NmGetChatDate, NmGetChatTime, NmHardwareBackPress} from '../../functions/NmFunctions';

import {AccountDetailsContext, NotificationsContext} from '../../functions/Contexts';
import XDate from 'xdate';
import {ThemesContext} from '../../functions/ThemeContext';

interface Message {
  message: string;
  fromUser: boolean;
  dateTime: any;
}

interface MessageListItem {
  userID: string;
  userDesc: string;
  lastUpdate: any;
  readStatus?: boolean;
  messages: Message[];
}

interface SelectedUser {
  userID: string;
  userDesc: string;
}

interface MessageListProps {
  navigation: any;
}

const MessageList = (props: MessageListProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {chatMessages} = useContext(NotificationsContext);
  const {setHeaderTitle} = useContext(AccountDetailsContext);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [messagesList, setMessagesList] = useState<MessageListItem[]>([]);

  const [selectedUser, setSelectedUser] = useState<SelectedUser | string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (chatMessages?.length > 0) {
      let sortingData = [...chatMessages];
      sortingData.sort((a: any, b: any) => new XDate(b.lastUpdate) - new XDate(a.lastUpdate));
      setMessagesList(sortingData as MessageListItem[]);
    } else {
      setMessagesList([]);
    }
  }, [chatMessages]);

  NmHardwareBackPress();

  const renderMessageItem = ({item, index}: {item: MessageListItem; index: number}): React.JSX.Element => {
    let lastMessageData = item.messages[0];
    const message = lastMessageData.message;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          backgroundColor: theme.chatListItem,
          paddingHorizontal: 8,
          paddingVertical: 12,
          marginBottom: 2,
          overflow: 'hidden',
        }}
        onPress={() => {
          setHeaderTitle(item.userDesc);
          props.navigation.navigate('MessageThread', {userID: item.userID, userName: item.userDesc});
        }}
        onLongPress={() => {
          setSelectedUser({userID: item.userID, userDesc: item.userDesc});
          setModalVisible(true);
        }}>
        <View style={{padding: 5, borderRadius: 25, borderWidth: StyleSheet.hairlineWidth, borderColor: item?.readStatus ? '#AAA' : '#1974D1', alignItems: 'center', justifyContent: 'center'}}>
          <MaterialCommunityIcons name={'account'} color={item?.readStatus ? '#777' : '#1974D1'} size={30} />
        </View>
        <View style={{flex: 1, marginLeft: 18, overflow: 'hidden'}}>
          <NmLabel style={[item?.readStatus == true ? NmStyles.poppinsMedium : NmStyles.poppinsBold, {fontSize: 16}]} numberOfLines={1}>
            {item.userDesc}
          </NmLabel>
          <Text style={[item?.readStatus == true ? NmStyles.poppinsRegular : NmStyles.poppinsMedium, {color: '#AAA', fontSize: 14}]} numberOfLines={1}>
            {lastMessageData.fromUser ? message : 'You: ' + message}
          </Text>
        </View>
        <View style={{paddingHorizontal: 4, alignItems: 'center'}}>
          <Text style={[NmStyles.poppinsRegular, {color: '#AAA', fontSize: 14}]}>{NmGetChatDate(lastMessageData.dateTime)}</Text>
          <Text style={[NmStyles.poppinsRegular, {color: '#AAA', fontSize: 14}]}>{NmGetChatTime(lastMessageData.dateTime)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  function resetModal(): void {
    setSelectedUser('');
    setModalVisible(false);
  }

  function deleteMessageThread(): void {
    const userID = (selectedUser as SelectedUser).userID;
    EventRegister.emit('DeleteMsgListener', userID);
    resetModal();
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.chatListBackground}]}>
      {loading && <LoadingScreen />}
      <NmModal
        winVisible={modalVisible}
        setWinVisible={setModalVisible}
        title={'Confirm Action'}
        containerStyle={{width: '80%'}}
        modalType={'WIN_QUESTION'}
        YesTitle={'Ok'}
        NoTitle={'Cancel'}
        onClickYes={() => {
          deleteMessageThread();
        }}
        onClickNo={resetModal}
        onClickClose={resetModal}
        onBackdropPress={resetModal}
        message={'Delete conversation with ' + (selectedUser as SelectedUser).userDesc + '?'}></NmModal>

      <View style={{flex: 1, backgroundColor: theme.chatListBackground, width: '100%'}}>
        <FlatList data={messagesList} renderItem={renderMessageItem} keyExtractor={(item, index) => index.toString()} style={{width: '100%'}} />
      </View>

      <TouchableOpacity
        style={[styles.floatingAIButton, {backgroundColor: theme.chatListFloatingBtn}]}
        onPress={() => {
          props.navigation.navigate('WebWatsonx');
          //props.navigation.navigate('AssistantScreen');
        }}
        activeOpacity={0.7}>
        <Image source={require('../../assets/Icons/assistant2.png')} style={{width: 30, height: 30, marginLeft: 1}} />
        {/* <MaterialCommunityIcons name={'artstation'} color={'#133561'} size={20} /> */}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.floatingButton, {backgroundColor: theme.chatListFloatingBtn}]}
        onPress={() => {
          props.navigation.navigate('ContactSearch');
        }}
        activeOpacity={0.7} // Controls the opacity when the button is pressed
      >
        <MaterialCommunityIcons style={{marginTop: -2}} name={'pencil'} color={theme.chatListWriteIcon} size={24} />
        <NmLabel style={[NmStyles.poppinsMedium, {marginLeft: 8, fontSize: 13}]}>{'New Chat'}</NmLabel>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  floatingButton: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    position: 'absolute',
    bottom: 20,
    right: 18,
    backgroundColor: '#F7F7F7',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  floatingAIButton: {
    position: 'absolute',
    bottom: 90,
    right: 18,
    backgroundColor: '#F7F7F7',
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default MessageList;

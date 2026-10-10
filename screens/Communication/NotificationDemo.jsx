import {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {NmButton, NmLabel, NmTextInput, LoadingScreen} from '../../components';
import {NmNullOrEmpty, NmGetDate, NmGetSetting, NmHardwareBackPress} from '../../functions/NmFunctions';
import {NmSendDemoNotif} from '../../functions/NmNetwork';
import {APP_KEYS} from '../../constants';

export default function NotificationDemo(props) {
  const [loading, setLoading] = useState(false);
  const [error, showError] = useState(false);

  const [notifRecipient, setNotifRecipient] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  NmHardwareBackPress();

  async function sendNotification() {
    if (NmNullOrEmpty([notifRecipient, notifTitle, notifMessage])) {
      showError(true);
      setTimeout(() => {
        showError(false);
      }, 5000);
    } else {
      setLoading(true);
      const logUser = await NmGetSetting(APP_KEYS.ACCESS_USER);

      const notifData = {
        NotifID: NmGetDate(),
        NotifSender: logUser,
        NotifTitle: notifTitle,
        NotifMessage: notifMessage,
        NotifRecipient: notifRecipient,
      };

      NmSendDemoNotif(JSON.stringify(notifData)).then(res => {
        setLoading(false);
      });
    }
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <NmLabel>{'Recipient (Username)'}</NmLabel>
        <NmTextInput value={notifRecipient} onChangeText={setNotifRecipient} containerStyle={{marginBottom: 10}} maxLength={20} />

        <NmLabel>{'Title'}</NmLabel>
        <NmTextInput value={notifTitle} onChangeText={setNotifTitle} containerStyle={{marginBottom: 10}} maxLength={50} />

        <NmLabel>{'Message'}</NmLabel>
        <NmTextInput value={notifMessage} onChangeText={setNotifMessage} containerStyle={{marginBottom: 14, minHeight: 60, height: undefined}} maxLength={120} multiline={true} numberOfLines={3} />

        <NmButton title={'Send'} onPress={sendNotification} />
        {error && <NmLabel style={{color: 'red', alignSelf: 'center', marginTop: 6}}>{'Please complete all fields'}</NmLabel>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 12,
    backgroundColor: '#FFF',
  },
});

import React, {Component, useState} from 'react';
import {TextInput, StyleSheet, Text, View, TouchableOpacity, Alert, Button} from 'react-native';

import PushNotification from 'react-native-push-notification';
import {Config} from '../app.config';

const NotificationScreen = props => {
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const sendNotif = (title, message) => {
    var msgObj = {
      playSound: true,
      channelId: Config.APP_NAME + '_NM',
      title: title,
      message: message,
      importance: 'high',
      soundName: 'default',
    };

    //PushNotification.localNotification(msgObj);
  };

  const sendScheduledNotif = (title, message) => {
    var msgObj = {
      channelId: Config.APP_NAME + '_NM',
      date: new Date(Date.now() + 10 * 1000),
      allowWhileIdle: false,
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
    };

    //PushNotification.localNotificationSchedule(msgObj);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.topMargin]}>Title</Text>
      <TextInput style={[styles.input]} onChangeText={value => setNotifTitle(value)} value={notifTitle} />
      <Text style={styles.text}>Message</Text>
      <TextInput style={[styles.input, {marginBottom: 30}]} onChangeText={value => setNotifMessage(value)} value={notifMessage} />
      <Button title="Send Test Notification" onPress={() => sendNotif(notifTitle, notifMessage)}></Button>
      <Button title="Send Scheduled (10 Secs)" onPress={() => sendScheduledNotif(notifTitle, notifMessage)}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00425A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '900',
    fontSize: 14,
    color: '#FFF',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    color: '#000',
    padding: 10,
    width: '90%',
    backgroundColor: '#FFF',
  },
  topMargin: {
    marginTop: 50,
  },
});

export default NotificationScreen;

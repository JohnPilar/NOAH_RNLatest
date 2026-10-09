import React, {useContext, useEffect} from 'react';
import {getMessaging} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType, Notification} from '@notifee/react-native';
import {ToastAndroid} from 'react-native';

import {PermissionsAndroid, Platform} from 'react-native';
import {APP_CONST, APP_KEYS} from '../constants';
import {NmExecButtonSP} from './NmNetwork';
import {AppConfigContext, NotificationsContext, NotificationsProvider} from './Contexts';
import {NmGetSetting, NmGetDate, NmNullOrEmpty, NmSaveSetting} from './NmFunctions';
import {NmRSADecrypt} from './NmCipher';
import {getCurrentRouteName, getCurrentRouteParams} from '../navigation/NavigationRef';
import Sound from 'react-native-sound';
import {StackActions} from '@react-navigation/native';
import {Config} from '../app.config';
import {AuthorizationStatus} from '@notifee/react-native';

var XDate = require('xdate');

const NotificationService: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {setEnableNotification} = useContext(AppConfigContext);
  const {setChatMessages, setNotificationsList, setCurrentNotification} = useContext(NotificationsContext);

  useEffect(() => {
    if (Config.APP_ENABLE_NOTIFICATION === true) {
      const setup = async () => {
        await requestPermission();
        await createChannels();

        const initial = await notifee.getInitialNotification();
        if (initial) {
          // Called ONLY ONCE upon opening the app via clicking a notification
          setCurrentNotification(initial);
        }
      };

      setup();

      // Listener for Foreground messages
      const unsubscribeFCM = getMessaging().onMessage(async remoteMessage => {
        if (remoteMessage?.data?.NotifType == APP_CONST.NOTIF_TYPE_CHAT) {
          const newMessages = await NmUpdateMessages({newData: remoteMessage?.data, returnData: true});

          setChatMessages(newMessages ?? []);
          NmDisplayNotification({remoteMessage: remoteMessage});
        } else {
          const newNotifications = await NmUpdateNotifications(remoteMessage.data, true);

          setNotificationsList(newNotifications);
          NmDisplayNotification({remoteMessage: remoteMessage});
        }
      });

      // // Listener for Foreground interactions (clicks)
      const unsubscribeNotifee = notifee.onForegroundEvent(async ({type, detail}) => {
        const {notification, pressAction} = detail;

        // Functions here can include background processes AND UI rendering
        if (type === EventType.ACTION_PRESS) {
          switch (pressAction?.id) {
            case 'btnPositive':
              NmExecButtonSP(notification?.id, pressAction.id).then(result => {
                if (Platform.OS == 'android') {
                  if (result.status == '200') {
                    ToastAndroid.show('Request Approved.', ToastAndroid.SHORT);
                  }
                }
              });
              break;
            case 'btnNegative':
              NmExecButtonSP(notification?.id, pressAction.id).then(result => {
                if (Platform.OS == 'android') {
                  if (result.status == '200') {
                    ToastAndroid.show('Request Denied.', ToastAndroid.SHORT);
                  }
                }
              });
              break;
            case 'btnDefault':
              break;
            case 'NtDismiss':
              await notifee.cancelNotification(notification?.data?.NotifID as string);
              break;
          }
        } else if (type === EventType.PRESS) {
          if (pressAction?.id == 'NmDefault') {
            await NmSaveSetting(APP_KEYS.NOTIF_ACTION_CLICK, {id: pressAction.id, data: notification?.data});
          }
        }
      });

      return () => {
        unsubscribeFCM();
        unsubscribeNotifee();
      };
    }
  }, [Config.APP_ENABLE_NOTIFICATION]);

  const requestPermission = async () => {
    let result = false;
    const notificationSetting = await NmGetSetting(APP_KEYS.SETT_PUSHNOTIF);

    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          result = true;
        } else {
          result = false;
        }
      } catch (e) {
        console.log(e);
        result = false;
      }
    } else if (Platform.OS == 'ios') {
      const authStatus = await getMessaging().requestPermission();
      const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        result = false;
      } else {
        result = false;
      }
    }

    if (notificationSetting == undefined) {
      await NmSaveSetting(APP_KEYS.SETT_PUSHNOTIF, result);
      setEnableNotification(result);
    }
  };

  const createChannels = async () => {
    await notifee.createChannelGroup({
      id: 'noah_notific_group',
      name: 'Notifications',
    });

    await notifee.createChannels([
      {
        id: APP_CONST.NOTIF_ID_CHATS,
        groupId: 'noah_notific_group',
        name: 'Chat Notifications',
        description: 'Messaging notification settings',
        importance: AndroidImportance.HIGH,
        vibration: true,
      },
      {
        id: APP_CONST.NOTIF_ID_DEFAULT,
        groupId: 'noah_notific_group',
        sound: 'notifstandard',
        name: 'Default Notifications',
        description: 'General notification settings',
        importance: AndroidImportance.HIGH,
        vibration: true,
      },
    ]);
  };

  return <>{children}</>;
};

export async function NmDisplayNotification({remoteMessage, chlID}: {remoteMessage: any; chlID?: string}) {
  const message = remoteMessage;
  const channelID = chlID || GetChannelID(message.data.NotifType);
  const messageBody = await GetMessageBody(message);
  const notifButtons = GetButtons(message);
  const pressActions = GetPressActions(message);

  const config = {
    id: message.data.NotifID, //Always pass an I.D to update a notification
    title: message.data.NotifTitle,
    body: messageBody,
    data: message.data,
    android: {
      channelId: channelID,
      smallIcon: 'notif_small_icon',
      color: '#28396f', // optional, defaults to 'ic_launcher'.
      ...(notifButtons
        ? {
            actions: notifButtons,
            pressAction: {
              id: 'NmDefault',
            },
          }
        : {...pressActions}),
    },
    ios: {
      // Add later during development
      // iOS resource (.wav, aiff, .caf)
      // sound: 'local.wav',
    },
  } as Notification;

  PlaySound(message.data.NotifType);

  // Chat-specific UI overrides
  // if (type == APP_CONST.NOTIF_TYPE_CHAT) {
  //   config.android.largeIcon = data?.senderAvatar;
  //   config.android.importance = AndroidImportance.HIGH;
  // }

  try {
    await notifee.displayNotification(config);
  } catch (error) {
    console.log('NOTIFEE', error);
  }
}

async function GetMessageBody(remoteMessage: any) {
  let encryptedMsg = remoteMessage.data.NotifMessage;
  let finalMessage = '';

  if (remoteMessage.data?.NotifType == APP_CONST.NOTIF_TYPE_CHAT) {
    encryptedMsg = encryptedMsg.trim();
    finalMessage = await NmRSADecrypt(encryptedMsg);
  } else {
    finalMessage = remoteMessage.data.NotifMessage;
  }

  return finalMessage;
}

const GetButtons = (remoteMessage: any) => {
  let buttonData = remoteMessage.data.NotifButtons;
  let notificationButtons = {} as Array<object>;
  try {
    notificationButtons = JSON.parse(buttonData);

    notificationButtons.forEach((obj: any) => {
      if (obj.pressAction.id == 'btnDefault') {
        obj.pressAction.mainComponent = 'NOAH';
      }
    });
  } catch (e: any) {
    console.log(e.toString());
  }

  if (Object.keys(notificationButtons).length <= 0) {
    return false;
  } else {
    return notificationButtons;
  }
};

const GetChannelID = (type: string) => {
  switch (type) {
    case APP_CONST.NOTIF_TYPE_CHAT:
      return APP_CONST.NOTIF_ID_CHATS;
    default:
      return APP_CONST.NOTIF_ID_DEFAULT;
  }
};

const GetPressActions = (remoteMessage: any) => {
  if (remoteMessage.data.NotifScreen != '' || remoteMessage.data.NotifLink != '') {
    return {
      pressAction: {
        id: 'NmDefault',
        mainComponent: 'NOAH',
      },
    };
  } else {
    return {
      actions: [
        {
          title: 'Dismiss',
          pressAction: {id: 'NtDismiss'},
        },
      ],
      pressAction: {
        id: 'NmDismiss',
      },
    };
  }
};

const PlaySound = (type = undefined) => {
  if (type == APP_CONST.NOTIF_TYPE_CHAT) {
    const alert = new Sound('notifchat.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }

      if (Platform.OS === 'android') {
        alert.setSpeed(1);
        Sound.setCategory('Alarm');
        alert.setVolume(1);
      }

      alert.play(success => {
        if (success) {
          alert.release(); // Free up memory
        }
      });
    });
  }
};

export async function NmUpdateNotifications(newData: {[key: string]: string | object} | undefined, returnData: boolean = false) {
  let tempNotificationsList = await NmGetSetting(APP_KEYS.MESSAGE_NOTIF_DATA);

  tempNotificationsList.unshift({
    ReferenceID: newData?.NotifID,
    Recdate: NmGetDate(undefined, 'isoTDateTime'),
    Read: 0,
    NotifType: '',
    AccountNo: '',
    Title: newData?.NotifTitle,
    Message: newData?.NotifMessage,
  });

  await NmSaveSetting(APP_KEYS.MESSAGE_NOTIF_DATA, tempNotificationsList);

  if (returnData == true) {
    return tempNotificationsList;
  }
}

export async function NmUpdateMessages({newData, returnData = false, fromUser = false}: {newData: Record<string, any>; returnData?: boolean; fromUser?: boolean}) {
  let savedMessages = (await NmGetSetting(APP_KEYS.MESSAGE_CHAT_DATA)) || [];
  let CurrentUser = (await NmGetSetting(APP_KEYS.ACCESS_USER)) || '';
  CurrentUser = CurrentUser.toString().toUpperCase().trim();

  const notifSenderID = newData.NotifSenderID;
  const notifSender = newData.NotifTitle;
  const notifMessage = await NmRSADecrypt(newData.NotifMessage);

  const CurrentScreen = getCurrentRouteName();
  const CurrentScreenParams = getCurrentRouteParams() as any;
  const sameScreen = CurrentScreen == 'MessageThread' && notifSenderID.toString().toUpperCase().trim() == CurrentScreenParams?.userID.toString().toUpperCase().trim();

  let savedChatData = [...savedMessages];
  let userIndex = savedChatData.findIndex(convo => convo.userID == notifSenderID);
  if (userIndex > -1) {
    // Already have previous conversation
    let userMessages = savedChatData[userIndex].messages;
    userMessages.unshift({
      fromUser: fromUser,
      dateTime: new XDate(),
      message: notifMessage, //NmBasicDecrypt(notifMessage, CurrentUser),
    });
    savedChatData[userIndex].lastUpdate = new XDate();
    savedChatData[userIndex].readStatus = sameScreen;
    savedChatData[userIndex].messages = userMessages;
    await NmSaveSetting(APP_KEYS.MESSAGE_CHAT_DATA, savedChatData);
  } else {
    // New user conversation
    savedChatData.unshift({
      userID: notifSenderID,
      userDesc: notifSender,
      lastUpdate: new XDate(),
      readStatus: false,
      messages: [
        {
          fromUser: fromUser,
          dateTime: new XDate(),
          message: notifMessage, //NmBasicDecrypt(notifMessage, CurrentUser),
        },
      ],
    });
    await NmSaveSetting(APP_KEYS.MESSAGE_CHAT_DATA, savedChatData);
  }

  if (returnData == true) {
    return savedChatData;
  }
}

export async function NmHomeDrawerNavigate({
  navProps,
  notificationData,
  routeParams,
  screenName,
  setHeaderTitle,
  navigation,
}: {
  navProps?: any;
  notificationData: any;
  routeParams?: any;
  screenName?: string;
  setHeaderTitle?: any;
  navigation?: any;
}) {
  if (notificationData != undefined) {
    if (notificationData?.NotifType == APP_CONST.NOTIF_TYPE_CHAT) {
      // From home page screen to specific user message thread screen
      if (notificationData?.NotifScreen == 'ChatScreen' && typeof routeParams === 'undefined') {
        navigation.navigate('MessageList');
        navigation.dispatch(StackActions.push('MessageThread', {userID: notificationData.NotifSenderID, userName: notificationData.NotifTitle, fromNotification: true}));
        setHeaderTitle(notificationData?.NotifTitle);
        return;
      }

      if (screenName == 'MessageList') {
        // When in the message list screen, navigate to specific user message thread screen
        navProps.dispatch(StackActions.push('MessageThread', {userID: notificationData.NotifSenderID, userName: notificationData.NotifTitle, fromNotification: true}));
        setHeaderTitle(notificationData?.NotifTitle);
      } else if (screenName == 'MessageThread' && routeParams?.userID != notificationData?.NotifSenderID) {
        // When in another user message thread screen, navigate to other specific user message thread screen
        navProps.dispatch(StackActions.replace('MessageThread', {userID: notificationData.NotifSenderID, userName: notificationData.NotifTitle, fromNotification: true}));
        setHeaderTitle(notificationData?.NotifTitle);
      } else {
        // When in other screens except in home page (handled by the first if statement)
        navProps.reset({
          index: 1, // The index of the active route in the routes array
          routes: [
            {name: 'Home'},
            {name: 'MessageList'},
            {name: 'MessageThread', params: {userID: notificationData.NotifSenderID, userName: notificationData.NotifTitle, fromNotification: true}}, // Route at index 1 (this will be the active route)
          ],
        });
        setHeaderTitle(notificationData?.NotifTitle);
      }
    } else if (notificationData?.NotifType == 'NOAH_NOTIF_TEST') {
      // For developer testing only
    } else if (notificationData?.NotifType == undefined) {
      await notifee.cancelNotification(notificationData.NotifID);

      const screenName2 = notificationData?.NotifScreen;
      let webLink = notificationData?.NotifLink;

      if (!NmNullOrEmpty([webLink])) {
        // For now, everylink is non standard, need to add additional notification data to handle standard noah links
        let linkParams;
        try {
          linkParams = JSON.parse(notificationData?.NotifParams) || {linkparams: ''};
          linkParams = linkParams.linkparams;
        } catch (e) {
          linkParams = '';
        }

        try {
          if (!NmNullOrEmpty(linkParams)) {
            webLink = webLink.endsWith('?') ? webLink : webLink + '?';
            Object.keys(linkParams).forEach(key => {
              webLink = webLink + key + '=' + linkParams[key] + '&';
            });
          }

          navProps.navigate('WebViewerHome', {
            webLink: webLink, // NOAH links should handled by link: webLink
            otherLink: true, // NOAH links are otherLink: false or undefined
            newPage: true,
          });
        } catch (e) {}
        return;
      }

      if (!NmNullOrEmpty([screenName2])) {
        try {
          navProps.navigation.navigate(screenName2); // Screen name should come from the table setup for menu item list
        } catch (e) {}
        return;
      }
    }
  }
}

const NotificationController: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <NotificationsProvider>
      <NotificationService>{children}</NotificationService>
    </NotificationsProvider>
  );
};

export default NotificationController;

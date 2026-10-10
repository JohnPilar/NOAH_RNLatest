/**
 * @format
 */
import {useContext} from 'react';
import {AppRegistry, Platform, ToastAndroid} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {APP_CONST, APP_KEYS} from './constants';
import {NmSaveSetting} from './functions/NmFunctions';

//import {NmShowNotification, NmUpdateMessages} from './functions/NmFunctions';
import {NmDisplayNotification, NmUpdateNotifications, NmUpdateMessages} from './functions/NmNotifications';
import {NmExecButtonSP} from './functions/NmNetwork';
import App from './App';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered', // react-navigation knowm bug
]);

LogBox.ignoreLogs([
  'Open debugger to view warnings', // react-navigation knowm bug
]);

LogBox.ignoreLogs([
  'Called stopObserving', // react-navigation knowm bug
]);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage?.data?.NotifType == APP_CONST.NOTIF_TYPE_CHAT) {
    // Updates saved chat messages in secured storage (Works on QUIT and BACKGROUND app states)
    await NmUpdateMessages({newData: remoteMessage.data});
  } else {
    // Default notifications (Add condition for other types above)
    await NmUpdateNotifications(remoteMessage.data);
  }

  NmDisplayNotification({remoteMessage: remoteMessage});
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Functions here should only contain background processes and no UI rendering
  if (type === EventType.ACTION_PRESS) {
    switch (pressAction.id) {
      case 'btnPositive':
        NmExecButtonSP(notification.id, pressAction.id).then(result => {
          if (Platform.OS == 'android') {
            if (result.status == '200') {
              ToastAndroid.show('Request Approved.', ToastAndroid.SHORT);
            }
          }
        });
        break;
      case 'btnNegative':
        NmExecButtonSP(notification.id, pressAction.id).then(result => {
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
        await notifee.cancelNotification(notification.data.NotifID);
        break;
    }
  } else if (type === EventType.PRESS) {
    if (pressAction.id == 'NmDefault') {
      await NmSaveSetting(APP_KEYS.NOTIF_ACTION_CLICK, {id: pressAction.id, data: notification?.data});
    }
  }
});

// For iOS notification buttons
// await notifee.setNotificationCategories([
//   {
//     id: 'message_actions',
//     actions: [
//       {
//         id: 'accept',
//         title: 'Accept',
//         // iOS specific: foreground: true opens the app, false stays in background
//         foreground: false,
//       },
//       {
//         id: 'decline',
//         title: 'Decline',
//         destructive: true, // Makes the text red on iOS
//       },
//     ],
//   },
// ]);

AppRegistry.registerComponent(appName, () => App);

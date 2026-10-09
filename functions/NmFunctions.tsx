let RNFS = require('react-native-fs');
import {Platform, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {APP_KEYS, APP_CONST, TableInputConfig, NmComponentType, APP_ENDPOINT_CONFIGS} from '../constants/NmConstants.js';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';
import * as Location from 'expo-location';
import {useWindowDimensions} from 'react-native';

import {
  NmValidateAccountNo,
  NmGetMobileAssets,
  NmGetUserDetails,
  NmRecordLogin,
  NmGetPublicIP,
  NmGetEstLocation,
  NmGetUserApprovals,
  NmGetNotifications,
  NmStoreUserToken,
  NmStorePublicKey,
  NmGrantMultiAccess,
  NmGetEndpointsList,
} from './NmNetwork.tsx';

import {ConfigItem} from '../constructs/interfaces/NmFunctionsInterface.tsx';

import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {pick, types} from '@react-native-documents/picker';
import {FileTypes} from '../constants/NmConstants.js';
import DeviceInfo from 'react-native-device-info';
import {EventRegister} from 'react-native-event-listeners';
import {fetch} from '@react-native-community/netinfo';
import notifee, {AndroidImportance} from '@notifee/react-native';
import ClearCache from '@type-any/react-native-clear-cache';
import {getMessaging} from '@react-native-firebase/messaging';
import {RSAKeychain} from 'react-native-rsa-native';
var XDate = require('xdate');

import {NmRSADecrypt} from './NmCipher.tsx';
import {getEndpointDetails} from './NmEndpoint.tsx';
import {ConfigDetails, SetConfig, NOAHConfig} from './NmAppConfig.tsx';

const AppConfig = ConfigDetails();

interface ApiResponse extends Record<string, unknown> {
  status: string | number;
}

//======================================================================//
//=========================  STRING FUNCTIONS ==========================//
//======================================================================//

export const NmNavigateTo = (location: never, props: any) => {
  props.navigation.navigate(location);
};

export function NmTitleCase(str: string) {
  let removeSpaces = str.replace(/\s+/g, ' ').trim();

  return removeSpaces.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function NmStringUCaseTrim(value?: string) {
  try {
    return value == undefined ? undefined : value.toString().toUpperCase().trim();
  } catch {
    return undefined;
  }
}

export const NmCreateWebToken = (token?: string) => {
  if (token != undefined) {
    let tmpSplit = token.split('+');
    let tmpJoin = tmpSplit.join('AAGxAAG');
    return tmpJoin;
  }
  return '';
};

export const NmCreateLocalToken = (token: string) => {
  let tmpSplit = token.toString().split('AAGxAAG');
  let tmpJoin = tmpSplit.join('+');
  return tmpJoin;
};

export const NmReplaceAll = (text: string, valueToReplace: string, replaceWith: string) => {
  try {
    let tmpSplit = text.split(valueToReplace);
    let tmpJoin = tmpSplit.join(replaceWith);
    return tmpJoin;
  } catch (error) {
    return 'ERROR REPLACE ALL';
  }
};

export const NmCheckEmailFormat = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  } else {
    return false;
  }
};

export function NmPasswordCriteriaCheck(Password: string) {
  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var checkCtr = 0;

  checkCtr = /\d/.test(Password) ? (checkCtr += 1) : checkCtr;
  checkCtr = /[A-Z]/.test(Password) ? (checkCtr += 1) : checkCtr;
  checkCtr = /[a-z]/.test(Password) ? (checkCtr += 1) : checkCtr;
  checkCtr = format.test(Password) ? (checkCtr += 1) : checkCtr;

  return checkCtr < 4 ? false : true;
}

export async function NmPasswordCheck(Password: string, ConfirmPassword: string, PasswordLength: number) {
  if (Password === '' || ConfirmPassword === '') {
    return 'Error: Please complete all fields!';
  }

  if (Password.length < PasswordLength || ConfirmPassword.length < PasswordLength) {
    return 'Error: Minimum password length is 8 characters';
  }

  if (Password !== ConfirmPassword) {
    return 'Error: Passwords do not match!';
  }

  if (Password === ConfirmPassword) {
    if (NmPasswordCriteriaCheck(Password)) {
      return true;
    } else {
      return 'Error: Password does not match our criteria. Please view the help tip for more information.';
    }
  }
}

export function NmGetLoginTime() {
  return NmGetDate(undefined, 'customFormat', 'MM/dd/yyyy • hh:mm a');
}

export function NmGetCurrencyFormat(value: any, currency?: string, decimals?: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
  });

  return formatter.format(value);
}

export function NmNullOrEmpty(items: Array<any>) {
  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      if (items[i] == undefined || items[i] == '' || !items[i]) {
        return true;
      }
    }
    return false;
  }
  return false;
}

export const NmGetNotifAbbreviation = (notifType: string) => {
  try {
    if (NmHasWhiteSpace(notifType)) {
      let tmp = notifType.split(' ');
      return tmp[0].substr(0, 1).toUpperCase() + tmp[1].substr(0, 1).toUpperCase();
    } else {
      return notifType.substr(0, 2).toUpperCase();
    }
  } catch (e) {
    return '';
  }
};

export function NmHasWhiteSpace(s: string) {
  return s.indexOf(' ') >= 0;
}

//======================================================================//
//==========================  DATE FUNCTIONS ===========================//
//======================================================================//

type StampFormat = 'full' | 'dateOnly' | 'timeOnly' | 'fullNoMs' | 'customFormat' | 'isoDateTime' | 'isoTDateTime' | 'slashMDY' | 'dashYMD';

export const NmGetDate = (date?: Date, format: StampFormat = 'full', formatPattern: string = 'MMddyyyyHHmmssSSS', dayAdjust?: number): string => {
  let now = date ?? new Date();

  if (dayAdjust) {
    now.setDate(now.getDate() + dayAdjust); // Add or subtract days
  }

  const pad = (num: number, size: number = 2) => String(num).padStart(size, '0');

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 || 12; // Converts 0 to 12
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const tokens: Record<string, string> = {
    MM: pad(now.getMonth() + 1),
    dd: pad(now.getDate()),
    yyyy: String(now.getFullYear()),
    HH: pad(hours24), // 24-hour format
    hh: pad(hours12),
    mm: pad(now.getMinutes()),
    ss: pad(now.getSeconds()),
    SSS: pad(now.getMilliseconds(), 3),
    a: ampm,
  };

  let fullFormat: string;
  switch (format) {
    case 'dateOnly':
      fullFormat = 'yyyyMMdd';
      break;
    case 'timeOnly':
      fullFormat = 'HHmmssSSS';
      break;
    case 'fullNoMs':
      fullFormat = 'yyyyMMddHHmmss';
      break;
    case 'isoDateTime':
      fullFormat = 'yyyy-MM-dd HH:mm:ss.SSS';
      break;
    case 'isoTDateTime':
      fullFormat = 'yyyy-MM-ddTHH:mm:ss.SSS';
      break;
    case 'slashMDY':
      fullFormat = 'MM/dd/yyyy';
      break;
    case 'dashYMD':
      fullFormat = 'yyyy-MM-dd';
      break;
    case 'customFormat':
    default:
      fullFormat = formatPattern;
      break;
  }

  let result = fullFormat;
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    const regex = new RegExp(token, 'g');
    result = result.replace(regex, tokens[token]);
  }

  return result;
};

export const NmGetDayOfWeek = (DayOfWeek: number, isLong?: boolean) => {
  const daysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return isLong == true ? daysLong[DayOfWeek] : daysShort[DayOfWeek];
};

export const NmGetMonthName = (monthIndex: number, isLong?: boolean) => {
  const longName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return isLong == true ? longName[monthIndex] : shortName[monthIndex];
};

export const NmGetNotifTime = (notifTime: string) => {
  var today = new Date();
  var month = today.getMonth();

  let RecDate = new Date(notifTime);
  let DateNow = new Date();

  const secs = Math.floor(Math.abs(DateNow.getTime() - RecDate.getTime()) / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (secs < 60) return 'Just now.';

  if (mins < 60) {
    return mins == 1 ? mins + ' minute ago' : mins + ' minutes ago';
  }

  if (hours < 24) {
    if (RecDate.getDate() + 1 == DateNow.getDate()) {
      return 'Yesterday at ' + NmGetDate(RecDate, 'customFormat', 'hh:mm a');
      //return 'Yesterday at ' + RecDate.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'});
    } else {
      return hours == 1 ? hours + ' hour ago' : hours + ' hours ago';
    }
  }

  if (NmDateInThisWeek(RecDate)) {
    return NmGetDayOfWeek(RecDate.getDay(), false) + ', at ' + NmGetDate(RecDate, 'customFormat', 'hh:mm a');
    //return RecDate.toLocaleDateString('en-us', {weekday: 'short'}).toString().split(',')[0] + ' at ' + RecDate.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'});
  } else {
    if (today.getFullYear() == RecDate.getFullYear()) {
      return NmGetMonthName(RecDate.getMonth(), false) + ' ' + RecDate.getDate() + ' at ' + NmGetDate(RecDate, 'customFormat', 'hh:mm a');
    } else {
      return NmGetMonthName(RecDate.getMonth(), false) + ' ' + RecDate.getDate() + ', ' + RecDate.getFullYear() + ' at ' + NmGetDate(RecDate, 'customFormat', 'hh:mm a');
    }
    //return RecDate.toLocaleDateString('en-us', {month: 'short', day: 'numeric'}) + ' at ' + RecDate.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'});
  }
};

export function NmDateInThisWeek(date: Date) {
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

export const NmGetSchedString = (date: any) => {
  const tmpDate = new Date(date);
  const dateSplit = date.split('-');

  return NmGetDayOfWeek(tmpDate.getDay(), true) + ', ' + NmGetMonthName(tmpDate.getMonth(), false) + ' ' + dateSplit[2] + ', ' + dateSplit[0];
};

export const NmTicketDate = (dateNow: Date) => {
  const tmpDate = dateNow;

  let day = (tmpDate.getDate() + 1 + '').length < 2 ? '0' + tmpDate.getDate() : tmpDate.getDate();

  return NmGetMonthName(tmpDate.getMonth(), false)
    .concat(' ' + day)
    .concat(', ' + tmpDate.getFullYear());
};

export const NmCheckSchedule = (fromDate: Date, toDate: Date) => {
  const fromHR = fromDate.getHours();
  const fromMins = fromDate.getMinutes();
  const toHR = toDate.getHours();
  const toMins = toDate.getMinutes();

  if (fromHR > toHR) {
    return 3;
  }

  if (fromHR == toHR) {
    if (fromMins >= toMins) {
      return 2;
    } else {
      return 1;
    }
  } else {
    return 1;
  }
};

export const NmGetTimeDifference = (fromDate: Date, toDate: Date) => {
  const fromHR = fromDate.getHours();
  const fromMins = fromDate.getMinutes();
  const toHR = toDate.getHours();
  const toMins = toDate.getMinutes();

  let tmpHrs = toHR - fromHR;
  let tmpMins = fromMins > toMins ? fromMins - toMins : toMins - fromMins;

  if (fromMins > toMins) {
    tmpHrs -= 1;
    tmpMins = 60 - tmpMins;
  }

  return {hr: tmpHrs, min: tmpMins};
};

export const NmGetTimeGreeting = (currentTime = undefined) => {
  let time = currentTime || new XDate();
  let textGreeting = 'Good Day';
  try {
    const HourTime = parseInt(new XDate(time).toString('HH'));
    if (HourTime >= 0 && HourTime < 12) {
      textGreeting = 'Good Morning';
    } else if (HourTime >= 12 && HourTime < 18) {
      textGreeting = 'Good Afternoon';
    } else if (HourTime >= 18 && HourTime <= 23) {
      textGreeting = 'Good Evening';
    }
  } catch (e) {}
  return textGreeting;
};

export const NmGetMeetingTitle = (date: Date) => {
  let textGreeting = new XDate(date).toString('dddd, MMM dd');
  try {
    const todayDate = new XDate();
    const recordDate = new XDate(date);
    const dateDiff = Math.round(todayDate.diffDays(recordDate));

    if (dateDiff == 0) {
      textGreeting = 'Today, ' + new XDate(date).toString('MMM dd');
    } else if (dateDiff == 1) {
      textGreeting = 'Tomorrow, ' + new XDate(date).toString('MMM dd');
    }
  } catch (e) {}
  return textGreeting;
};

export const NmGetMeetingDuration = (fromTime: any, toTime: any) => {
  let textGreeting;
  try {
    let diffHours = Math.floor(fromTime.diffHours(toTime));
    let diffMins = Math.floor(fromTime.diffMinutes(toTime));

    return {hrs: diffHours, mins: diffMins};
  } catch (e) {}
  return textGreeting;
};

export const NmGetTimeStamp = () => {
  return new XDate().toString('ddMMyyHHmmssfff');
};

//======================================================================//
//=======================  COMPONENT FUNCTIONS =========================//
//======================================================================//

export function useDeviceOrientation() {
  const {width, height} = useWindowDimensions();

  const isLandscape = width > height;

  return isLandscape ? 'landscape' : 'portrait';
}

export const NmHardwareBackPress = (callback?: () => boolean) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS == 'android') {
        const onBackPress = () => {
          if (callback) return callback();
          navigation.goBack();
          return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
      }

      // iOS: Swipe-to-back is handled automatically by the Stack Navigator
      return undefined;
    }, [callback, navigation]),
  );
};

export const NmLowercaseKeys = (data: any) => {
  if (!data) return data;

  try {
    if (Array.isArray(data)) {
      return data.map(item => Object.fromEntries(Object.entries(item).map(([key, val]) => [key.toLowerCase(), val])));
    }

    if (typeof data === 'object') {
      return Object.fromEntries(Object.entries(data).map(([key, val]) => [key.toLowerCase(), val]));
    }
  } catch (e) {
    console.error('NmLowercaseKeys Error:', e);
  }

  return data;
};

export const NmGetDropdownData = (data: any) => {
  let tempData = [];
  const lowercaseKeys = data.map((obj: any) => {
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key.toLowerCase(), val]));
  });

  try {
    tempData = lowercaseKeys.map((itemRow: any) => {
      itemRow.value = itemRow.code;
      itemRow.label = itemRow.description;

      delete itemRow.code;
      delete itemRow.description;
      return itemRow;
    });
  } catch (e: any) {
    console.log(e.toString());
  }

  return tempData;
};

export async function NmShowNotification(message: any, channelID: string = APP_KEYS.NOTIF_CHANNEL_HIGH) {
  let notifButtons = message.data.NotifButtons;
  let newButtons;
  let hasButtons = false;
  try {
    newButtons = JSON.parse(notifButtons);
    hasButtons = true;

    newButtons.forEach((obj: any) => {
      if (obj.pressAction.id == 'btnDefault') {
        obj.pressAction.mainComponent = 'NOAH';
      }
    });
  } catch (e: any) {
    console.log(e.toString());
    hasButtons = false;
  }

  const loggedUser = await NmGetSetting(APP_KEYS.ACCESS_USER);
  let decMessage = message.data.NotifMessage;
  let NotifTypeChat = false;

  let messageData;
  if (message.data?.NotifType == 'NOAH_CHAT') {
    NotifTypeChat = true;
    hasButtons = false;
    messageData = {NotifScreen: message.data.NotifScreen};
    decMessage = decMessage.trim(); //NmBasicDecrypt(decMessage.trim(), loggedUser.toString().toUpperCase().trim());
    decMessage = await NmRSADecrypt(decMessage);
  } else if (message.data?.NotifType == 'NOAH_NOTIF_TEST') {
    messageData = {};
  } else {
    messageData = {
      NotifScreen: message.data.NotifScreen,
      NotifLink: message.data.NotifLink,
      NotifParams: message.data.NotifParams,
    };
  }

  try {
    const HIGH_PRIO = await notifee.createChannel({
      id: 'NOAH_IDX',
      name: 'NOAH Notification Channel',
      sound: 'notifstandard',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });

    const DEFAULT_PRIO = await notifee.createChannel({
      id: 'NOAH_IDF',
      name: 'NOAH Notification Channel 3',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
    });

    const NONE_PRIO = await notifee.createChannel({
      id: APP_KEYS.NOTIF_CHANNEL_NONE,
      name: 'NOAH Notification Channel 2',
      importance: AndroidImportance.NONE,
      vibration: true,
    });

    let finalChannel;
    switch (channelID) {
      case APP_KEYS.NOTIF_CHANNEL_HIGH:
        finalChannel = HIGH_PRIO;
        break;
      case APP_KEYS.NOTIF_CHANNEL_DEFAULT:
        finalChannel = DEFAULT_PRIO;
        break;
      case APP_KEYS.NOTIF_CHANNEL_NONE:
        finalChannel = NONE_PRIO;
        break;
    }

    await notifee.displayNotification({
      id: message.data.NotifID, //Always pass an I.D to update a notification
      title: message.data.NotifTitle,
      body: decMessage,
      data: message.data,
      android: {
        channelId: finalChannel,
        smallIcon: 'notif_small_icon',
        color: '#28396f', // optional, defaults to 'ic_launcher'.
        ...(hasButtons
          ? {
              actions: newButtons,
              pressAction: {
                id: 'default',
              },
            }
          : {
              pressAction: {
                id: 'default',
                mainComponent: 'NOAH',
              },
            }),
      },
    });
  } catch (error) {
    console.log('CHAT', error);
  }
}

export async function NmUpdateMessages(newData: any) {
  let savedMessages = (await NmGetSetting(APP_KEYS.MESSAGE_CHAT_DATA)) || [];
  let CurrentUser = (await NmGetSetting(APP_KEYS.ACCESS_USER)) || '';
  CurrentUser = CurrentUser.toString().toUpperCase().trim();

  const notifSenderID = newData.NotifSenderID;
  const notifSender = newData.NotifTitle;
  const notifMessage = await NmRSADecrypt(newData.NotifMessage);

  let prevData = [...savedMessages];
  let userIndex = prevData.findIndex(convo => convo.userID == notifSenderID);
  if (userIndex > -1) {
    // Already have previous conversation
    let userMessages = prevData[userIndex].messages;
    userMessages.unshift({
      fromUser: true,
      dateTime: new XDate(),
      message: notifMessage, //NmBasicDecrypt(notifMessage, CurrentUser),
    });
    prevData[userIndex].lastUpdate = new XDate();
    prevData[userIndex].readStatus = false;
    prevData[userIndex].messages = userMessages;
    await NmSaveSetting(APP_KEYS.MESSAGE_CHAT_DATA, prevData);
  } else {
    // New user conversation
    prevData.unshift({
      userID: notifSenderID,
      userDesc: notifSender,
      lastUpdate: new XDate(),
      readStatus: false,
      messages: [
        {
          fromUser: true,
          dateTime: new XDate(),
          message: notifMessage, //NmBasicDecrypt(notifMessage, CurrentUser),
        },
      ],
    });
    await NmSaveSetting(APP_KEYS.MESSAGE_CHAT_DATA, prevData);
  }
}

export const NmGetCalendarDays = (year: any, month: any, monthDays: any) => {
  let newDate = new Date(year, month, 1);

  let calendarArray = [];

  let monthCtr = 1;
  let startDayFound = false;
  let lastRowEmpty = true;

  for (let i = 0; i < 42; i++) {
    if (i == newDate.getDay() || startDayFound == true) {
      startDayFound = true;

      if (monthCtr <= monthDays) {
        calendarArray[i] = monthCtr;
        monthCtr++;
      } else {
        calendarArray[i] = '';
      }
    } else {
      calendarArray[i] = '';
    }
  }

  for (let i = 35; i < 42; i++) {
    if (calendarArray[i] != '') {
      lastRowEmpty = false;
      break;
    }
  }

  return {
    lastRowEmpty: lastRowEmpty,
    calendarArray: calendarArray,
  };
};

export const NmGetPickerFileType = (FileType: string) => {
  switch (FileType) {
    case FileTypes.FilePicker.Audio:
      return types.audio;
    case FileTypes.FilePicker.CSV:
      return types.csv;
    case FileTypes.FilePicker.DocX:
      return [types.doc, types.docx];
    case FileTypes.FilePicker.Images:
      return types.images;
    case FileTypes.FilePicker.PDF:
      return types.pdf;
    case FileTypes.FilePicker.PlainText:
      return types.plainText;
    case FileTypes.FilePicker.PptX:
      return [types.ppt, types.pptx];
    case FileTypes.FilePicker.Video:
      return types.video;
    case FileTypes.FilePicker.XlsX:
      return [types.xls, types.xlsx];
    case FileTypes.FilePicker.Zip:
      return types.zip;
  }
};

export function NmGetCleanGeoAddress(geoObject: any, removeCountry?: boolean) {
  const plusCodeObj = geoObject.results[0].address_components.filter((item: any) => item.types[0] == 'plus_code');
  const countryName = geoObject.results[0]?.address_components.filter((item: any) => item.types[0] == 'country')[0]?.long_name;
  let cleanAddress = geoObject.results[0].formatted_address;

  if (plusCodeObj.length > 0) {
    if (cleanAddress.indexOf(plusCodeObj[0].long_name) > 0) {
      cleanAddress = cleanAddress.replace(plusCodeObj[0].long_name.concat(', '), '');
    } else {
      cleanAddress = cleanAddress.replace(plusCodeObj[0].long_name, '');
    }
  }

  if (countryName != undefined) {
    cleanAddress = cleanAddress.replace(', ' + countryName, '');
  }

  if (removeCountry == true) {
    if (cleanAddress.startsWith(',')) {
      cleanAddress = cleanAddress.substring(1);
    }
  }
  return cleanAddress.trim();
}

export function inSameMsgThread(notifData: any, routeParams: any) {
  let senderID = NmStringUCaseTrim(notifData?.NotifSenderID);
  let threadID = NmStringUCaseTrim(routeParams?.userID);

  if (senderID == threadID) {
    return true;
  }
  return false;
}

export function NmCreateSectionData(data: any) {
  if (data.length > 0) {
    const grouped = data.reduce((acc: any, item: any) => {
      if (!acc[item.dateTime]) {
        acc[item.dateTime] = [];
      }
      acc[item.dateTime].push(item);
      return acc;
    }, {});

    const sections = Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        title: new XDate(date).toString('MMM dd, yyyy'),
        data: grouped[date],
      }));

    return sections;
  }
  return [];
}

export const NmDevItems = (myItems: any, flags?: any) => {
  const {demoSingleAPI, clocking, demoMode, ocrFunction, wfmApprove} = flags;

  const conditionalItems = [
    {
      condition: demoSingleAPI,
      data: {
        code: 'DemoSingleAPI',
        screenName: 'DemoSingleAPI',
        title: 'Demo SingleAPI',
        icon: 'application-braces-outline',
        local: 1,
        disabled: 0,
      },
    },
    {
      condition: clocking,
      data: {
        code: 'ClockingHome',
        title: 'Clocking System',
        icon: 'widgets-outline',
        disabled: 0,
      },
    },
    {
      condition: demoMode,
      data: {
        code: 'NoahDemo',
        title: 'Lifestyle',
        icon: 'crowd',
        screenName: 'DemoNavigator',
        local: 1,
        disabled: 0,
      },
    },
    {
      condition: ocrFunction,
      data: {
        code: 'NOAH_OCR',
        title: 'NOAH OCR',
        icon: 'widgets-outline',
        screenName: 'NoahOCR',
        local: 1,
        disabled: 0,
      },
    },
    {
      condition: wfmApprove,
      data: {
        screenName: 'WebViewerHome',
        code: 'NOAH_WFM',
        title: 'WFM Approval',
        icon: 'widgets-outline',
        link: 'http://192.168.1.235:80/WorkflowApprovalV10?nwtku=eMQmKa0tmHHpeJL/frXA5DuG3HDl5MG24rabAAGxAAG6meFCzS74UrNliZ23zBhD6EqFT06RXLdwDT1ifYnm4kGP4Hs/34Tgi2DDTWpcKpr6oTVgU=&nscFsJpi3wWL6RT1rO7AQUFokE0UpoJwprnoJ4bLLD8KaEDbUnMDQBIAtykIwPZSFtwtSZAYKdk3sSJHTAdN2OSLw==',
        disabled: 0,
      },
    },
  ];

  const extraItems = conditionalItems.filter(item => item.condition && !myItems.some((e: any) => e.code === item.data.code)).map(item => item.data);

  return [...myItems, ...extraItems];
};

export const NmSanitizeData = (config: string, value: any) => {
  switch (config) {
    case TableInputConfig.DATE: {
      const isoDate = new XDate(NmGetDate(value, 'dashYMD'));
      const engDate = new XDate(value);

      let dateObject = isoDate.valid() ? isoDate : engDate.valid() ? engDate : new XDate();
      return dateObject.toString('MM/dd/yyyy');
    }

    case TableInputConfig.TIME: {
      let xDateObj = new XDate(value);

      if (!value) xDateObj = new XDate();

      if (!xDateObj.valid()) {
        const todayPrefix = new XDate().toString('yyyy-MM-dd');
        xDateObj = new XDate(`${todayPrefix} ${value}`);
      }

      if (!xDateObj.valid()) xDateObj = new XDate();

      return xDateObj.toString("yyyy-MM-dd'T'HH:mm:ss");
    }

    default:
      return value;
  }
};

export const NmGetDisplayFormat = (config: string, value: any, dataset?: any) => {
  let dateObject = new XDate(value);

  switch (config) {
    case TableInputConfig.DATE: {
      if (!value || !dateObject.valid()) {
        return value;
      }

      return dateObject.toString('MM/dd/yyyy');
    }

    case TableInputConfig.TIME: {
      if (!value || !dateObject.valid()) {
        return value;
      }

      return dateObject.toString('hh:mm TT');
    }

    case TableInputConfig.DROPDOWN: {
      const selectedItem = dataset?.find((p: any) => p.value === value);
      return selectedItem ? selectedItem?.label : value;
    }

    default:
      return value;
  }
};

export const NmGetEditFormat = (config: string, value: any) => {
  let dateObject = new XDate(value);

  switch (config) {
    case TableInputConfig.DATE:
    case TableInputConfig.TIME: {
      if (!value || !dateObject.valid()) {
        return value; //dateObject = new XDate();
      }

      return new XDate(value).toString('yyyy-MM-dd HH:mm:ss');
    }

    default:
      return value;
  }
};

export const NmTableNoRecord = (data: any) => {
  if (!data || data.length !== 1) return false;

  const firstRow = data[0];
  const values = Object.values(firstRow);

  return values.length > 0 && values.every(val => val === '');
};

export const NmItemMapper = (data: any, code: string, desc: string) => {
  return data.reduce((acc: any, item: any) => {
    if (item[code] != undefined) {
      acc[item[code]] = item[desc];
    }
    return acc;
  }, {});
};

export const NmParseComponentData = (type: string, data?: any) => {
  switch (type) {
    case NmComponentType.DROPDOWN:
    case NmComponentType.RADIOBUTTON:
      return NmGetDropdownData(data);
    case NmComponentType.TABLE:
      const isTableEmpty = NmTableNoRecord(data);
      return {
        data: NmLowercaseKeys(data),
        isEmpty: isTableEmpty,
      };
    default:
      return data;
  }
};

// export function NmEvenTabData(tabData) {
//   if (tabData.findIndex(tab => tab.key == 'BLANK') < 0) {
//         const tmpTabs = [...tabList];
//         tmpTabs.push({key: 'BLANK', name: 'SPACE'});
//         setTabdata(tmpTabs);
//       }
// }

//======================================================================//
//=========================  GENERAL FUNCTIONS =========================//
//======================================================================//

export function NmGetPropertyName(AccountNo?: string) {
  return new Promise((resolve, reject) => {
    let compName = '';

    NmValidateAccountNo(AccountNo).then(result => {
      try {
        const custProps = result.data.CustProps.Property;
        if (result.status == '200') {
          compName = custProps[0].description; // = NmTitleCase(custProps[0].description);
        }
      } catch (error: any) {
        resolve(AccountNo);
      }
      resolve(compName);
    });
  });
}

export const NmHasInternet = () => {
  return new Promise((resolve, reject) => {
    fetch().then(state => {
      const connectedState = Platform.OS == 'ios' ? state.isConnected : state.isInternetReachable;
      if (connectedState == true) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const NmAddLoginHistory = (username: string) => {
  return new Promise((resolve, reject) => {
    DeviceInfo.getDeviceName().then(deviceName => {
      NmGetPublicIP().then(EstIPAddress => {
        NmGetEstLocation().then(EstLocation => {
          const loginObject = {
            loginEmail: username,
            loginDeviceName: deviceName,
            loginDeviceBrand: DeviceInfo.getBrand(),
            loginDeviceID: DeviceInfo.getDeviceId(),
            loginDeviceIP: EstIPAddress,
            loginDeviceIPLocation: EstLocation,
            loginDeviceEstLocation: 'NULL',
          };

          NmRecordLogin(loginObject).then(result => {
            resolve(true);
          });
        });
      });
    });
  });
};

export const NmGetMessageDateStamp = (SentDate: Date, MessageItem?: boolean) => {
  let DateStamp = '';
  const DateNow = new Date();
  const RecDate = new Date(SentDate);

  const FormattedTime = NmGetDate(RecDate, 'customFormat', 'HH:mm');
  const FormattedWeekDate = NmGetDayOfWeek(RecDate.getDay(), false);
  const MonthName = NmGetMonthName(RecDate.getMonth(), false);

  if (NmDateInThisWeek(RecDate) == true) {
    const secs = Math.floor(Math.abs(DateNow.getTime() - RecDate.getTime()) / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);

    if (hours < 24) {
      DateStamp = FormattedTime;
    } else {
      DateStamp = MessageItem == true ? FormattedWeekDate + ' • ' + FormattedTime : FormattedWeekDate;
    }
  } else {
    DateStamp = MessageItem == true ? FormattedWeekDate + ', ' + MonthName + ' ' + RecDate.getDate() + ' • ' + FormattedTime : MonthName + ' ' + RecDate.getDate();
  }

  return DateStamp;
};

export const NmGetChatDate = (date: Date) => {
  let stringDate = new XDate(date).toString('ddd, MMM dd');
  return stringDate;
};

export const NmGetChatTime = (date: Date) => {
  let stringDate = new XDate(date).toString('hh:mm TT');
  return stringDate;
};

export const NmGetNotificationChannel = (screenName: string, inCurrentScreen?: boolean) => {
  const HighImportance: Array<string> = [];
  const DefaultImportance: Array<string> = ['MessageList'];
  const LowImportance: Array<string> = [];
  const NoImportance: Array<string> = ['MessageThread'];

  let channelID;

  if (HighImportance.includes(screenName)) {
    channelID = APP_KEYS.NOTIF_CHANNEL_HIGH;
  } else if (DefaultImportance.includes(screenName) || LowImportance.includes(screenName)) {
    channelID = APP_KEYS.NOTIF_CHANNEL_DEFAULT;
  } else if (NoImportance.includes(screenName)) {
    channelID = APP_KEYS.NOTIF_CHANNEL_NONE;
  }

  if (inCurrentScreen == true) {
    channelID = APP_KEYS.NOTIF_CHANNEL_NONE;
  }

  return channelID;
};

export const NmGetNextEdpCode = (baseCode: string, list: any[]): string => {
  const existingMatches = list.filter(item => item.Code.startsWith(baseCode));

  if (existingMatches.length == 0) return baseCode;

  // Extract numbers from existing codes (e.g., "FPMC_1" -> 1)
  const suffixes = existingMatches.map(item => {
    const parts = item.Code.split('||');
    const lastPart = parts[parts.length - 1];
    return isNaN(Number(lastPart)) ? 0 : Number(lastPart);
  });

  const maxSuffix = Math.max(...suffixes);
  return `${baseCode}||${maxSuffix + 1}`;
};

const DevOptionKeys = ['DemoMode', 'ShowClearCache', 'ShowClearData', 'ListView', 'NOAHStandard', 'DisableMockCheck'];
export function NmLoadDevOptions(loginSetters: any, devOptions: Array<string>) {
  console.log('devOptions', devOptions);
  for (const element of devOptions) {
    if (DevOptionKeys.includes(element)) {
      switch (element) {
        case 'DemoMode':
          loginSetters.setDemoMode(true);
          break;
        case 'ShowClearCache':
          loginSetters.setShowClearCache(true);
          break;
        case 'ShowClearData':
          loginSetters.setShowClearData(true);
          break;
        case 'ListView':
          loginSetters.setDashboardView('LIST');
          break;
        case 'NOAHStandard':
          loginSetters.setNoahStandard('CUSTOM');
          break;
        case 'DisableMockCheck':
          loginSetters.setDisableMockCheck(true);
          break;
      }
    }
  }
}

//======================================================================//
//====================  APPLICATION DATA MANAGEMENT ====================//
//======================================================================//

export const NmSaveSetting = async (key: string, setting: any) => {
  try {
    await EncryptedStorage.setItem(
      key,
      JSON.stringify({
        value: setting,
      }),
    );
  } catch (error) {
    return undefined;
  }
};

export const NmGetSetting = async (key: string) => {
  try {
    const session = await EncryptedStorage.getItem(key);

    if (session != null || session != undefined) {
      const sett = JSON.parse(session);
      return sett.value;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

export async function NmClearSetting(key: string) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.log('CLSingle');
  }
}

export async function NmClearAllSettings() {
  try {
    await EncryptedStorage.clear();
    return true;
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    console.log('CLS', error);
    return false;
    // There was an error on the nati ve side
  }
}

async function NmClearCache() {
  await ClearCache.clearCacheDir().then(() => {
    return true;
  });
}

export const NmClearLoginData = (ctxClearUserData?: () => void, ctxClearUserConfig?: () => void) => {
  // UPDATE THIS
  return new Promise((resolve, reject) => {
    NmClearCache().then(() => {
      getMessaging().deleteToken();
      ctxClearUserData?.();
      ctxClearUserConfig?.();
    });
    resolve(true);

    // NmSaveSetting(APP_KEYS.APP_SYSCONFIG_BASELINK, ConfigDetails().BaseLinkURL);
    // NmSaveSetting(APP_KEYS.APP_SYSCONFIG_DEEPLINK, global.DeepLinkRoute);
    // NmSaveSetting(APP_KEYS.APP_SETUP_FINISHED, true);

    // NmSaveSetting(APP_KEYS.ENDPOINT_URL, WebConfig.Endpoint);
    // NmSaveSetting(APP_KEYS.ENDPOINT_CODE, WebConfig.EndpointCode);
    // NmSaveSetting(APP_KEYS.ENDPOINT_KEY, WebConfig.Secretkey);

    // NmSaveSetting(APP_KEYS.DB_INITIALIZED, undefined);
    // NmSaveSetting(APP_KEYS.DB_TABLES, undefined);

    // NmSaveSetting(APP_KEYS.APP_BIOMETRIC_USE, undefined);
    // NmSaveSetting(APP_KEYS.APP_BIOMETRIC_ASKED, undefined);

    // NmSaveSetting(APP_KEYS.MESSAGE_SVD_DATA, undefined);
    // NmSaveSetting(APP_KEYS.NOTIF_CURRENT_DATA, undefined);
    // resolve(true);
  });

  // ClearNotificationTable().then(result => {
};

export async function NmClearAppData() {
  return new Promise((resolve, reject) => {
    NmClearCache().then(() => {
      NmClearAllSettings().then(result => {
        if (result == true) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
    // if (global.AppDatabaseInitialized == true) {
    //   NmDropTables(global.DatabaseTables).then(() => {
    //     NmClearCache().then(() => {
    //       NmClearAllSettings().then(result => {
    //         if (result == true) {
    //           resolve(true);
    //         } else {
    //           reject(false);
    //         }
    //       });
    //     });
    //   });
    // } else {
    //   NmClearCache().then(() => {
    //     NmClearAllSettings().then(result => {
    //       if (result == true) {
    //         resolve(true);
    //       } else {
    //         reject(false);
    //       }
    //     });
    //   });
    // }
  });
}

//======================================================================//
//========================  APP INITIALIZATION =========================//
//======================================================================//

//Initialize mobile settings - for use in loading/splash screen
export const NmInitializeSettings = () => {
  return new Promise((resolve, reject) => {
    (async () => {
      // PRIMARY VARIABLES
      global.DatabaseTables = await NmGetSetting(APP_KEYS.DB_TABLES);

      // USER VARIABLES
      global.ApprovalItems = await NmGetSetting(APP_KEYS.APP_APPROVAL_ITEMS);

      let messagingData = await NmGetSetting(APP_KEYS.MESSAGE_SVD_DATA);
      EventRegister.emit('UpdateMessages', {
        data: messagingData,
        fromStorage: true,
      });

      resolve(true);
    })();
  });
};

export const NmInitUserDetails = () => {
  return new Promise((resolve, reject) => {
    (async () => {
      //
      resolve(true);
    })();
  });
};

export const NmInitEndpoints = (EndpointSet: (code: string, value: any) => void, loginSetters: any, AssetManager: any, setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>) => {
  return new Promise((resolve, reject) => {
    (async () => {
      /* 
      -- Check if there is a saved endpoint list
      IF YES: 
      - Check current user selected endpoint
      - If user has no selected endpoint, proceed with default
      - If user switches to default and there is a saved endpoint, remove the saved endpoint and tied credentials
      - Check if user has saved login on that endpoint (Enabled device biometrics upon login)
      
      IF NO:
      - Fetch list, save if not empty
      */
      const EndpointInit = loginSetters.EndpointInit;
      const EndpointCurrent = loginSetters.EndpointCurrent;

      if (EndpointInit) {
        if (EndpointCurrent) {
          // Update app endpoint
          EndpointSet(APP_KEYS.ENDPOINT_CODE, EndpointCurrent.Code);
          EndpointSet(APP_KEYS.ENDPOINT_URL, EndpointCurrent.EndpointLink);
          EndpointSet(APP_KEYS.ENDPOINT_KEY, EndpointCurrent.SecretKey);

          const DevOptionsList = EndpointCurrent?.DeveloperOptions;
          if (Array.isArray(DevOptionsList) && DevOptionsList.length > 0) {
            NmLoadDevOptions(loginSetters, DevOptionsList);
          }

          // Get user accounts per endpoint
          const endpointUsers = await NmGetSetting(APP_KEYS.ENDPOINT_CREDENTIALS);

          if (endpointUsers && endpointUsers?.length > 0) {
            // Check if current endpoint code has saved credentials (these are saved if user opts in to use biometric login)
            const savedUserDetails = endpointUsers.find((val: any) => val.EndpointCode == EndpointCurrent.Code);

            if (savedUserDetails) {
              setDarkTheme(savedUserDetails.DarkTheme);
              loginSetters.setUserAccounts(savedUserDetails.Accounts);

              loginSetters.setLoginToken(savedUserDetails.LoginToken);
              loginSetters.setTokenExpiration(savedUserDetails.LoginTokenExpire);
              loginSetters.setRecuser(savedUserDetails.UserCode);
              loginSetters.setRecname(savedUserDetails.UserDescription);
              loginSetters.setLastLogin(savedUserDetails.LoginTime);

              // ==
              loginSetters.setCurrentAccount(savedUserDetails.AccountToken);
              loginSetters.setCompanyToken(savedUserDetails.CompanyToken);
              // ==

              AssetManager.setBiometricAsked(savedUserDetails.BiometricAsked);
              AssetManager.setBiometricUse(savedUserDetails.BiometricUse);
            } else {
              setDarkTheme(false); // No saved user login = light theme
            }
          }
        }
      } else {
        NmGetEndpointsList().then(response => {
          let defaultList = [...APP_ENDPOINT_CONFIGS];
          if (response.status == APP_CONST.RESPONSE_OK) {
            defaultList.push(...response.data);
          }

          NmSaveSetting(APP_KEYS.ENDPOINT_LIST, defaultList);
          NmSaveSetting(APP_KEYS.ENDPOINT_INIT, true);

          loginSetters.setEndpointsList(defaultList);
        });
      }
      resolve(true);
    })();
  });
};

export const NmInitMobileAssets = (setV9Link: any, demoMode: any, setLandingPage: any, AssetManager?: any) => {
  return new Promise(resolve => {
    NmGetMobileAssets().then(result => {
      const response = result.status;
      const responseData = result;

      if (response == '200') {
        try {
          let Assets = responseData.data.Assets;
          let SysConfig: ConfigItem[] = Assets.SysConfig;
          let tmpAppType = SysConfig.find(element => element.code == 'Mob_AppType')?.value;
          SetConfig(APP_CONST.APP_TYPE_CONFIG, tmpAppType);

          if (tmpAppType == APP_CONST.APP_TYPE_PORTAL) {
            const tempConfigs: any = {}; // Returned data
            tempConfigs.TermsAndConditions = Assets.TermsAndConditions[0]?.['Contents'];
            tempConfigs.PrivacyPolicy = Assets.PrivacyPolicy[0]?.['Contents'];
            tempConfigs.DashboardIcons = Assets.Dashboard;
            tempConfigs.BibleVerseData = Assets?.BibleVerse?.[0] || {};

            if (demoMode == true) {
              tempConfigs.DashboardIcons.push({
                disabled: 0,
                local: 1,
                title: 'Lifestyle',
                icon: 'crowd',
                screenName: 'DemoNavigator',
              });
            }

            AssetManager.setAppAssets(tempConfigs);

            let tmpBaseLink = SysConfig.find(element => element.code == 'Mob_BaseLink')?.value;
            tmpBaseLink = tmpBaseLink == '' ? '' : tmpBaseLink.endsWith('/') == true ? tmpBaseLink : tmpBaseLink + '/';

            let tmpBaseInstance = SysConfig.find(element => element.code == 'Mob_BaseInst')?.value;
            tmpBaseInstance = tmpBaseInstance == '' ? '' : tmpBaseInstance.endsWith('/') == true ? tmpBaseInstance : tmpBaseInstance + '/';

            let tmpDeeplinkRoute = SysConfig.find(element => element.code == 'Mob_DLRoute')?.value;
            tmpDeeplinkRoute = tmpDeeplinkRoute.startsWith('/') == true ? tmpDeeplinkRoute.substr(1) : tmpDeeplinkRoute;

            let tmpIsV9Link = SysConfig.find(element => element.code == 'Mob_V9Link')?.value;
            tmpIsV9Link = tmpIsV9Link == '1' ? true : false;

            let tmpLandingDefault = SysConfig.find(element => element?.code == 'Mob_Login')?.value;
            if (tmpLandingDefault != undefined) {
              setLandingPage(tmpLandingDefault.toString());
              NmSaveSetting(APP_KEYS.APP_SYSCONFIG_LANDING, tmpLandingDefault.toString());
            }

            const tmpLink = tmpBaseLink + tmpBaseInstance;
            SetConfig(APP_CONST.APP_CONFIG_DEEPLINK, tmpDeeplinkRoute);
            SetConfig(APP_KEYS.APP_SYSCONFIG_BASELINK, tmpLink); // Add for switching Endpoints
            setV9Link(tmpIsV9Link);

            NmSaveSetting(APP_KEYS.APP_SYSCONFIG_BASELINK, tmpLink);
            NmSaveSetting(APP_KEYS.APP_SYSCONFIG_DEEPLINK, tmpDeeplinkRoute);
            NmSaveSetting(APP_KEYS.APP_ASSET_VERSE, tempConfigs.BibleVerseData);
            NmSaveSetting(APP_KEYS.APP_SYSCONFIG_V9LINK, tmpIsV9Link);

            const serverVersion = SysConfig.find(element => element?.code == 'MobApp_Ver')?.value;
            const versionCheck = checkAppVersion(serverVersion);

            resolve({value: true, versionCheck: versionCheck});
          }

          if (tmpAppType == APP_CONST.APP_TYPE_APPROVER) {
            let tmpBaseLink = SysConfig.find(element => element.code == 'Mob_BaseLink')?.value;
            tmpBaseLink = tmpBaseLink.endsWith('/') == true ? tmpBaseLink : tmpBaseLink + '/';

            let tmpBaseInstance = SysConfig.find(element => element.code == 'Mob_BaseInst')?.value;
            tmpBaseInstance = tmpBaseInstance.endsWith('/') == true ? tmpBaseInstance : tmpBaseInstance + '/';

            const tmpLink = tmpBaseLink + tmpBaseInstance;
            //SetConfig(APP_CONST.APP_CONFIG_DEEPLINK, tmpDeeplinkRoute);

            NmSaveSetting(APP_KEYS.APP_SYSCONFIG_BASELINK, tmpLink);
            //NmSaveSetting(APP_KEYS.APP_SYSCONFIG_DEEPLINK, tmpDeeplinkRoute);
          }

          if (tmpAppType == undefined || tmpAppType == '') {
            resolve({
              value: false,
              title: 'Unknown Error',
              message: 'Undefined App Type.',
            });
          }
        } catch (error: any) {
          console.log(error.toString());
          resolve({
            value: false,
            title: 'Server data error',
            message: error.toString(),
          });
        }
      } else {
        resolve({
          value: false,
          title: result?.message,
          message: result?.detailmsg,
        }); //error message from API call
      }
    });
  });
};

function checkAppVersion(serverVersion: string) {
  const internalVersion = NOAHConfig.InternalAppVersion.replaceAll('.', '');

  if (!serverVersion) {
    return APP_CONST.APP_VERCODE_OKAY; // No defined version or invalid DB version value
  }

  try {
    const config = JSON.parse(serverVersion);
    const priority = config.priority;
    const deployedVersion = config.version.replaceAll('.', '');

    if (parseInt(internalVersion) < parseInt(deployedVersion)) {
      if (priority == '1') {
        return APP_CONST.APP_VERCODE_HIGH; // High priority, update app to use
      } else {
        return APP_CONST.APP_VERCODE_LOW; // Low priority, can continue to use current version
      }
    } else {
      return APP_CONST.APP_VERCODE_OKAY;
    }
  } catch (error) {
    return APP_CONST.APP_VERCODE_OKAY;
  }
}

async function NmGetFCMToken() {
  try {
    const token = await getMessaging().getToken();
    return token;
  } catch (e) {
    return '';
  }
}

export const NmGetChatKeys = async (keyTag: string) => {
  try {
    const keys = await RSAKeychain.generateKeys(keyTag, 1024);
    return keys.public;
  } catch (error) {
    console.error('Error generating and storing keys:', error);
    return '';
  }
};

export const NmInitGetUserDetails = (usercode: string, loginToken: string, loginSetters?: any, noahStandard?: any) => {
  return new Promise((resolve, reject) => {
    NmGetUserDetails(usercode, loginToken, noahStandard).then(result => {
      let responseData = result;

      NmGetFCMToken().then(NotifToken => {
        if (responseData.status == 200) {
          NmGetChatKeys(APP_CONST.TAG_KP).then(pubkey => {
            //const EncMessage = await NmRSAEncrypt(inputText, userPubKey);

            NmGrantMultiAccess(usercode).then(res => {
              NmStoreUserToken(usercode, NotifToken, DeviceInfo.getDeviceId(), loginToken);
              NmStorePublicKey(usercode, pubkey);

              const TmpAccountList = responseData.data.UserAccounts;

              let tempRecname = NmTitleCase(responseData.data.UserDescription);
              let tempCurrentAccessToken = NmCreateWebToken(TmpAccountList[0].AccountToken);
              let tempUserAccounts = [];
              let tmpCurrentCompToken = '';

              NmGetPropertyName(TmpAccountList[0].AccountNo).then(result => {
                if (typeof result == 'string') {
                  tmpCurrentCompToken = TmpAccountList[0].AccountDBToken;

                  tempUserAccounts = TmpAccountList.map((itemRow: any) => {
                    itemRow.comptoken = itemRow.AccountDBToken;
                    itemRow.value = itemRow.AccountToken;
                    itemRow.label = itemRow.AccountNo.toUpperCase();
                    itemRow.compcode = itemRow?.AccountComp;
                    itemRow.v9token = itemRow?.V9AccountToken;

                    delete itemRow.AccountNo;
                    delete itemRow.AccountToken;
                    delete itemRow.AccountDBToken;
                    delete itemRow?.AccountComp;
                    delete itemRow?.V9AccountToken;
                    return itemRow;
                  });

                  loginSetters.setUserAccounts(tempUserAccounts);
                  loginSetters.setCurrentAccount(tempCurrentAccessToken);
                  loginSetters.setCompanyToken(tmpCurrentCompToken);
                  loginSetters.setRecname(tempRecname);

                  // NmSaveSetting(APP_KEYS.ACCESS_TOKEN_CURRENT, tempCurrentAccessToken);
                  // NmSaveSetting(APP_KEYS.ACCESS_NAME, tempRecname);
                  // NmSaveSetting(APP_KEYS.ACCESS_COMPTOKEN_CURRENT, tmpCurrentCompToken);
                  // NmSaveSetting(APP_KEYS.ACCESS_ACCOUNT_LIST, tempUserAccounts);
                  resolve({
                    status: true,
                    data: {
                      Usercode: usercode,
                      Accounts: tempUserAccounts,
                      Username: tempRecname,
                      AccessToken: tempCurrentAccessToken,
                      CompanyToken: tmpCurrentCompToken,
                    },
                  });
                }
              });

              if (responseData.status == 400) {
                tempRecname = 'Mobile User';
                tempCurrentAccessToken = NmCreateWebToken(loginToken);
                loginSetters.setRecname(tempRecname);
                resolve({
                  status: true,
                  data: {
                    Usercode: usercode,
                    Accounts: [],
                    Username: tempRecname,
                    AccessToken: tempCurrentAccessToken,
                    CompanyToken: tempCurrentAccessToken,
                  },
                });
              }

              if (responseData.status == 401) {
                tempRecname = NmTitleCase(responseData.data.UserDescription);
                tempUserAccounts = [{id: loginToken, title: usercode.toUpperCase()}];
                tempCurrentAccessToken = NmCreateWebToken(loginToken);
                loginSetters.setRecname(tempRecname);

                NmSaveSetting(APP_KEYS.ACCESS_NAME, tempRecname);
                NmSaveSetting(APP_KEYS.ACCESS_ACCOUNT_LIST, tempUserAccounts);
                resolve({
                  status: true,
                  data: {
                    Usercode: usercode,
                    Accounts: tempUserAccounts,
                    Username: tempRecname,
                    AccessToken: tempCurrentAccessToken,
                    CompanyToken: tempCurrentAccessToken,
                  },
                });
              }

              if (responseData.status == '404') {
                reject({status: false, data: {}});
              }
            });
          });
        }
      });
    });
  });
};

export async function NmUpdateUserConfig(EndpointCurrentCode: string, newValuesObject: any) {
  const endpointUsers = await NmGetSetting(APP_KEYS.ENDPOINT_CREDENTIALS);

  if (Array.isArray(endpointUsers) && endpointUsers.length > 0) {
    const savedUserDetailsIndex = endpointUsers.findIndex(val => val.EndpointCode == EndpointCurrentCode);

    if (savedUserDetailsIndex !== -1) {
      endpointUsers[savedUserDetailsIndex] = {
        ...endpointUsers[savedUserDetailsIndex],
        ...newValuesObject,
      };

      await NmSaveSetting(APP_KEYS.ENDPOINT_CREDENTIALS, endpointUsers);
    }
  }
}

//===========================  APP DRAWER FUNCTIONS ===========================//

let itemMaxLevel: number;

export const NmInitializeDrawer = (AssetManager?: any, tempAppItems?: any) => {
  return new Promise((resolve, reject) => {
    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
      let DynamicDrawerItems = tempAppItems.MenuDriven;

      var myHomeItem = {
        iconName: 'home-outline',
        title: 'Home',
        screenName: 'Home',
        type: '1',
      };

      if (DynamicDrawerItems?.length > 0) {
        let tmpmaxlevel = DynamicDrawerItems.reduce((max: any, curren: any) => (max.ItemLevel > curren.ItemLevel ? max : curren));
        itemMaxLevel = tmpmaxlevel.ItemLevel;

        while (itemMaxLevel >= 0) {
          DynamicDrawerItems = buildDrawerItems(DynamicDrawerItems, tempAppItems);
          DynamicDrawerItems = DynamicDrawerItems.filter((value: any) => Object.keys(value).length !== 0);
          itemMaxLevel -= 1;
        }

        DynamicDrawerItems.unshift(myHomeItem);
        DynamicDrawerItems = DynamicDrawerItems.filter((i: any) => i.title != undefined);
      } else {
        DynamicDrawerItems = [];
        DynamicDrawerItems.push(myHomeItem);
      }

      NmSaveSetting(APP_KEYS.APP_DRAWER_ITEMS, DynamicDrawerItems);
      AssetManager.setDrawerItems(DynamicDrawerItems);

      resolve(true);
    }

    if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
      let finalDrawerItems = [];

      var myHomeItem = {
        iconName: 'home-outline',
        title: 'Home',
        screenName: 'Home',
        type: '1',
      };
      finalDrawerItems.push(myHomeItem);
      NmSaveSetting(APP_KEYS.APP_DRAWER_ITEMS, finalDrawerItems);
      AssetManager.setDrawerItems(finalDrawerItems);

      resolve(true);
    }
  });
};

const buildDrawerItems = (itemlist: Array<any>, tempAppItems?: any) => {
  let tmpItemList = itemlist;
  let tmpMenuItems = tempAppItems.MenuitemInfo;

  tmpItemList.map(item => {
    if (item.ItemLevel == itemMaxLevel) {
      let linkIndex;
      let modLink;
      let tmpIndex: number = -1;

      var myObj = {
        itemID: item.ItemID,
        title: item.ItemName,
        type: item.ItemType,
        parentApp: item.ItemParentApplication,
      } as any;

      try {
        tmpIndex = tmpItemList.findIndex(p => p.ItemID == item.ItemParentItem);
      } catch (error) {}

      try {
        linkIndex = tmpMenuItems.findIndex((p: any) => p.code == item.ItemID);
      } catch (error) {}

      if (item.ItemType == '1') {
        if (linkIndex != -1) {
          modLink = tmpMenuItems[linkIndex].link;
          modLink = modLink != null ? (modLink.endsWith('/') == true ? modLink.substr(0, modLink.length - 1) : modLink) : modLink;
          modLink = AppConfig.BaseLinkURL + modLink;
          myObj.link = modLink;
          myObj.iconName = tmpMenuItems[linkIndex].icon;
        }
      } else {
        myObj.link = null;
        myObj.iconName = 'submenu';
      }

      if ('subMenu' in item) {
        myObj.subMenu = item.subMenu;
      }

      if (tmpIndex != -1) {
        if ('subMenu' in tmpItemList[tmpIndex]) {
          tmpItemList[tmpIndex].subMenu.push(myObj);
        } else {
          tmpItemList[tmpIndex].subMenu = [];
          tmpItemList[tmpIndex].subMenu.push(myObj);
        }
      } else {
        tmpItemList.push(myObj);
        Object.keys(item).forEach(key => delete item[key]);
      }
    }
  });

  return tmpItemList;
};

//===========================  APPROVER FUNCTIONS ===========================//

export const NmInitUserApprovals = (user: string, token?: string) => {
  return new Promise((resolve, reject) => {
    NmGetUserApprovals(user).then(result => {
      if (result.status != '404') {
        let approvals = result.Table;

        if (approvals != undefined) {
          approvals.forEach((approvalItem: any) => {
            approvalItem.link =
              AppConfig.BaseLinkURL + NOAHConfig.ApprovalLink + 'nwComp=NOAHFLI&nwTrantype=' + approvalItem.TranType + '&hasForm=' + approvalItem.hasForm + '&nwtku=' + token + '&nwdev=p8dev';
            // console.log(approvalItem.TranType);
            // let tmpTranType = approvalItem.TranType;

            // index = tmpDrawerItems.findIndex(p => p.itemID == tmpTranType);

            // if (index > -1) {
            //   approvalItem.link = tmpDrawerItems[index].link;
            // } else {
            //   approvalItem.screenName = 'UnderConstruction';
            // }
          });
        }

        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

//======================================================================//
//===========================  NOTIFICATIONS ===========================//
//======================================================================//

export const NmRefreshAllNotifications = (user: string, notifManager?: any) => {
  return new Promise((resolve, reject) => {
    NmRefreshNotificationList(user, notifManager).then(result => {
      if (result == true) {
        NmRefreshUnreadNotificationList(user, notifManager).then(result => {
          if (result == true) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    });
  });
};

export const NmRefreshNotificationList = (user: string, notifManager?: any) => {
  return new Promise((resolve, reject) => {
    NmGetNotifications(user, APP_CONST.NOTIF_GET_ALL, notifManager).then(responseData => {
      if (responseData.status == 200) {
        const tmpNotifList = responseData.data.Notifications ?? [];
        const tmpNotifMinDate = responseData.data.MinDate;

        notifManager.setUserNotifications(tmpNotifList);
        notifManager.setMinDateNotification(tmpNotifMinDate);

        NmSaveSetting(APP_KEYS.NOTIF_LIST_ALL, tmpNotifList);
        NmSaveSetting(APP_KEYS.NOTIF_MINDATE_ALL, tmpNotifMinDate);
      } else {
        notifManager.setUserNotifications([]);
      }
      resolve(true);
    });
  });
};

export const NmRefreshUnreadNotificationList = (user: string, notifManager?: any) => {
  return new Promise((resolve, reject) => {
    NmGetNotifications(user, APP_CONST.NOTIF_GET_UNREAD, notifManager).then(responseData => {
      if (responseData.status == 200) {
        const tmpUnreadNotifList = responseData.data.Notifications ?? [];
        const tmpUnreadNotifMinDate = responseData.data.MinDate;

        notifManager.setUserUnreadNotifications(tmpUnreadNotifList);
        notifManager.setMinDateUnreadNotification(tmpUnreadNotifMinDate);

        NmSaveSetting(APP_KEYS.NOTIF_LIST_UNREAD, tmpUnreadNotifList);
        NmSaveSetting(APP_KEYS.NOTIF_MINDATE_UNREAD, tmpUnreadNotifMinDate);
      } else {
        notifManager.setUserUnreadNotifications([]);
      }
      resolve(true);
    });
  });
};

export const NmLoadMoreNotifications = (user: string, notifManager?: any) => {
  return new Promise((resolve, reject) => {
    NmGetNotifications(user, APP_CONST.NOTIF_GET_MORE, notifManager).then(responseData => {
      if (responseData.status == 200) {
        notifManager.setUserNotifications([...notifManager.userNotifications, ...responseData.data.Notifications]);
        notifManager.setMinDateNotification(responseData.data.MinDate);
      }
      resolve(true);
    });
  });
};

export const NmLoadMoreUnreadNotifications = (user: string, notifManager?: any) => {
  return new Promise((resolve, reject) => {
    NmGetNotifications(user, APP_CONST.NOTIF_GET_MORE_UNREAD, notifManager).then(responseData => {
      if (responseData.status == 200) {
        notifManager.setUserUnreadNotifications([...notifManager.userUnreadNotifications, ...responseData.data.Notifications]);
        notifManager.setMinDateUnreadNotification(responseData.data.MinDate);
      }
      resolve(true);
    });
  });
};

//===========================  DYNAMIC IMAGE FUNCTIONS ===========================//
// Functions below aren't currently used. But these are for dynamically downloading
// images from server and saving them to local storage for application use

export const createAssets = () => {
  return new Promise((resolve, reject) => {
    let path = RNFS.CachesDirectoryPath + '/LoginOptionBackground.jpg';
    let result;

    RNFS.downloadFile({
      fromUrl: 'https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg',
      toFile: path,
      background: false,
      cacheable: true,
    }).promise.then((r: any) => {
      result = r.statusCode == '200' ? true : false;

      RNFS.readDir(RNFS.CachesDirectoryPath)
        .then((result: any) => {
          const tmpLoginOptionBackground = {uri: 'file://' + path};
        })
        .catch((err: any) => {
          console.log(err.message, err.code);
        });

      resolve(result);
    });
  });
};

export const initializeAssets = () => {
  const {Endpoint} = getEndpointDetails();

  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('POST', Endpoint + 'APIM/GetImageList', {
        //method: 'POST',
        //headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //},
      })
      .then(response => response.json())
      .then(responseData => {
        let tmpImageArray = responseData.assets.ImageList;

        if (tmpImageArray.length > 0) {
          tmpImageArray.map((imageObject: any) => {
            let ImgPath = downloadAsset(imageObject.code, imageObject.link, imageObject.type);
            imageObject.filePath = ImgPath;
          });
        }
        resolve(true);
      })
      .catch(error => {
        console.log('initAssets', error);
      });
  });
};

const downloadAsset = (code: string, link: string, type: string) => {
  let path = RNFS.CachesDirectoryPath + '/' + code + '.' + type;
  let result;

  RNFS.downloadFile({
    fromUrl: link,
    toFile: path,
    background: false,
    cacheable: true,
  }).promise.then((r: any) => {
    result = r.statusCode == '200' ? true : false;

    if (result == true) {
      return path;
    } else {
      //Add function to get DEFAULT IMAGE PATH for the KEY (code) provided
    }
  });
};

export async function NmPicKMultiplePhotos(NmFileType: string) {
  const fileTypeAndroid = NmFileType == 'PHOTO' ? types.images : NmFileType == 'VIDEO' ? types.video : 'FILE_TYPE_NULL';
  const fileTypeIOS = NmFileType == 'PHOTO' ? 'photo' : NmFileType == 'VIDEO' ? 'video' : 'FILE_TYPE_NULL';
  const fileType = NmFileType == 'PHOTO' ? 'image' : NmFileType == 'VIDEO' ? 'video' : 'FILE_TYPE_NULL';

  if (Platform.OS == 'android') {
    try {
      const pickerResult = await pick({
        allowMultiSelection: true,
        type: [fileTypeAndroid],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      const filterSelected = pickerResult.filter(item => item?.type?.includes(fileType));
      return filterSelected;
    } catch (e) {
      //
    }
  } else if (Platform.OS == 'ios') {
    const options = {
      mediaType: fileTypeIOS, //photo, video, mixed (ios only)
      selectionLimit: 0, //1 for single, 0 for multiple
      //includeBase64: true,
    } as ImageLibraryOptions;

    const response = launchImageLibrary(options, response => {
      if (response?.assets != undefined) {
        const responseObject = response?.assets[0] as any; //check on iOS
        if (responseObject.hasOwnProperty('fileSize') && responseObject?.width > 0 && responseObject?.height > 0) {
          //
        } else {
          //return error here
        }
      } else {
        //return nothing here
      }
    });
  }
}

// ==================================================
// GEOLOCATION FUNCTIONS
// ==================================================

export const NmGetGeoAddress = async (lat: number | string, lng: number | string) => {
  const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
  const longitude = typeof lng === 'string' ? parseFloat(lng) : lng;

  if (isNaN(latitude) || isNaN(longitude) || (latitude === 0 && longitude === 0)) {
    return {status: 'ZERO_RESULTS'};
  }

  try {
    const results = await Location.reverseGeocodeAsync({latitude, longitude});

    if (results && results.length > 0) {
      const address = results[0];
      const formattedAddress = [address.streetNumber, address.street, address.district, address.city].filter(Boolean).join(', ');

      return {
        status: 'OK',
        formattedAddress: formattedAddress || address.name || 'Unknown Location',
        raw: address,
      };
    }
  } catch (nativeError) {
    console.warn('Native geocode failed (null field or water coords), attempting web fallback...');
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

    const res = await ReactNativeBlobUtil.config({}).fetch('GET', url, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Nominatim requires an app ID and a contact email/domain to prevent 403 blocks
      'User-Agent': 'NOAH_App/1.0 (dev@noah.com)',
    });

    const info = res.info();
    if (info.status === 200) {
      const osmData = res.json();

      if (osmData && (osmData.address || osmData.display_name)) {
        const addr = osmData.address || {};
        const formattedAddress = [addr.house_number, addr.road, addr.suburb || addr.neighbourhood, addr.city || addr.town || addr.municipality].filter(Boolean).join(', ');

        return {
          status: 'OK',
          formattedAddress: formattedAddress || osmData.display_name,
          raw: osmData,
        };
      }
    } else {
      console.warn(`OSM HTTP Error: ${info.status}`);
    }

    return {status: 'ZERO_RESULTS'};
  } catch (fallbackError) {
    console.warn('All reverse geocoding attempts failed:', fallbackError);
    return false;
  }
};

// 1. Download image list (code, url) from server (must return a JSON object)
// 2. Use MAP function to image array object then Try to download each file and save to cache directory
// 3. If download succesful, save path to current image object, if download fail, use default image (NOAH).
// 4. Store the image object array using Encrypted Storage (Check splashscreen for logo source)
// 5. Each image source SHOULD have the same STRING KEY as the KEYS stored in the server which will get the path by using the function below

// var ImagePath = ImageObjectArray.find(obj => { -- ALWAYS CHECK IF RESULT IS undefined, IF undefined USE DEFAULT IMAGE FOR SOURCE (NOAH)
//   return obj.code == 'IMAGE_KEY';
// }).filePath;

// the function should return the path in uri format.
//   return {uri: 'file://' + ImagePath};

//Remove Root Folders
// tmpDrawerItems = tmpDrawerItems.filter(item => item.ItemParentItem != 'root');
// console.log(tmpDrawerItems);

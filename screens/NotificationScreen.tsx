import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, ToastAndroid, Platform} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

import {StackScreenProps} from '../navigation/NavigationTypes';
import {ThemesContext} from '../functions/ThemeContext';
import {NmRefreshAllNotifications, NmLoadMoreNotifications, NmGetNotifTime, NmGetNotifAbbreviation, NmHardwareBackPress} from '../functions/NmFunctions';
import {AccountDetailsContext, AppConfigContext, NotificationsContext} from '../functions/Contexts';

type Props = StackScreenProps<'NotificationScreen'>;

interface NotificationItem {
  ReferenceID: string;
  Recdate: string;
  NotifType: string;
  AccountNo: string;
  Title: string;
  Message: string;
}

const NotificationScreen = ({navigation, route}: Props): React.JSX.Element => {
  const {thirdLayout} = route.params;
  const {theme} = useContext(ThemesContext);
  const {notificationsList} = useContext(NotificationsContext);
  const {recuser, notifManager} = useContext(AccountDetailsContext);
  const {AssetManager} = useContext(AppConfigContext);

  const flatListRef = useRef<FlatList<NotificationItem>>(null);

  const [listRefreshing, setListRefreshing] = useState<boolean>(false);
  const [consoNotifs, setConsoNotifs] = useState<NotificationItem[]>([]);

  const NotifList: NotificationItem[] = notifManager.userNotifications;
  const NoUnread: boolean = NotifList.length == 0 ? true : false;

  useEffect((): void => {
    const sortedArray: NotificationItem[] = [...notifManager.userNotifications, ...notificationsList];
    sortedArray.sort((a: NotificationItem, b: NotificationItem) => {
      const dateA = new Date(a.Recdate).getTime();
      const dateB = new Date(b.Recdate).getTime();

      return dateB - dateA;
    });

    setConsoNotifs(sortedArray);
  }, [notifManager?.userNotifications, notificationsList]);

  NmHardwareBackPress((): boolean => {
    navigation.navigate('Home');
    return true;
  });

  const navigateTo = (menuItem: string, accountNo: string): void => {
    const index = AssetManager.drawerItems.findIndex((p: any) => p.title == menuItem);
    const menuItemLink = AssetManager.drawerItems[index]?.link;

    if (menuItemLink) {
      navigation.navigate('WebViewerHome', {
        link: menuItemLink,
        newPage: true,
        notifWindow: true,
        accountNo: accountNo,
      });
    } else {
      //
    }
  };

  const renderItem = ({item}: {item: NotificationItem}): React.JSX.Element => {
    const NotifTime = NmGetNotifTime(item.Recdate);
    const NotifType = NmGetNotifAbbreviation(item.NotifType);

    return (
      <TouchableOpacity
        style={[styles.mainNotifContaimer, {borderBottomColor: theme.notifBorderColor}]}
        key={item.ReferenceID}
        onPress={() => {
          try {
            navigateTo(item.NotifType, item.AccountNo);
          } catch (e) {}
        }}
        onLongPress={() => {
          if (Platform.OS === 'android') {
            ToastAndroid.show(item.Title, ToastAndroid.SHORT);
          }
        }}>
        {/* <View style={{margin: 10}}>
          <View style={[styles.menuNotifProf, {backgroundColor: theme.notifTypeColor}]}>
            <Text style={styles.menuNotifProfAbbr}>{NotifType}</Text>
          </View>
        </View> */}
        <View style={styles.notifTextContainer}>
          <Text style={[styles.menuNotifName, {color: theme.notifContentTitleTextColor}]}>{item.Title}</Text>
          <Text style={[styles.menuNotifText, {color: theme.notifContentTextColor}]}>{item.Message}</Text>
          <Text style={[styles.menuNotifMin, {color: theme.notifTimeTextColor}]}>{NotifTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: thirdLayout ? theme.statusBar : theme.notifModalBackgroundColor}}>
      <TouchableWithoutFeedback
        onPress={() => {
          flatListRef.current?.scrollToOffset({animated: true, offset: 0});
        }}>
        <View
          style={[
            styles.titleContainer,
            {
              borderBottomColor: theme.notifBorderColor,
              borderTopColor: theme.notifBorderColor,
              backgroundColor: thirdLayout ? theme.statusBar : theme.notifModalBackgroundColor,
            },
          ]}>
          {!thirdLayout && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
              }}
              style={{marginHorizontal: 10, backgroundColor: '#F0F4F9', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
              <MaterialCommunityIcons name={'arrow-left'} size={20} color={'#516DF6'} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, {color: theme.notifFooterTextColor, marginBottom: -2, marginLeft: thirdLayout ? 12 : 0, fontSize: thirdLayout ? 24 : 18}]}>Push Notifications</Text>
        </View>
      </TouchableWithoutFeedback>

      {NoUnread ? (
        <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.notifModalBackgroundColor}}>
          <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20, opacity: 0.2, color: theme.notifNoUnread}}>No Notifications</Text>
        </View>
      ) : (
        <View style={{flex: 1, backgroundColor: thirdLayout ? theme.statusBar : theme.notifModalBackgroundColor}}>
          <FlatList<NotificationItem>
            ref={flatListRef}
            data={consoNotifs}
            renderItem={renderItem}
            keyExtractor={(item: NotificationItem): string => item.ReferenceID}
            //ListEmptyComponent={}
            onRefresh={(): void => {
              setListRefreshing(true);
              NmRefreshAllNotifications(recuser, notifManager).then((result: any) => {
                setListRefreshing(false);
              });
            }}
            onEndReached={({distanceFromEnd}: {distanceFromEnd: number}): void => {
              setListRefreshing(true);
              NmLoadMoreNotifications(recuser, notifManager).then((result: any) => {
                setListRefreshing(false);
              });
            }}
            refreshing={listRefreshing}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainNotifContaimer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderBottomWidth: 0.5,
  },
  notifTextContainer: {
    alignItems: 'baseline',
    flex: 1,
    width: '100%',
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  wrap: {
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    width: '95%',
    height: '50%',
    position: 'absolute',
    top: 55,
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1974D1',
    borderColor: 'gray',
    borderBottomWidth: 0.5,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  menuNotifProf: {
    backgroundColor: '#F4A74B',
    borderRadius: 30,
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuNotifProfAbbr: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  menuNotifName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  menuNotifText: {
    fontSize: 14,
    textAlign: 'justify',
    marginVertical: 3,
    flexShrink: 1,
    fontFamily: 'Poppins-Regular',
  },
  menuNotifMin: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  menuNotifViewAllBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 0.3,
    borderTopColor: 'black',
  },
  menuNotifViewAllBtnText: {
    color: '#4c5d72',
    fontWeight: '500',
    fontSize: 18,
  },
});

export default NotificationScreen;

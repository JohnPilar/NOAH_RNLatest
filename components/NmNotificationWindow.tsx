import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity, TouchableWithoutFeedback, Image, FlatList, DimensionValue} from 'react-native';

import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions.tsx';
import {navigate} from '../navigation/NavigationRef.tsx';
import notifee from '@notifee/react-native';

import {NmRefreshAllNotifications, NmLoadMoreUnreadNotifications, NmGetNotifTime} from '../functions/NmFunctions.tsx';
import {ThemesContext} from '../functions/ThemeContext.tsx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AccountDetailsContext, AppConfigContext, NotificationsContext} from '../functions/Contexts.tsx';

export default function NmNotificationWindow() {
  const {theme} = useContext(ThemesContext);
  const {notifManager, recuser} = useContext(AccountDetailsContext);
  const {notificationsList, setNotificationsList} = useContext(NotificationsContext);
  const {AssetManager} = useContext(AppConfigContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const flatListRef = useRef<FlatList<any>>(null);

  const [listRefreshing, setListRefreshing] = useState<boolean>(false);
  const [consoNotifs, setConsoNotifs] = useState<Array<any>>([]);
  const [filteredNotifs, setFilteredNotifs] = useState<Array<any>>([]);

  const [iOSWrapTop, setIOSWrapTop] = useState(76);
  const [notifWindowWidth, setNotifWindowWidth] = useState<DimensionValue>('95%');
  const [notifWindowHeight, setNotifWindowHeight] = useState<DimensionValue>('80%');
  const [notifWindowLeft, setNotifWindowLeft] = useState<DimensionValue>(10);
  const orientation = useDeviceOrientation();

  const noUnread = consoNotifs?.length <= 0 ? true : false;

  useEffect(() => {
    const sortedArray = [...notifManager?.userNotifications, ...notificationsList] as any;

    if (sortedArray?.length > 0) {
      sortedArray.sort((a: any, b: any) => {
        const dateA = new Date(a.Recdate).getTime();
        const dateB = new Date(b.Recdate).getTime();

        return dateB - dateA; // Newest first
      });
    }

    setConsoNotifs(sortedArray);
  }, [notifManager?.userNotifications, notificationsList]);

  useEffect(() => {
    const filteredArray = consoNotifs.filter((item: any) => item?.Read == 0);

    setFilteredNotifs(filteredArray);
  }, [consoNotifs]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (DeviceInfo.hasNotch()) {
        setIOSWrapTop(106);
      } else {
        if (DeviceInfo.isTablet()) {
          setIOSWrapTop(80);
        }
      }
    }

    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setNotifWindowWidth('47%');
        setNotifWindowHeight('50%');
        setNotifWindowLeft('52%');
      } else {
        setNotifWindowWidth('36%');
        setNotifWindowHeight('80%');
        setNotifWindowLeft('63%');
      }
    }
  }, [orientation]);

  const navigateTo = (menuItem: any, accountNo: any) => {
    let index = AssetManager.drawerItems.findIndex((p: any) => p.title == menuItem);
    let menuItemLink = AssetManager.drawerItems[index]?.link;

    if (menuItemLink) {
      setModalVisible(false);
      navigate('WebViewerHome', {
        link: menuItemLink,
        newPage: true,
        accountNo: accountNo,
      });
    }
  };

  // const deleteItemById = id => {
  //   const filteredData = NotifList.filter(item => item.ReferenceID !== id);
  //   NmMarkNotificationRead(id).then(result => {
  //     //if (result) {
  //     setNoUnread(filteredData.length == 0 ? true : false);
  //     global.UnreadNotificationList = filteredData;
  //     setNotifList(filteredData);
  //     //}
  //   });
  // };

  const markNotificationRead = async (notifID: any) => {
    try {
      const newUnreadListOne = [...notifManager?.userNotifications];
      const newUnreadListTwo = [...notificationsList];

      const markIndexOne = newUnreadListOne.findIndex((item: any) => item?.ReferenceID == notifID);
      const markIndexTwo = newUnreadListTwo.findIndex((item: any) => item?.ReferenceID == notifID);

      if (markIndexOne != -1) {
        newUnreadListOne[markIndexOne] = {...newUnreadListOne[markIndexOne], Read: 1};
        notifManager.setUserNotifications(newUnreadListOne);
      }

      if (markIndexTwo != -1) {
        newUnreadListTwo[markIndexTwo] = {...newUnreadListTwo[markIndexTwo], Read: 1};
        setNotificationsList(newUnreadListTwo);
      }

      await notifee.cancelNotification(notifID);
    } catch (e) {
      console.log('MarkErr', e);
    }
  };

  const renderItem = ({item}: any) => {
    const NotifTime = NmGetNotifTime(item.Recdate);

    return (
      <TouchableOpacity
        style={[styles.mainNotifContainer, {borderColor: theme.notifBorderColor}]}
        onPress={() => {
          markNotificationRead(item.ReferenceID);
          try {
            //deleteItemById(item.ReferenceID);
            navigateTo(item?.NotifType, item?.AccountNo);
          } catch (e) {}
        }}>
        <View style={styles.notifTextContainer}>
          <Text style={[styles.menuNotifName, {color: theme.notifContentTitleTextColor}]}>{item.Title}</Text>
          <Text style={[styles.menuNotifText, {color: theme.notifContentTextColor}]}>{item.Message}</Text>
          <Text style={[styles.menuNotifMin, {color: theme.notifTimeTextColor}]}>{NotifTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Modal
        propagateSwipe={true}
        isVisible={modalVisible}
        backdropOpacity={0.1}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        style={{alignItems: 'center', margin: 0}}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setModalVisible(!modalVisible)}>
        <View
          style={[
            styles.wrap,
            theme.notifBorderSettings,
            {
              height: noUnread ? '25%' : notifWindowHeight,
              backgroundColor: theme.notifModalBackgroundColor,
              top: useSafeAreaInsets().top + 60,
              width: notifWindowWidth,
              left: notifWindowLeft,
            },
          ]}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (noUnread == false) {
                flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
              }
            }}>
            <View style={[styles.titleContainer, {borderBottomColor: theme.notifBorderColor}]}>
              <Text style={[styles.title, {color: theme.notifHeaderTextColor}]}>Unread Notifications</Text>
            </View>
          </TouchableWithoutFeedback>

          {noUnread ? (
            <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, opacity: 0.2, color: theme.notifNoUnread, fontFamily: 'Poppins-Regular'}}>{'No New Notifications'}</Text>
            </View>
          ) : (
            <View style={{width: '100%', flexShrink: 1, flex: 1}} onStartShouldSetResponder={() => true}>
              <FlatList
                ref={flatListRef}
                contentContainerStyle={{flexGrow: 1, height: '100%'}}
                data={filteredNotifs}
                renderItem={renderItem}
                keyExtractor={item => item.ReferenceID}
                onRefresh={() => {
                  setListRefreshing(true);
                  NmRefreshAllNotifications(recuser, notifManager).then(() => {
                    //setNotifList(notifManager.userUnreadNotifications);
                    setListRefreshing(false);
                  });
                }}
                onEndReached={() => {
                  // if (distanceFromEnd > 0) return;

                  setListRefreshing(true);
                  NmLoadMoreUnreadNotifications(recuser, notifManager).then(() => {
                    //setNotifList(notifManager.userUnreadNotifications);
                    setListRefreshing(false);
                  });
                }}
                refreshing={listRefreshing}
              />
            </View>
          )}
          <View style={[styles.menuNotifViewAllBtn, {borderTopColor: theme.notifBorderColor}]}>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => {
                navigate('NotificationScreen');
                setModalVisible(false);
              }}>
              <Text style={[styles.menuNotifViewAllBtnText, {color: theme.notifFooterTextColor}]}>See All Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/Icons/component_notification_icon.png')} style={[{tintColor: '#FFF', width: 25, height: 25}]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainNotifContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderBottomWidth: 0.3,
    flexShrink: 1,
    paddingVertical: 10,
  },
  notifTextContainer: {
    alignItems: 'baseline',
    flex: 1,
    flexGrow: 1,
    marginHorizontal: 15,
  },
  wrap: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    paddingBottom: 0,
    alignItems: 'center',
    alignContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 1,
    shadowRadius: 4,
    elevation: 10,
    position: 'absolute',
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1974D1',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginLeft: 15,
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    borderTopWidth: 0.3,
    borderTopColor: 'black',
  },
  menuNotifViewAllBtnText: {
    fontFamily: 'Poppins-Regular',
    color: '#4c5d72',
    fontWeight: '500',
    fontSize: 18,
  },
  seeAllButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

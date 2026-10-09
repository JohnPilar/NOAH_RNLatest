import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, DimensionValue} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Modal, {Animations} from 'react-native-modal';
import {useDeviceOrientation} from '../functions/NmFunctions';

import {ThemesContext} from '../functions/ThemeContext';
import {AccountDetailsContext} from '../functions/Contexts';
import NmDropdown from './NmDropdown';
import {LoadingPanel} from './NmLoadingComponents';

interface NmProfileModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setLogoutVisible: (visible: boolean) => void;
  singleUser?: boolean;
  customFirstHeader?: string;
  customSecHeader?: string;
  animationIn?: Animations;
  animationOut?: Animations;
}

export default function NmProfileModal(props: NmProfileModalProps): React.JSX.Element {
  const {modalVisible, setModalVisible, setLogoutVisible, singleUser, customFirstHeader, customSecHeader, animationIn, animationOut} = props;
  const {propertyName, userAccounts, currentAccount, setCurrentAccount, recuser, recname, lastLogin} = useContext(AccountDetailsContext);
  const {theme} = useContext(ThemesContext);

  const navigation = useNavigation();

  const [logoutClicked, setLogoutClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [iOSWrapTop, setIOSWrapTop] = useState<number>(76);
  const [notifWindowWidth, setNotifWindowWidth] = useState<DimensionValue>('95%');
  const [notifWindowLeft, setNotifWindowLeft] = useState<DimensionValue>(10);
  const orientation = useDeviceOrientation();

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
        setNotifWindowLeft('52%');
      } else {
        setNotifWindowWidth('36%');
        setNotifWindowLeft('63%');
      }
    }
  }, [orientation]);

  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onModalHide={() => {
          if (logoutClicked == true) {
            setLogoutClicked(false);
            setLogoutVisible(true);
          }
        }}
        backdropOpacity={0.1}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        style={{alignItems: 'center', margin: 0}}
        //backdropColor={'white'}
        animationIn={animationIn ?? 'slideInRight'}
        animationOut={animationOut ?? 'slideOutRight'}
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setModalVisible(!modalVisible)}>
        <View style={[styles.wrap, {backgroundColor: theme.notifModalBackgroundColor, top: Platform.OS === 'ios' ? iOSWrapTop : 55, width: notifWindowWidth, left: notifWindowLeft}]}>
          {loading ? <LoadingPanel panelStyle={{borderRadius: 6}} /> : null}

          <View style={{backgroundColor: '#1974D1', width: '100%', paddingVertical: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, justifyContent: 'center'}}>
            <Text style={{marginLeft: 15, fontFamily: 'Poppins-Regular', fontSize: 18, color: '#FFF'}}>{'My Profile'}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, width: '100%', marginLeft: 20}}>
            <Image
              source={require('../assets/testuser.png')}
              style={[
                {
                  resizeMode: 'cover',
                  width: 50,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 100,
                },
              ]}
            />
            <View style={{marginLeft: 10, marginTop: 1}}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.drawerUserTextColor}}>{recname}</Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 13, color: theme.drawerUserTextColor}}>{recuser}</Text>
            </View>
          </View>
          <View style={{width: '100%', paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{flex: 1}}>
              <Text style={[styles.menuUserSubInfoText, {color: theme.nkProfileInfoText}]}>{customFirstHeader == undefined ? 'Property' : customFirstHeader}</Text>
              <Text style={[styles.menuUserSubInfoText, {color: theme.nkProfileInfoText}]}>{customSecHeader == undefined ? 'Log Time' : customSecHeader}</Text>
              <Text style={[styles.menuUserSubInfoText, {color: theme.nkProfileInfoText}]}>Account No</Text>
            </View>
            <View style={{flex: 1.8, alignItems: 'flex-end'}}>
              <Text style={[styles.menuUserSubInfoText2, {color: theme.nkProfileInfoText}]} numberOfLines={1}>
                {propertyName}
              </Text>
              <Text style={[styles.menuUserSubInfoText2, {color: theme.nkProfileInfoText}]}>{lastLogin}</Text>
              {singleUser == true ? (
                <Text style={[styles.menuUserSubInfoText2, {color: theme.nkProfileInfoText}]}>{recuser}</Text>
              ) : (
                <NmDropdown
                  items={userAccounts}
                  value={currentAccount}
                  setValue={value => {
                    setLoading(true);
                    setCurrentAccount(value);
                    setLoading(false);
                    setModalVisible(false);
                    navigation.navigate('Home' as never);
                  }}
                  containerStyle={{height: 25, width: 140, marginBottom: 5}}
                  selectedValueStyle={{marginTop: 1, color: theme.dropDownText, fontSize: 14}}
                  iconStyle={{width: 14, height: 14}}
                />
              )}
            </View>
          </View>
          <View style={{width: '100%', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EBEBEB', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.logOutContainer}
              onPress={() => {
                setLogoutClicked(true);
                setModalVisible(false);
              }}>
              <MaterialCommunityIcons style={{marginBottom: 3, marginRight: 5}} name="login-variant" size={25} color={theme.nkProfileLogoutText} />
              <Text style={[styles.logoutText, {color: theme.nkProfileLogoutText}]}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 1,
    shadowRadius: 4,
    elevation: 10,
    position: 'absolute',
    top: 55,
    left: DeviceInfo.getDeviceType().toUpperCase() == 'TABLET' ? '52%' : null,
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  headerBanner: {
    width: '100%',
    height: 170,
    opacity: 0.5,
  },
  menuUserInfo: {
    padding: 10,
  },
  menuUserNameText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 22,
  },
  menuUserTypeText: {
    color: '#657688',
    fontWeight: '700',
    fontSize: 20,
  },
  modalContainerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flexDirection: 'row',
    width: '30%',
    marginVertical: 5,
  },
  menuUserSubInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#657688',
    padding: 10,
  },
  menuUserSubInfo1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuUserSubInfoText: {
    color: '#13151B',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  menuUserSubInfoText2: {
    color: '#13151B',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  logOutContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  logoutIcon: {
    resizeMode: 'contain',
    width: 30,
    marginVertical: 5,
    marginRight: 3,
  },
  logoutText: {
    fontFamily: 'Poppins-Regular',
    color: '#657688',
    fontSize: 15,
  },
});

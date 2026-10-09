import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Modal, Pressable} from 'react-native';

import {Text} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {ThemesContext} from '../functions/ThemeContext';

import Colors from '../constants/Colors';
import {APP_CONST} from '../constants/NmConstants';

import {NmDrawerItem, NmDropdown, LoadingScreen, NmLogoutModal} from '../components';
import {navigate} from './NavigationRef';
import {ConfigDetails} from '../functions/NmAppConfig';

export interface DrawerContentProps {
  visible: boolean;
  onClose: () => void;
}

const DrawerContent = ({visible, onClose}: DrawerContentProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {v9Link, AssetManager} = useContext(AppConfigContext);
  const {propertyName, userAccounts, currentAccount, setCurrentAccount, setHeaderTitle, recuser, recname, noahStandard} = useContext(AccountDetailsContext);

  const [loading, setLoading] = useState<boolean>(false);

  const drawerItems = AssetManager.drawerItems;

  const [menuItems, setMenuItems] = useState<any[]>(drawerItems);
  const [menuLevel, setMenuLevel] = useState<any[]>([]);
  const [isSubMenu, setIsSubMenu] = useState<boolean>(false);
  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);

  const drawerRef = useRef<React.ComponentRef<typeof View>>(null);

  const [iOSHdrMargin, setiOSHdrMargin] = useState<number>(-20);
  const [iosLeftMargin, setIosLeftMargin] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (DeviceInfo.hasNotch()) {
        setiOSHdrMargin(-60);
      }
    }
  }, []);

  function navigateTo(link: string, linkProps: Record<string, any> = {}) {
    onClose();
    navigate('WebViewerHome', {
      link: link,
      newPage: true,
      ...linkProps,
    });
  }

  function handleNavigateScreen(screenName: string, title?: string) {
    onClose();
    if (title !== undefined) {
      setHeaderTitle(title);
    }
    navigate(screenName);
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        {/* Backdrop overlay touch to dismiss */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Drawer Side Panel */}
        <View style={[styles.container, {backgroundColor: theme.drawerBackgroundColor}]} ref={drawerRef}>
          <NmLogoutModal visible={logoutVisible} setVisible={setLogoutVisible} />
          {loading && <LoadingScreen />}

          {/* Drawer Header */}
          <View
            style={{
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: '#E0DFE4',
              marginBottom: ConfigDetails().AppType === APP_CONST.APP_TYPE_APPROVER ? 10 : undefined,
            }}>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                marginTop: 10,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={theme.logo.loadingComp}
                style={{
                  width: 160,
                  height: 100,
                  resizeMode: 'contain',
                  marginTop: -10,
                  marginBottom: -20,
                }}
              />
              <TouchableOpacity onPress={onClose} style={{padding: 10}}>
                <Image source={require('../assets/Icons/drawer_close.png')} style={{width: 30, height: 30, marginRight: 20}} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Selector (Portal Mode) */}
          {ConfigDetails().AppType === APP_CONST.APP_TYPE_PORTAL && (
            <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
              <View style={{marginLeft: 5, marginTop: 10, marginBottom: 2}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14,
                    color: theme.drawerUserTextColor,
                  }}>
                  Account No.
                </Text>
              </View>
              <NmDropdown
                items={userAccounts}
                value={currentAccount}
                setValue={(value: string) => {
                  setLoading(true);
                  setCurrentAccount(value);
                  onClose();
                  navigate('Home');
                  setLoading(false);
                }}
                selectedValueStyle={{marginTop: 3, color: theme.drawerUserTextColor}}
                containerStyle={{height: 36}}
              />
            </View>
          )}

          {/* Scrollable Items Container (replacing DrawerContentScrollView) */}
          <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
            <View style={styles.drawerContent}>
              <View
                style={{
                  marginTop: Platform.OS === 'ios' ? iOSHdrMargin : -10,
                  marginLeft: Platform.OS === 'ios' ? iosLeftMargin : 0,
                }}>
                {isSubMenu && (
                  <TouchableOpacity
                    onPress={() => {
                      let a = [...menuLevel];
                      let lastIndex = a.length - 1;

                      if (a[lastIndex] === drawerItems) {
                        setMenuItems(drawerItems);
                        setMenuLevel([]);
                        setIsSubMenu(false);
                      } else {
                        setMenuLevel(a);
                        setMenuItems(menuLevel[lastIndex]);
                        a.pop();
                        setMenuLevel(a);
                      }
                    }}
                    style={styles.backButton}>
                    <MaterialCommunityIcons name={'keyboard-backspace'} size={20} color={'#36559B'} />
                    <Text style={{color: theme.color, marginLeft: 5}}>Back</Text>
                  </TouchableOpacity>
                )}

                <View>
                  {menuItems.map((item, index) => {
                    return (
                      <NmDrawerItem
                        key={index}
                        iconName={item.iconName}
                        title={item.title}
                        type={'1'}
                        textStyle={{
                          color: theme.drawerItemTextColor,
                          fontFamily: 'Poppins-Regular',
                          fontSize: 13,
                        }}
                        disabled={item.disabled}
                        customClick={() => {
                          if (item.subMenu) {
                            setMenuItems(item.subMenu);
                            setIsSubMenu(true);
                            setMenuLevel([...menuLevel, menuItems]);
                          } else {
                            if (!item.disabled) {
                              if (item.itemID === 'PMONotifications') {
                                handleNavigateScreen('NotificationScreen');
                                return;
                              }
                              if (item.itemID === 'PMONews') {
                                handleNavigateScreen('UnderConstructionAN');
                                return;
                              }
                              if (item.itemID === 'PMOFAQ') {
                                handleNavigateScreen('UnderConstructionAN');
                                return;
                              }

                              if (item.hasOwnProperty('screenName')) {
                                let HeaderTitle = item.title === 'Home' ? '' : propertyName;
                                handleNavigateScreen(item.screenName, HeaderTitle ?? '');
                              } else if (item.hasOwnProperty('link')) {
                                setHeaderTitle(propertyName ?? '');
                                setMenuItems(drawerItems);
                                setMenuLevel([]);
                                setIsSubMenu(false);

                                if (noahStandard === 'CUSTOM') {
                                  let HeaderTitle = item.title === 'Home' ? '' : propertyName;
                                  setHeaderTitle(HeaderTitle ?? '');
                                  navigateTo(item.link);
                                  return;
                                }

                                switch (item.itemID) {
                                  case 'SCMS_UTG':
                                  case 'SCMS_URA':
                                    navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU, {devMode: true});
                                    break;
                                  case 'SCMS_PDE':
                                    navigateTo(
                                      'https://scms.promptus8.com/SCMS_NLT/Menuitem?nsc=KyEPuIeG6c4sYdp7ZwcShqdipPUgSk8SwustQQZqiSPfXNXKDga/AwKMr6ai1xPv&nsu=uCCavAAGxAAGOgsKwpkJ3lnKRyHI6g/lduDk/N5MEn1DlBufh1OlZ4iNwPlNa1CRYCzzxp&plink=urBs3LxCWY6xcTgCHNiwdNS538VXDuA9PK3QcMPoKWDFbLDhy4wfmgkATCr7wOwwxuPTN0Up414Zq6ghsDoiusDMZ1fSaWpWhZHzEmPCsX7pFUF/eQpm/vVvW4HTN2IPqUrj20NL16BSMVxMSTusng==&nmid=00Z4xdc8cHEyIVrB8hwbGI/AAGxAAG8Dupm3m9G/E4JU9UCgk=&ntitle=GdDW38Nm45Pg0UMlwssULDYkw75YL6CAAGxAAGNAVFeD2Y7Lk=&nver=xM8T2ArrhzymxwOQ7KCscA==',
                                      {menuCode: item.itemID},
                                    );
                                    break;
                                  case 'HRTICKET_COMPANY':
                                  case 'HRTICKET_PROJECT':
                                    navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU, {menuCode: item.itemID});
                                    break;
                                  default:
                                    if (item.itemID?.includes('SCMS_HRMI')) {
                                      navigateTo(item.link, {menuCode: item.itemID});
                                      break;
                                    }

                                    try {
                                      if (v9Link === true) {
                                        navigateTo(ConfigDetails().BaseLinkURL + item.link);
                                      } else {
                                        navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU, {menuCode: item.itemID});
                                      }
                                    } catch (e) {
                                      navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU);
                                    }
                                    break;
                                }
                              } else {
                                throw 'Missing both the screenName and subMenu in the navigation item: ' + item.title;
                              }
                            }
                          }
                        }}
                      />
                    );
                  })}

                  {ConfigDetails().AppType === APP_CONST.APP_TYPE_APPROVER && (
                    <TouchableOpacity
                      onPress={() => {
                        setHeaderTitle('Privacy Policy');
                        navigateTo('https://fli.promptus8.com/FLI_ApproversPortal/MW/DataSetup/PrivacyPolicy/PrivacyPolicy.aspx');
                      }}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 23,
                        marginTop: 0,
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}>
                      <Image source={require('../assets/DrawerIcons/drawer-privacy.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                      <Text
                        style={{
                          color: theme.drawerItemTextColor,
                          marginLeft: 24,
                          fontFamily: 'Poppins-Regular',
                          fontSize: 13,
                        }}>
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                  )}

                  {ConfigDetails().AppType === APP_CONST.APP_TYPE_APPROVER && (
                    <TouchableOpacity
                      onPress={() => {
                        setHeaderTitle('Terms and Conditions');
                        navigateTo('https://fli.promptus8.com/FLI_ApproversPortal/MW/DataSetup/TermsAndCondition/TermsAndCondition.aspx');
                      }}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 23,
                        marginTop: 0,
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}>
                      <Image source={require('../assets/DrawerIcons/drawer-tacs.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                      <Text
                        style={{
                          color: theme.drawerItemTextColor,
                          marginLeft: 24,
                          fontFamily: 'Poppins-Regular',
                          fontSize: 13,
                        }}>
                        Terms and Conditions
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      handleNavigateScreen('SettingsScreen', propertyName ?? '');
                    }}
                    style={{
                      flexDirection: 'row',
                      marginLeft: 24,
                      marginTop: 0,
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Image source={require('../assets/Icons/drawer_settings.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                    <Text
                      style={{
                        color: theme.drawerItemTextColor,
                        marginLeft: 24,
                        fontFamily: 'Poppins-Regular',
                        fontSize: 13,
                      }}>
                      Settings
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Drawer Footer (User Info & Logout) */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: '#E0DFE4',
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/testuser.png')}
                style={{
                  resizeMode: 'cover',
                  width: 40,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: 40,
                }}
              />
              <View style={{marginLeft: 20, marginTop: 1}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: theme.drawerUserTextColor,
                  }}>
                  {recname}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 11,
                    color: theme.drawerUserTextColor,
                  }}>
                  {recuser}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setLogoutVisible(true)}>
              <Image source={require('../assets/Icons/drawer_logout.png')} style={{width: 40, height: 40, tintColor: '#466dc6'}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    width: '80%',
    maxWidth: 340,
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  drawerContent: {
    flex: 1,
  },
  backButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxImage: {
    width: 25,
    height: 25,
    tintColor: '#7A95D6',
  },
});

export default DrawerContent;

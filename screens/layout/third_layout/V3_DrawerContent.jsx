import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';

import {Text} from 'react-native-paper';
import {DrawerContentScrollView, useDrawerStatus} from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';
import {EventRegister} from 'react-native-event-listeners';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import {WINDOW_HEIGHT} from '../../../constants/NmStyles';
import {AccountDetailsContext, AppConfigContext} from '../../../functions/Contexts';
import {ThemesContext} from '../../../functions/ThemeContext';

import {NmGetPropertyName} from '../../../functions/NmFunctions';
import {APP_CONST} from '../../../constants/NmConstants';
import {NmDrawerItem, NmDropdown, LoadingScreen, NmLogoutModal} from '../../../components';
import {navigate} from '../../../navigation/NavigationRef';
import {ConfigDetails} from '../../../functions/NmAppConfig';

const V2_DrawerContent = props => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemesContext);
  const {v9Link, AssetManager} = useContext(AppConfigContext);
  const {propertyName, userAccounts, currentAccount, setCurrentAccount, setHeaderTitle, recuser, recname, noahStandard} = useContext(AccountDetailsContext);

  const [loading, setLoading] = useState(false);

  const drawerItems = AssetManager.drawerItems;

  const [menuItems, setMenuItems] = useState(drawerItems);
  const [menuLevel, setMenuLevel] = useState([]);
  const [isSubMenu, setIsSubMenu] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const drawerRef = useRef(null);

  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    if (!isDrawerOpen) {
      setModalVisible(false);
    }
  }, [isDrawerOpen]);

  const [iOSHdrMargin, setiOSHdrMargin] = useState(-20);
  const [iosLeftMargin, setIosLeftMargin] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (DeviceInfo.hasNotch()) {
        setiOSHdrMargin(-60);
        //setIosLeftMargin(-5);
      }
    }
  }, []);

  function navigateTo(link, linkProps = {}) {
    navigate('WebViewerHome', {
      link: link,
      newPage: true,
      ...linkProps,
    });
  }

  return (
    <View style={{flex: 1, backgroundColor: undefined, justifyContent: 'flex-end'}}>
      <View style={[styles.container, {backgroundColor: '#AAA'}]} ref={drawerRef}>
        <NmLogoutModal visible={logoutVisible} setVisible={setLogoutVisible}></NmLogoutModal>
        {loading && <LoadingScreen />}
        <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E0DFE4', marginBottom: ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER ? 10 : null}}>
          <View style={{width: '100%', justifyContent: 'space-between', marginTop: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={theme.logo.drawer} style={{width: 160, height: 100, resizeMode: 'contain', marginTop: -10, marginBottom: -20}} />
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={{padding: 10}}>
              <Image source={require('../../../assets/Icons/drawer_close.png')} style={{width: 30, height: 30, marginRight: 20}} />
              {/* <MaterialCommunityIcons style={{marginRight: 20}} name="close-circle-outline" size={30} color={'#466DC6'} /> */}
            </TouchableOpacity>
          </View>
        </View>
        {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
          <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
            <View style={{marginLeft: 5, marginTop: 10, marginBottom: 2}}>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.drawerUserTextColor}}>Account No.</Text>
            </View>
            <NmDropdown items={userAccounts} value={currentAccount} setValue={setCurrentAccount} selectedValueStyle={{marginTop: 3, color: theme.drawerUserTextColor}} containerStyle={{height: 36}} />
          </View>
        )}
        <DrawerContentScrollView {...props} style={{}}>
          <View style={[styles.drawerContent, {}]}>
            <View style={{marginTop: Platform.OS === 'ios' ? iOSHdrMargin : -40, marginLeft: Platform.OS === 'ios' ? iosLeftMargin : 0}}>
              {isSubMenu && (
                <TouchableOpacity
                  onPress={() => {
                    let a = [...menuLevel];
                    let lastIndex = a.length - 1;

                    if (a[lastIndex] == drawerItems) {
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
                  <MaterialCommunityIcons style={{}} name={'keyboard-backspace'} size={20} color={'#36559B'} />
                  {/* <Ionicons name="chevron-back" size={20} color={theme.color} /> */}
                  <Text style={[styles.preferenceColors, {color: theme.color, marginLeft: 5}]}>Back</Text>
                </TouchableOpacity>
              )}
              <ScrollView>
                {menuItems.map((item, index) => {
                  return (
                    <NmDrawerItem
                      key={index}
                      iconName={item.iconName}
                      title={item.title}
                      type={'1'}
                      textStyle={{color: '#1974D1', fontFamily: 'Poppins-Regular', fontSize: 13}}
                      disabled={item.disabled}
                      customClick={() => {
                        if (item.subMenu) {
                          setMenuItems(item.subMenu);
                          setIsSubMenu(true);

                          setMenuLevel([...menuLevel, menuItems]);
                        } else {
                          if (!item.disabled) {
                            setModalVisible(false);

                            if (item.itemID == 'PMONotifications') {
                              navigate('NotificationScreen');
                              return;
                            }

                            if (item.itemID == 'PMONews') {
                              navigate('UnderConstructionAN');
                              return;
                            }
                            if (item.itemID == 'PMOFAQ') {
                              navigate('UnderConstructionAN');
                              return;
                            }

                            if (item.hasOwnProperty('screenName')) {
                              let HeaderTitle = item.title == 'Home' ? '' : propertyName;
                              setHeaderTitle(HeaderTitle);

                              navigate(item.screenName);
                            } else if (item.hasOwnProperty('link')) {
                              setMenuItems(drawerItems);
                              setMenuLevel([]);
                              setIsSubMenu(false);

                              if (noahStandard == 'CUSTOM') {
                                let HeaderTitle = item.title == 'Home' ? '' : propertyName;
                                setHeaderTitle(HeaderTitle);
                                navigateTo(item.link);
                                return;
                              }

                              if (item.itemID == 'SCMS_UTG') {
                                navigateTo(ConfigDetails().BaseLinkURL + item.link, {devMode: true});
                              } else if (item.itemID == 'SCMS_PDE') {
                                navigateTo(
                                  'https://scms.promptus8.com/SCMS_NLT/Menuitem?nsc=KyEPuIeG6c4sYdp7ZwcShqdipPUgSk8SwustQQZqiSPfXNXKDga/AwKMr6ai1xPv&nsu=uCCavAAGxAAGOgsKwpkJ3lnKRyHI6g/lduDk/N5MEn1DlBufh1OlZ4iNwPlNa1CRYCzzxp&plink=urBs3LxCWY6xcTgCHNiwdNS538VXDuA9PK3QcMPoKWDFbLDhy4wfmgkATCr7wOwwxuPTN0Up414Zq6ghsDoiusDMZ1fSaWpWhZHzEmPCsX7pFUF/eQpm/vVvW4HTN2IPqUrj20NL16BSMVxMSTusng==&nmid=00Z4xdc8cHEyIVrB8hwbGI/AAGxAAG8Dupm3m9G/E4JU9UCgk=&ntitle=GdDW38Nm45Pg0UMlwssULDYkw75YL6CAAGxAAGNAVFeD2Y7Lk=&nver=xM8T2ArrhzymxwOQ7KCscA==',
                                  {menuCode: item.itemID},
                                );
                              } else if (item.itemID == 'HRTICKET_COMPANY' || item.itemID == 'HRTICKET_PROJECT') {
                                navigateTo(ConfigDetails().BaseLinkURL + item.link, {menuCode: item.itemID});
                              } else if (item.itemID == 'NOAH_CHAT') {
                                navigate('MessageList');
                              } else {
                                if (v9Link == true) {
                                  navigateTo(ConfigDetails().BaseLinkURL + item.link);
                                } else {
                                  navigateTo(item.link + APP_CONST.WEB_QS_NWTKU);
                                }
                              }
                            } else {
                              throw 'Missing both the screenName and subMenu in the navigation item: ' + item.title;
                            }

                            // if (item.title === 'Request Tracker') {
                            //   navigate('TransactionHistory');
                            // } else {

                            // }
                          }
                        }
                      }}
                    />
                  );
                })}
                {ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER && (
                  <TouchableOpacity
                    onPress={() => {
                      setHeaderTitle('Privacy Policy');
                      navigate('WebViewerHome', {
                        link: 'https://fli.promptus8.com/FLI_ApproversPortal/MW/DataSetup/PrivacyPolicy/PrivacyPolicy.aspx',
                        newPage: true,
                      });
                    }}
                    style={{flexDirection: 'row', marginLeft: 23, marginTop: 0, alignItems: 'center', paddingVertical: 10}}>
                    {/* <Icon name="cog-outline" color={'#7A95D6'} size={25} /> */}
                    <Image source={require('../../../assets/DrawerIcons/drawer-privacy.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                    <Text style={{color: theme.drawerItemTextColor, marginLeft: 24, fontFamily: 'Poppins-Regular', fontSize: 13}}>Privacy Policy</Text>
                  </TouchableOpacity>
                )}
                {ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER && (
                  <TouchableOpacity
                    onPress={() => {
                      setHeaderTitle('Terms and Conditions');
                      navigate('WebViewerHome', {
                        link: 'https://fli.promptus8.com/FLI_ApproversPortal/MW/DataSetup/TermsAndCondition/TermsAndCondition.aspx',
                        newPage: true,
                      });
                    }}
                    style={{flexDirection: 'row', marginLeft: 23, marginTop: 0, alignItems: 'center', paddingVertical: 10}}>
                    {/* <Icon name="cog-outline" color={'#7A95D6'} size={25} /> */}
                    <Image source={require('../../../assets/DrawerIcons/drawer-tacs.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                    <Text style={{color: theme.drawerItemTextColor, marginLeft: 24, fontFamily: 'Poppins-Regular', fontSize: 13}}>Terms and Conditions</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    navigate('SettingsScreen');
                  }}
                  style={{flexDirection: 'row', marginLeft: 24, marginTop: 0, alignItems: 'center', paddingVertical: 10}}>
                  {/* <Icon name="cog-outline" color={'#7A95D6'} size={25} /> */}
                  <Image source={require('../../../assets/Icons/drawer_settings.png')} style={[styles.boxImage, {tintColor: '#36559B'}]} />
                  <Text style={{color: theme.drawerItemTextColor, marginLeft: 24, fontFamily: 'Poppins-Regular', fontSize: 13}}>Settings</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </DrawerContentScrollView>
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
              source={require('../../../assets/testuser.png')}
              style={[
                {
                  resizeMode: 'cover',
                  width: 40,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: 40,
                },
              ]}
            />
            <View style={{marginLeft: 20, marginTop: 1}}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.drawerUserTextColor}}>{recname}</Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 11, color: theme.drawerUserTextColor}}>{recuser}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setLogoutVisible(true);
            }}>
            <Image source={require('../../../assets/Icons/drawer_logout.png')} style={{width: 40, height: 40, tintColor: '#466dc6'}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT * 0.6,
  },
  dropDownList: {
    //borderTopWidth: 0.5,
    borderColor: 'black',
    marginTop: 40,
    paddingHorizontal: 10,
    width: '100%',
    height: 110,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  picker: {
    flex: 1,
    backgroundColor: 'gray',
    height: 20,
  },
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    //marginTop: Platform.OS === 'ios' ? -40 : 15,
    marginTop: Platform.OS === 'ios' ? -40 : 15,
  },
  buttonDrawerSection: {
    marginBottom: 0,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    marginLeft: Platform.OS === 'ios' ? 0 : 6,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerItem: {
    padding: -200,
    margin: 0,
    backgroundColor: 'orange',
    justifyContent: 'center',
  },
  searchBar: {
    height: 42,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  modulesContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 4,
    alignItems: 'center',
  },
  modules: {
    fontFamily: 'AbadiMTStd',
    marginLeft: 10,
    fontSize: 18,
  },
  backButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxImage: {
    width: 25,
    height: 25,
    tintColor: '#7A95D6',
  },
});

export default V2_DrawerContent;

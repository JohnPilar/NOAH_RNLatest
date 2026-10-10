import {useState, useEffect, useContext} from 'react';

import {View, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AccNoContext, TabsContext, PropertyNameContext, AccountDetailsContext, AppConfigContext} from '../../../functions/Contexts';
import {ThemesContext} from '../../../functions/ThemeContext';
import NmStyles, {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../constants/NmStyles';
import {NmDropdown, NmDrawerItem, NmLabel} from '../../../components';
import {NmGetPropertyName, NmGetTimeStamp} from '../../../functions/NmFunctions';
import {useNavigation} from '@react-navigation/native';
import {APP_CONST, THEME_STYLE} from '../../../constants/NmConstants';
import {navigate} from '../../../navigation/NavigationRef';

var XDate = require('xdate');

const MenuContext = props => {
  const {v9Link, AssetManager} = useContext(AppConfigContext);
  const {recname} = useContext(AccountDetailsContext);
  const {setVisible, style} = props;
  const {propertyName, userAccounts, currentAccount, setCurrentAccount, noahStandard} = useContext(AccountDetailsContext);
  const {theme} = useContext(ThemesContext);
  const navigation = useNavigation();

  const drawerItems = AssetManager?.drawerItems;

  const [menuLevel, setMenuLevel] = useState([]);
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);

  const [menuItems, setMenuItems] = useState(drawerItems);

  const [newScreenName, setNewScreenName] = useState();
  const {tabList, setTabList, setActiveTabKey, setShowNavbar, bookmarks, removeBookmark, actHistory} = useContext(TabsContext);

  const createAndNavigate = tabObject => {
    actHistory({
      dateTime: new XDate().toString('yyyy-MM-dd'),
      title: tabObject.title,
      link: tabObject.link,
    });

    const tmpTabs = [...tabList];
    tmpTabs.push(tabObject);
    setTabList(tmpTabs);
    setNewScreenName(tabObject.key);
  };

  useEffect(() => {
    if (newScreenName) {
      const isNewScreenRegistered = tabList.some(tab => tab.key == newScreenName);
      const screenIndex = tabList.findIndex(tab => tab.key == newScreenName);

      if (isNewScreenRegistered) {
        navigation.navigate(newScreenName); //, {otherLink: tabList[screenIndex].otherLink, webLink: tabList[screenIndex].webLink});
        setNewScreenName(null);
        setActiveTabKey(tabList[screenIndex]);
        setVisible(false);
      }
    }
  }, [tabList.length, newScreenName, navigation]);

  function navigateScreen(destination, props = {}) {
    setShowNavbar(false);
    setVisible(false);
    navigate(destination, props);
  }

  function navigateWeb(title, link, linkProps = {}) {
    const keyName = NmGetTimeStamp();
    const tabObject = {
      key: keyName + '',
      tabKey: keyName + '',
      title: title,
      snapshot: undefined,
      //otherLink: true, //For Testing non NOAH links
      //webLink: 'link', //For Testing non NOAH links
      link: link,
      ...linkProps,
    };

    createAndNavigate(tabObject);
  }

  return (
    <Animated.View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 3, bottom: 0}} entering={FadeInDown.duration(80)} exiting={FadeOutDown.duration(80)}>
      <TouchableOpacity style={{flex: 1, backgroundColor: undefined}} activeOpacity={1} onPress={() => setVisible(false)}></TouchableOpacity>
      <View style={[{paddingHorizontal: 8, width: WINDOW_WIDTH, position: 'absolute', bottom: 0, zIndex: 4}, style]}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: WINDOW_HEIGHT * 0.7,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.panelBorder,
            backgroundColor: theme.panelBackground,
            paddingTop: 12,
            overflow: 'hidden',
          }}>
          <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 8}}>
            <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#1974D1'}]} autoCapitalize="characters">
              {recname.toUpperCase()}
            </NmLabel>
          </View>
          <View style={{width: '100%', paddingHorizontal: 16}}>
            <NmDropdown
              items={userAccounts}
              value={currentAccount}
              setValue={setCurrentAccount}
              componentStyle={THEME_STYLE.STYLE_THIRD}
              label={'Account'}
              labelStyle={{fontSize: 14, color: theme.textColor}}
              selectedValueStyle={{color: '#1974D1', fontSize: 16}}
            />
          </View>
          <View style={{width: '100%', marginTop: 8, paddingHorizontal: 16}}>
            <NmDropdown
              items={userAccounts}
              value={currentAccount}
              setValue={setCurrentAccount}
              componentStyle={THEME_STYLE.STYLE_THIRD}
              label={'Module'}
              labelStyle={{fontSize: 14, color: theme.textColor}}
              selectedValueStyle={{color: '#1974D1', fontSize: 16}}
            />
          </View>
          <View style={{height: 1, width: '100%', backgroundColor: theme.panelLine, marginTop: 16, marginBottom: 8}} />

          {/* MENU ITEM SECTION START */}
          {activeMenu == 0 && (
            <View style={{flex: 1}}>
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
              <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16}}>
                <View style={{flex: 1}}>
                  {menuItems.map((item, index) => {
                    return (
                      <NmDrawerItem
                        key={index}
                        iconName={item.iconName}
                        title={item.title}
                        type={'1'}
                        textStyle={[NmStyles.fontOpenSans.regular, {color: theme.listTextColor, fontSize: 14, marginTop: -2}]}
                        disabled={item.disabled}
                        containerStyle={{paddingHorizontal: 0}}
                        itemContainerStyle={{marginLeft: 0}}
                        customClick={() => {
                          if (item.subMenu) {
                            setMenuItems(item.subMenu);
                            setIsSubMenu(true);

                            setMenuLevel([...menuLevel, menuItems]);
                          } else {
                            if (!item.disabled) {
                              if (item.itemID == 'PMONotifications') {
                                navigateScreen('NotificationScreen');
                                return;
                              }

                              if (item.itemID == 'PMONews') {
                                navigateScreen('UnderConstructionAN');
                                return;
                              }
                              if (item.itemID == 'PMOFAQ') {
                                navigateScreen('UnderConstructionAN');
                                return;
                              }

                              // Main navigation code
                              if (item.hasOwnProperty('screenName')) {
                                let HeaderTitle = item.title == 'Home' ? '' : propertyName;
                                EventRegister.emit('UpdateHeaderTitle', HeaderTitle);

                                navigateScreen(item.screenName);
                              } else if (item.hasOwnProperty('link')) {
                                setMenuItems(drawerItems);
                                setMenuLevel([]);
                                setIsSubMenu(false);

                                // For Client with Multiple Companies
                                if (noahStandard == 'CUSTOM') {
                                  let HeaderTitle = item.title == 'Home' ? '' : propertyName;
                                  EventRegister.emit('UpdateHeaderTitle', HeaderTitle);
                                  navigateWeb(item.title, item.link);
                                  return;
                                }

                                // NOAH Standard
                                if (item.itemID == 'SCMS_UTG') {
                                  navigateWeb(item.title, ConfigDetails().BaseLinkURL + item.link, {devMode: true});
                                } else if (item.itemID == 'SCMS_PDE') {
                                  navigateWeb(
                                    item.title,
                                    'https://scms.promptus8.com/SCMS_NLT/Menuitem?nsc=KyEPuIeG6c4sYdp7ZwcShqdipPUgSk8SwustQQZqiSPfXNXKDga/AwKMr6ai1xPv&nsu=uCCavAAGxAAGOgsKwpkJ3lnKRyHI6g/lduDk/N5MEn1DlBufh1OlZ4iNwPlNa1CRYCzzxp&plink=urBs3LxCWY6xcTgCHNiwdNS538VXDuA9PK3QcMPoKWDFbLDhy4wfmgkATCr7wOwwxuPTN0Up414Zq6ghsDoiusDMZ1fSaWpWhZHzEmPCsX7pFUF/eQpm/vVvW4HTN2IPqUrj20NL16BSMVxMSTusng==&nmid=00Z4xdc8cHEyIVrB8hwbGI/AAGxAAG8Dupm3m9G/E4JU9UCgk=&ntitle=GdDW38Nm45Pg0UMlwssULDYkw75YL6CAAGxAAGNAVFeD2Y7Lk=&nver=xM8T2ArrhzymxwOQ7KCscA==',
                                    {menuCode: item.itemID},
                                  );
                                } else if (item.itemID == 'HRTICKET_COMPANY' || item.itemID == 'HRTICKET_PROJECT') {
                                  navigateWeb(item.title, ConfigDetails().BaseLinkURL + item.link, {menuCode: item.itemID});
                                } else if (item.itemID == 'NOAH_CHAT') {
                                  navigateScreen('MessageList');
                                } else {
                                  if (v9Link == true) {
                                    navigateWeb(item.title, ConfigDetails().BaseLinkURL + item.link);
                                  } else {
                                    navigateWeb(item.title, item.link + APP_CONST.WEB_QS_NWTKU);
                                  }
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
                </View>
              </ScrollView>
            </View>
          )}
          {/* MENU ITEM SECTION END */}

          {/* MENU ITEM SECTION START */}
          {activeMenu == 1 && (
            <View style={{flex: 1}}>
              {bookmarks?.length > 0 ? (
                <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16}}>
                  {bookmarks.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          navigateWeb(item.title, item.url);
                        }}>
                        <View style={[{flexDirection: 'row', marginVertical: 1, paddingHorizontal: 4, alignItems: 'center', marginLeft: 0}]}>
                          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingVertical: 8}}>
                            <MaterialCommunityIcons name="bookmark" size={22} color={'#3366cc'} style={{paddingRight: 3}} />
                            <NmLabel style={[NmStyles.fontOpenSans.regular, {color: theme.listTextColor, fontSize: 14, marginTop: -2, marginLeft: 25}]}>{item.title}</NmLabel>
                          </View>
                          <TouchableOpacity
                            style={{padding: 8}}
                            onPress={() => {
                              removeBookmark(index);
                            }}>
                            <MaterialCommunityIcons name="close" size={22} color={'#3366cc'} style={{paddingRight: 3}} />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <NmLabel style={[NmStyles.fontOpenSans.regular, {color: '#AAAAAA88'}]}>{'No Bookmarks Yet'}</NmLabel>
                </View>
              )}
            </View>
          )}
          {/* MENU ITEM SECTION END */}

          <View style={{height: 1, width: '100%', backgroundColor: theme.panelLine, marginTop: 2}} />
          <View style={styles.subButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.subButtons}
              onPress={() => {
                setActiveMenu(0);
              }}>
              <NmLabel style={activeMenu == 0 ? [NmStyles.fontOpenSans.bold, {color: '#1974D1', fontSize: 14}] : [NmStyles.fontOpenSans.regular, {color: '#8f8f8fc0', fontSize: 14}]}>
                {'Menu Items'}
              </NmLabel>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.subButtons}
              onPress={() => {
                setActiveMenu(1);
              }}>
              <NmLabel style={activeMenu == 1 ? [NmStyles.fontOpenSans.bold, {color: '#1974D1', fontSize: 14}] : [NmStyles.fontOpenSans.regular, {color: '#8f8f8fc0', fontSize: 14}]}>
                {'Bookmarks'}
              </NmLabel>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subButtonContainer: {width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 0},
  subButtons: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkItem: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MenuContext;

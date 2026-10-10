import {useState, useContext, useEffect} from 'react';

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ClearCache from '@type-any/react-native-clear-cache';

import {TabsContext, ReloadContext} from '../../../functions/Contexts';
import NmStyles, {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {NmLabel} from '../../../components';
import AppScreenContent from './V3_MenuItemStack';
import MenuContext from './MenuContext';
import MenuOptions from './MenuOptions';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {ThemesContext} from '../../../functions/ThemeContext';

const Drawer = createDrawerNavigator();

const V3_MenuItemNavigator = props => {
  const tabHeight = props.route.params?.tabHeight;
  const {theme} = useContext(ThemesContext);

  const [navBarHeight, setNavbarHeight] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const {tabList, showNavbar, isBookmarked, actBookmark} = useContext(TabsContext);
  const {triggerReload} = useContext(ReloadContext);

  const [actMessage, setActMessage] = useState('');

  const clearAppCache = async () => {
    await ClearCache.clearCacheDir().then(() => {
      setOptionsVisible(false);
      setActMessage('Cache cleared.');
    });
  };

  return (
    <View style={{flex: 1, paddingTop: useSafeAreaInsets().top, backgroundColor: theme.statusBar}}>
      <Drawer.Navigator
        screenOptions={{
          drawerInactiveTintColor: '#555',
          swipeEnabled: false,
        }}>
        <Drawer.Screen
          name=" "
          component={AppScreenContent}
          options={{
            headerShown: false,
            drawerPosition: 'right',
          }}
        />
      </Drawer.Navigator>
      {optionsVisible && <MenuOptions visible={optionsVisible} setVisible={setOptionsVisible} style={{marginBottom: navBarHeight + 8}} navigation={props.navigation} clearCache={clearAppCache} />}
      {menuVisible && <MenuContext visible={menuVisible} setVisible={setMenuVisible} style={{marginBottom: navBarHeight + 8}} navigation={props.navigation} />}
      <BottomNavBar
        theme={theme}
        isVisible={showNavbar}
        isBookmarked={isBookmarked}
        navigation={props.navigation}
        tabHeight={tabHeight}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        optionsVisible={optionsVisible}
        setOptionsVisible={setOptionsVisible}
        setNavbarHeight={setNavbarHeight}
        tabCount={tabList?.length}
        webReload={triggerReload}
        actBookmark={actBookmark}
        actMessage={actMessage}
        setActMessage={setActMessage}
      />
    </View>
  );
};

const BottomNavBar = ({theme, navigation, setNavbarHeight, setMenuVisible, menuVisible, optionsVisible, setOptionsVisible, tabCount, webReload, tabHeight, isVisible, isBookmarked, actBookmark, actMessage, setActMessage}) => {
  const insets = useSafeAreaInsets();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (actMessage != '') {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setActMessage('');
      }, 5000);
    }
  }, [actMessage]);

  const NavBarButtons = [
    {destination: 'ActBookmark', icon: isBookmarked ? 'bookmark-check' : 'bookmark-plus-outline', title: 'Bookmark'},
    {destination: 'ActReload', icon: 'reload', title: 'Reload'},
    {destination: 'Menu', icon: 'menu', title: 'Menu'},
    {destination: 'ActTabs', icon: 'application-outline', title: 'Tabs'},
    {destination: 'ActOptions', icon: 'cog-outline', title: 'Options'},
  ];

  return (
    <>
      {showMessage && (
        <Animated.View
          style={{position: 'absolute', bottom: tabHeight, zIndex: 0, width: '100%', backgroundColor: '#1974D1', paddingVertical: 2, alignItems: 'center'}}
          entering={FadeInDown.duration(500)}
          exiting={FadeOutDown.duration(500)}>
          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 12, color: '#FFF'}]}>{actMessage}</NmLabel>
        </Animated.View>
      )}
      <View
        onLayout={event => {
          const {x, y, width, height} = event.nativeEvent.layout;
          setNavbarHeight(height);
        }}
        style={[styles.bottomNavbar, {paddingBottom: insets.bottom, height: tabHeight, display: isVisible ? 'flex' : 'none', zIndex: 1, backgroundColor: theme.toolbar}]}>
        {NavBarButtons.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              activeOpacity={0.4}
              onPress={() => {
                switch (item.destination) {
                  case 'ActBookmark':
                    actBookmark();
                    break;
                  case 'ActReload':
                    webReload();
                    break;
                  case 'Menu':
                    setMenuVisible(!menuVisible);
                    break;
                  case 'ActTabs':
                    navigation.navigate('TabsScreen');
                    break;
                  case 'ActOptions':
                    setOptionsVisible(!optionsVisible);
                    break;
                }
              }}
              style={[{alignItems: 'center', width: WINDOW_WIDTH / 5, alignSelf: 'center', marginTop: -4}]}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  padding: 4,
                }}>
                <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={24} color={'#1974D1'} />
                <NmLabel style={{fontSize: 10, marginTop: -8, marginBottom: 4, color: theme.toolbarText}}>{item.title}</NmLabel>
                {item.destination == 'ActTabs' && (
                  <View style={{position: 'absolute', marginLeft: 0, marginTop: -9}}>
                    <NmLabel style={[NmStyles.fontOpenSans.regular, {color: theme.toolbarText, fontSize: 12}]}>{tabCount}</NmLabel>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNavbar: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 0,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 10,
    marginTop: 1,
  },
});

export default V3_MenuItemNavigator;

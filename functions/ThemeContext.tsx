import React, {createContext, useEffect, useState} from 'react';
import {NmGetSetting, NmSaveSetting} from './NmFunctions';
import {APP_KEYS} from '../constants';
import {useColorScheme} from 'react-native';

export const themes = {
  light: {
    name: 'light',
    webTheme: 0,
    color: '#000',
    backgroundColor: '#FFF',
    drawerBackgroundColor: '#FFF', //28396F+
    drawerItemTextColor: '#13151B',
    drawerUserTextColor: '#13151B',
    homeDrawerBackgroundColor: '#133561',
    welcomeImageColor: ['#28396f', '#1e6dc3'],
    welcomeGreetingsColor: '#000',
    homeBackgroundColor: '#F1F6F5',
    homeIconBorderColor: '#EEEEEE',
    homeIconBackgroundColor: '#FFF',
    homeIconClickedColor: '#ECF2FF',
    homeIconTextColor: '#1974D1',
    homeIconDisabledColor: '#FFF',
    notifModalBackgroundColor: '#FFF',
    notifHeaderTextColor: '#FFF',
    notifFooterTextColor: '#13151B',
    notifContentTitleTextColor: '#1974D1',
    notifContentTextColor: '#5F5E5E',
    notifTimeTextColor: '#5F5E5E',
    notifTypeColor: '#F4A74B',
    notifBorderColor: '#EBEBEB',
    notifBorderSettings: {borderColor: 'gray', borderWidth: 0},
    notifNoUnread: '#000',
    notifScreenHeaderBGColor: '#FFF',
    nkProfileUserTextColor: '#333',
    nkProfileLogoutText: '#1974D1',
    nkProfileInfoText: '#13151B',
    nkHelpTitle: '#4c5d72',
    nkHelpSubtext: '#000',
    colors: {
      border: 'transparent',
    },
    dropDownText: '#13151B',
    loginBackgroundColor: '#FFF',
    loginHelpText: '#000',
    loginScanIcon: '#28396F',
    tooltipBackground: '#FFF',
    tooltipControls: '#F0F4F9',
    endointLine: '#777',
    endointText: '#777',
    buttonColor: '#2E7FF9',

    // Registration Screens
    regOpsBackground: '#FFF',
    regBackground: '#FFF',
    regCustType: '#EEE',
    regNextButtonText: '#FFF',
    regBackButton: '#FFF',
    regWebBackground: '#FFF',

    // OTP Mobile Screen
    otpmBackground: '#FFF',
    otpmTextBorder: '#E0DFE4',
    otpmTextColor: '#466DC6',
    otpmTextBackground: '#FFF',

    // New Layout Variables
    statusBar: '#FAFAFA',
    toolbar: '#FFF',
    toolbarText: '#1974D1',
    screenBackground: '#FAFAFA',
    panelBackground: '#FFF',
    panelBorder: '#d1d1d1ff',
    panelLine: '#d3d3d3ff',
    textColor: '#000',
    listTextColor: '#1974D1',
    tabBorder: '#E0DFE4',
    logo: {
      splash: require('../assets/Logos/light_logoSplash.png'),
      login: require('../assets/Logos/light_logoLogin.png'),
      loginMain: require('../assets/Logos/light_logoLoginMain.png'),
      loadingComp: require('../assets/Logos/light_logoLoadingComp.png'),
      drawer: require('../assets/Logos/light_logoDrawer.png'),
    },
    logopBackground: require('../assets/Images/light_logopBackground.jpg'),
    splashBackground: '#fffffff3',
    splashLoading: '#e9ecef',
    splashBorder: '#FFF',
    splashBar: '#133561',
    loadingPanelBackground: '#FFFFFFAA',

    biometricYes: '',
    biometricLater: '#FFF',
    biometricNo: '#FFF',
    biometricLogoBorder: '#FFF',
    biometricLogoColor: '#FFF',
    biometricLine: '#FFF',
    biometricText: '#FFF',
    biometricPromptHeader: '#1974D1',
    biometricPromptBackground: '#FFF',

    // Dropdown Component
    drawerTextItem: '#000',
    dropdownBackground: '#FFF',
    dropdownBackgroundDisabled: '#EEE',
    dropdownBorder: '#E0DFE4',
    dropdownSeparator: '#f4f4f4',
    dropdownListBackground: '#FFF',

    // NOAH Calendar Component/Picker
    calendarBorder: '#AAA',
    calendarBackground: '#FFF',
    calendarMonth: '#333',
    calendarArrows: '#133561',
    calendarWeek: '#EEE',
    calendarWeekBorder: '#FFF',
    calendarDayBorder: '#e9e9e9ff',
    calendarDay: '#000',
    calendarDayDiffMonth: '#DDD',
    calendarDaySelected: '#133561cc',
    calendarDaySelectedDiffMonth: '#13356133',

    // Lookup Component
    lookupBorder: '#E0DFE4',
    lookupBackground: '#FFF',
    lookupButton: '#2E7FF9',
    lookupText: '#000',
    lookupWindowHeader: '#195999',
    lookupWindowBackground: '#FAFAFA',
    lookupWindowSearch: '#FFF',
    lookupWindowSearchText: '#000',
    lookupWindowSearchBorder: '#CCC',
    lookupWindowSearchButton: '#195999',
    lookupWindowItemBackground: 'transparent',
    lookupWindowItemBorder: '#CCC',
    lookupWindowPageButton: '#195999',

    // Add To List Component
    atlBackground: '#f2f7fd',
    atlTextBackground: '#FFF',
    atlTextItemBackground: '#e4ecf7',
    atlTextBorder: '#c3c3c3',
    atlWindowHeader: '#195999',
    atlWindowBackground: '#FAFAFA',
    atlWindowSearch: '#FFF',
    atlWindowSearchText: '#000',
    atlWindowSearchBorder: '#CCC',
    atlWindowSearchButton: '#195999',
    atlWindowItemBackground: 'transparent',
    atlWindowItemBorder: '#CCC',
    atlWindowPageButton: '#195999',

    // File Picker Component
    fpBackground: '#FFF',
    fpBorder: '#E0DFE4',
    fpText: '#A4A8B0',
    fpButtonBorder: '#BFD3FF',
    fpButtonColor: '#FFF',
    fpButtonText: '#000',

    // Gallery Picker Component
    gpBackground: '#FFF',
    gpBorder: '#E0DFE4',
    gpText: '#A4A8B0',
    gpButtonBorder: '#BFD3FF',
    gpButtonColor: '#FFF',
    gpButtonText: '#000',

    // Checkbox/RadioButton Text
    chkradText: '#000',

    // Side Alert
    saBackground: '#FFFFFFFD',
    saBorder: '#d8d8d8ff',
    saCloseButton: '#55555577',

    // Tab Component
    tabBackground: '#f2f7fd',
    tabHeader: '#000',
    tabContentBackground: '#FFF',
    tabNameInactive: '#a5a5a5ff',
    tabCompBorder: '#195999',

    // Remarks Window Component
    rmkHeader: '#195999',
    rmkBackground: '#FFF',

    // Messaging  screen
    chatListBackground: '#f4f4f4',
    chatListItem: '#FFF',
    chatListFloatingBtn: '#FFF',
    chatListWriteIcon: '#133561',
    chatBubbleSent: '#133561',
    chatBubbleSentFont: '#FFF',
    chatBubbleReceived: '#c7c7c7',
    chatBubbleReceivedFont: '#000',
    chatListTextInput: '#FFF',
    chatListTextInputText: '#000',
    chatSendButton: '#FFF',

    spreadListBackground: '#FFF',
    spreadListItemFirstRow: '#DCE2FF',
    spreadListItemFirstRowPressed: '#2E7FF9',
    spreadListItemBackground: '#f2f7fd',
    spreadListLookupBackground: 'cyan',
    spreadListItemCode: '#848484',
    spreadListItemDescription: '#000',

    spreadGridHeaderBackground: '#DCE2FF',
    spreadGridHeader: '#000',
    spreadGridItemBackground: '#f2f7fdcc',
    spreadGridData: '#000',

    toastBackground: '#FFF',
    toastBorder: '#E0DFE4',
    emptyNewsBackground: '#FFF',
    emptyNewsText: '#CCC',
  },
  dark: {
    name: 'dark',
    webTheme: 1,
    color: '#FFF',
    backgroundColor: '#18191a',
    drawerBackgroundColor: '#333436',
    drawerItemTextColor: '#FFF',
    drawerUserTextColor: '#FFF',
    homeDrawerBackgroundColor: '#133561',
    welcomeImageColor: ['#333436', '#333436'],
    welcomeGreetingsColor: '#FFF',
    homeBackgroundColor: '#18191b',
    homeIconBorderColor: '#333436',
    homeIconBackgroundColor: '#333436',
    homeIconClickedColor: '#4d4e51',
    homeIconTextColor: '#CCC',
    homeIconDisabledColor: '#222',
    notifModalBackgroundColor: '#333436',
    notifHeaderTextColor: '#FFF',
    notifFooterTextColor: '#DDD',
    notifContentTitleTextColor: '#FFF',
    notifContentTextColor: '#EEE',
    notifTimeTextColor: '#AAA',
    notifTypeColor: '#28396F',
    notifBorderColor: '#EBEBEB',
    notifBorderSettings: {borderColor: 'gray', borderWidth: 0.3},
    notifNoUnread: '#FFF',
    notifScreenHeaderBGColor: '#1974D1',
    nkProfileUserTextColor: '#FFF',
    nkProfileLogoutText: '#AAA',
    nkProfileInfoText: '#EEE',
    nkHelpTitle: '#FFF',
    nkHelpSubtext: '#FFF',
    colors: {
      border: 'transparent',
    },
    dropDownText: '#13151B',
    loginBackgroundColor: '#18191a',
    loginHelpText: '#e7e7e7ff',
    loginScanIcon: '#133561CC',
    tooltipBackground: '#242526',
    tooltipControls: '#242526',
    endointLine: '#a5a5a5ff',
    endointText: '#a5a5a5ff',
    buttonColor: '#133561',

    // Registration Screens
    regOpsBackground: '#18191a',
    regBackground: '#18191a',
    regCustType: '#3b3d3fff',
    regNextButtonText: '#dfdfdfff',
    regBackButton: '#3b3d3fff',
    regWebBackground: '#18191a',

    // OTP Mobile Screen
    otpmBackground: '#18191a',
    otpmTextBorder: '#133561CC',
    otpmTextColor: '#dfdfdfff',
    otpmTextBackground: '#242526',

    // New Layout Variables
    statusBar: '#18191a',
    toolbar: '#333435ff',
    toolbarText: '#d4d4d4ff',
    screenBackground: '#18191a',
    panelBackground: '#242526',
    panelBorder: '#3a3b3c',
    panelLine: '#3a3b3c',
    textColor: '#e7e7e7ff',
    listTextColor: '#d4d4d4ff',
    tabBorder: '#333435ff',
    logo: {
      splash: require('../assets/Logos/dark_logoSplash.png'),
      login: require('../assets/Logos/dark_logoLogin.png'),
      loginMain: require('../assets/Logos/dark_logoLoginMain.png'),
      loadingComp: require('../assets/Logos/dark_logoLoadingComp.png'),
      drawer: require('../assets/Logos/dark_logoDrawer.png'),
    },
    logopBackground: require('../assets/Images/dark_logopBackground.jpg'),
    splashBackground: '#18191af8',
    splashLoading: '#333435ff',
    splashBorder: '#3a3b3c',
    splashBar: '#1974D1',
    loadingPanelBackground: '#2c2c2caf',

    //
    biometricYes: '',
    biometricLater: '',
    biometricNo: '#d4d4d4ff',
    biometricLogoBorder: '#242526',
    biometricLogoColor: '#a5a5a5ff',
    biometricLine: '#a5a5a5ff',
    biometricText: '#a5a5a5ff',
    biometricPromptHeader: '#133561CC',
    biometricPromptBackground: '#242526',

    // Dropdown Component
    drawerTextItem: '#d4d4d4ff',
    dropdownBackground: '#242526',
    dropdownBackgroundDisabled: '#3a3b3c',
    dropdownBorder: '#333435ff',
    dropdownSeparator: '#18191a',
    dropdownListBackground: '#313131ff',

    // NOAH Calendar Component/Picker
    calendarBorder: '#6e6e6eff',
    calendarBackground: '#242526',
    calendarMonth: '#FAFAFA',
    calendarArrows: '#1974D1',
    calendarWeek: '#3a3b3c',
    calendarWeekBorder: '#6e6e6eff',
    calendarDayBorder: '#6e6e6eff',
    calendarDay: '#FAFAFA',
    calendarDayDiffMonth: '#5c5c5cff',
    calendarDaySelected: '#133561CC',
    calendarDaySelectedDiffMonth: '#5179ad3f',

    // Lookup Component
    lookupBorder: '#333435ff',
    lookupBackground: '#242526',
    lookupButton: '#133561',
    lookupText: '#d4d4d4ff',
    lookupWindowHeader: '#133561',
    lookupWindowBackground: '#242526',
    lookupWindowSearch: '#3a3b3c',
    lookupWindowSearchText: '#d4d4d4ff',
    lookupWindowSearchBorder: '#333435ff',
    lookupWindowSearchButton: '#133561',
    lookupWindowItemBackground: '#18191a',
    lookupWindowItemBorder: '#3a3b3c',
    lookupWindowPageButton: '#1974D1',

    // Add To List Component
    atlBackground: '#242526',
    atlTextBackground: '#3a3b3c',
    atlTextItemBackground: '#242526',
    atlTextBorder: '#838383ff',
    atlWindowHeader: '#133561',
    atlWindowBackground: '#242526',
    atlWindowSearch: '#3a3b3c',
    atlWindowSearchText: '#d4d4d4ff',
    atlWindowSearchBorder: '#333435ff',
    atlWindowSearchButton: '#133561',
    atlWindowItemBackground: '#18191a',
    atlWindowItemBorder: '#3a3b3c',
    atlWindowPageButton: '#1974D1',

    // File Picker Component
    fpBackground: '#242526',
    fpBorder: '#333435ff',
    fpText: '#a5a5a5ff',
    fpButtonBorder: '#333435ff',
    fpButtonColor: '#133561',
    fpButtonText: '#ecececff',

    // Gallery Picker Component
    gpBackground: '#242526',
    gpBorder: '#333435ff',
    gpText: '#a5a5a5ff',
    gpButtonBorder: '#333435ff',
    gpButtonColor: '#133561',
    gpButtonText: '#ecececff',

    // Checkbox/RadioButton Text
    chkradText: '#ecececff',

    // Side Alert
    saBackground: '#242526',
    saBorder: '#6d6d6dff',
    saCloseButton: '#1974D1',

    // Tab Component
    tabBackground: '#242526',
    tabHeader: '#d4d4d4ff',
    tabContentBackground: '#3a3b3c',
    tabNameInactive: '#a5a5a5ff',
    tabCompBorder: '#333435ff',

    // Remarks Window Component
    rmkHeader: '#133561',
    rmkBackground: '#3a3b3c',

    // Messaging  screen
    chatListBackground: '#18191a',
    chatListItem: '#222324',
    chatListFloatingBtn: '#242526',
    chatListWriteIcon: '#1974D1',
    chatBubbleSent: '#133561',
    chatBubbleSentFont: '#FFF',
    chatBubbleReceived: '#333435ff',
    chatBubbleReceivedFont: '#FFF',
    chatListTextInput: '#3a3b3c',
    chatListTextInputText: '#FFF',
    chatSendButton: '#242526',

    spreadListBackground: '#333435',
    spreadListItemFirstRow: '#133561',
    spreadListItemFirstRowPressed: '#2E7FF9',
    spreadListItemBackground: '#333435',
    spreadListLookupBackground: '#02d8d8',
    spreadListItemCode: '#c7c7c7',
    spreadListItemDescription: '#FFF',

    spreadGridHeaderBackground: '#133561EE',
    spreadGridHeader: '#FFF',
    spreadGridItemBackground: '#333435EE',
    spreadGridData: '#FFF',

    toastBackground: '#242526',
    toastBorder: '#133561EE',
    emptyNewsBackground: '#333435EE',
    emptyNewsText: '#5e5e5e',
  },
};

type NOAHTheme = typeof themes.light;

interface ThemeContextType {
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
  theme: NOAHTheme;
}

export const ThemesContext = createContext<ThemeContextType>({} as ThemeContextType);
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const colorScheme = useColorScheme();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    (async () => {
      let savedTheme = await NmGetSetting(APP_KEYS.SETT_APPTHEME);

      if (savedTheme == null || savedTheme == undefined) {
        savedTheme = false; // colorScheme == 'light';
      }

      setDarkTheme(savedTheme);
    })();
  }, []);

  useEffect(() => {
    const newTheme = darkTheme ? themes.dark : themes.light;
    (async () => {
      await NmSaveSetting(APP_KEYS.SETT_APPTHEME, darkTheme);
    })();

    setTheme(newTheme);
  }, [darkTheme]);

  return <ThemesContext.Provider value={{darkTheme, setDarkTheme, theme}}>{children}</ThemesContext.Provider>;
};

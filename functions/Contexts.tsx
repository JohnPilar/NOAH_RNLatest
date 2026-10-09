import React, {createContext, useState, useCallback, useEffect, use} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_KEYS, APP_CONST} from '../constants';
import {NmGetSetting, NmSaveSetting, NmCreateSectionData, NmGetPropertyName, NmClearSetting, NmUpdateUserConfig} from './NmFunctions';
import {APP_ENDPOINT_CONFIGS} from '../constants/NmConstants';

var XDate = require('xdate');

interface IUserConfig {
  value: string;
  label: string;
  comptoken: string;
  v9token: string;
  compcode: string;
  //[key: string]: any;
}

interface IAccountDetailsContext {
  EndpointCurrent: any;
  isLoaded: boolean;
  ctxClearUserData: () => void;
  userAccounts: Array<IUserConfig>;
  setUserAccounts: React.Dispatch<React.SetStateAction<Array<IUserConfig>>>;
  currentAccount: string | undefined;
  setCurrentAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
  v9Token: string | undefined;
  setV9Token: React.Dispatch<React.SetStateAction<string | undefined>>;
  loginToken: string | undefined;
  tokenExpiration: string | undefined;
  companyToken: string | undefined;
  setCompanyToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  companyCode: string | undefined;
  propertyName: string | undefined;
  setPropertyName: React.Dispatch<React.SetStateAction<string | undefined>>;
  headerTitle: string;
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
  recuser: string;
  recname: string;
  lastLogin: string;
  loginSetters: any;
  notifManager: any;
  // Dev Options
  demoMode: boolean;
  setDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  showClearCache: boolean;
  showClearData: boolean;
  noahStandard: string;
  dashboardView: string;
  disableMockCheck: boolean;
}

export const AccountDetailsContext = createContext<IAccountDetailsContext>({} as IAccountDetailsContext);
export const AccountDetailsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const endpointsList_DEFAULT = APP_ENDPOINT_CONFIGS;
  const EndpointCurrent_DEFAULT = {
    Code: APP_CONST.ENDPOINT_CODE_SIT,
    EndpointLink: APP_CONST.ENDPOINT_SIT,
    SecretKey: APP_CONST.ENDPOINTKEY_SIT_UAT,
  };

  const demoMode_DEFAULT = false;
  const showClearCache_DEFAULT = false;
  const showClearData_DEFAULT = false;
  const noahStandard_DEFAULT = 'NOAH';
  const dashboardView_DEFAULT = 'GRID';
  const disableMockCheck_DEFAULT = true;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [demoMode, setDemoMode] = useState<boolean>(demoMode_DEFAULT);
  const [showClearCache, setShowClearCache] = useState<boolean>(showClearCache_DEFAULT);
  const [showClearData, setShowClearData] = useState<boolean>(showClearData_DEFAULT);
  const [noahStandard, setNoahStandard] = useState<string>(noahStandard_DEFAULT);
  const [dashboardView, setDashboardView] = useState<string>(dashboardView_DEFAULT);
  const [disableMockCheck, setDisableMockCheck] = useState<boolean>(disableMockCheck_DEFAULT);

  const [userAccounts, setUserAccounts] = useState<Array<IUserConfig>>([]); // ACCOUNTS UNDER CURRENT USER (POWER-USER)
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(''); // PORTAL NWTKU
  const [v9Token, setV9Token] = useState<string | undefined>(''); // V9 TOKEN FOR V9 LINKS
  const [loginToken, setLoginToken] = useState<string | undefined>(''); // STANDARD NWTKU
  const [tokenExpiration, setTokenExpiration] = useState<string | undefined>(''); // LOGIN TOKEN EXPIRATION
  const [companyToken, setCompanyToken] = useState<string | undefined>(''); // NSC
  const [companyCode, setCompanyCode] = useState<string | undefined>(''); // COMPANY CODE
  const [propertyName, setPropertyName] = useState<string | undefined>(''); // COMPANY/PROEPRTY NAME
  const [headerTitle, setHeaderTitle] = useState<string>(''); // FOR CHANGING HEADER TITLE ON STANDARD LAYOUT

  const [recuser, setRecuser] = useState<string>('');
  const [recname, setRecname] = useState<string>('');
  const [userNotifications, setUserNotifications] = useState<Array<object>>([]);
  const [userUnreadNotifications, setUserUnreadNotifications] = useState<Array<object>>([]);
  const [minDateNotification, setMinDateNotification] = useState<string>('');
  const [minDateUnreadNotification, setMinDateUnreadNotification] = useState<string>('');
  const [lastLogin, setLastLogin] = useState<string>('TIME');

  const [EndpointInit, setEndpointInit] = useState<boolean>(false);
  const [EndpointsList, setEndpointsList] = useState<Array<object>>(endpointsList_DEFAULT);
  const [EndpointCurrent, setEndpointCurrent] = useState<any | undefined>();

  useEffect(() => {
    (async () => {
      let tmpUserNotifications = (await NmGetSetting(APP_KEYS.NOTIF_LIST_ALL)) || [];
      let tmpUserUnreadNotifications = (await NmGetSetting(APP_KEYS.NOTIF_LIST_UNREAD)) || [];
      let tmpMinDateNotification = (await NmGetSetting(APP_KEYS.NOTIF_MINDATE_ALL)) || '';
      let tmpMinDateUnreadNotification = (await NmGetSetting(APP_KEYS.NOTIF_MINDATE_UNREAD)) || '';

      const tempEndpointInit = await NmGetSetting(APP_KEYS.ENDPOINT_INIT);
      const tmpEndpointsList = (await NmGetSetting(APP_KEYS.ENDPOINT_LIST)) || endpointsList_DEFAULT;
      const tmpEndpointCurrent = (await NmGetSetting(APP_KEYS.ENDPOINT_CURRENT)) || EndpointCurrent_DEFAULT;

      // Load defaults first
      setDemoMode(demoMode_DEFAULT);
      setShowClearCache(showClearCache_DEFAULT);
      setShowClearData(showClearData_DEFAULT);
      setNoahStandard(noahStandard_DEFAULT);
      setDashboardView(dashboardView_DEFAULT);
      setDisableMockCheck(disableMockCheck_DEFAULT);

      setUserNotifications(tmpUserNotifications);
      setUserUnreadNotifications(tmpUserUnreadNotifications);
      setMinDateNotification(tmpMinDateNotification);
      setMinDateUnreadNotification(tmpMinDateUnreadNotification);

      setEndpointInit(tempEndpointInit);
      setEndpointsList(tmpEndpointsList);
      setEndpointCurrent(tmpEndpointCurrent);

      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (userAccounts?.length > 0 && currentAccount) {
      const accountDesc = userAccounts.find(item => item.value == currentAccount)?.label;
      const tmpCompanyToken = userAccounts.find(item => item.value == currentAccount)?.comptoken;
      const tmpV9Token = userAccounts.find(item => item.value == currentAccount)?.v9token;
      const tmpCompanyCode = userAccounts.find(item => item.value == currentAccount)?.compcode;

      setCompanyToken(tmpCompanyToken);
      setCompanyCode(tmpCompanyCode);
      setV9Token(tmpV9Token);
      NmSaveSetting(APP_KEYS.ACCESS_COMPTOKEN_CURRENT, tmpCompanyToken);

      const runUserUpdate = async () => {
        await NmUpdateUserConfig(EndpointCurrent?.Code, {AccountToken: currentAccount, CompanyToken: tmpCompanyToken});
      };

      NmGetPropertyName(accountDesc).then(result => {
        try {
          if (typeof result === 'string') {
            setPropertyName(result);
            NmSaveSetting(APP_KEYS.ACCESS_TOKEN_CURRENT, currentAccount);
          } else {
            setPropertyName('NOAH');
          }
        } catch (e) {
          setPropertyName('NOAH');
        }
      });

      runUserUpdate();
    }
  }, [currentAccount, userAccounts]);

  const loginSetters = {
    setUserAccounts: setUserAccounts,
    setCurrentAccount: setCurrentAccount,
    setCompanyToken: setCompanyToken,
    setLoginToken: setLoginToken,
    setTokenExpiration: setTokenExpiration,
    setRecuser: setRecuser,
    setRecname: setRecname,
    setLastLogin: setLastLogin,
    EndpointInit: EndpointInit,
    EndpointsList: EndpointsList,
    setEndpointsList: setEndpointsList,
    EndpointCurrent: EndpointCurrent,
    setDemoMode: setDemoMode,
    setShowClearCache: setShowClearCache,
    setShowClearData: setShowClearData,
    setNoahStandard: setNoahStandard,
    setDashboardView: setDashboardView,
    setDisableMockCheck: setDisableMockCheck,
  };

  const notifManager = {
    userNotifications: userNotifications,
    setUserNotifications: setUserNotifications,
    minDateNotification: minDateNotification,
    setMinDateNotification: setMinDateNotification,
    userUnreadNotifications: userUnreadNotifications,
    setUserUnreadNotifications: setUserUnreadNotifications,
    minDateUnreadNotification: minDateUnreadNotification,
    setMinDateUnreadNotification: setMinDateUnreadNotification,
  };

  function ctxClearUserData() {
    setUserAccounts([]);
    setCurrentAccount(undefined);
    setV9Token(undefined);
    setLoginToken(undefined);
    setTokenExpiration(undefined);
    setCompanyToken(undefined);
    setCompanyCode(undefined);
    setPropertyName(undefined);
    setHeaderTitle('');

    setRecuser('');
    setRecname('');
    setUserNotifications([]);
    setUserUnreadNotifications([]);
    setMinDateNotification('');
    setMinDateUnreadNotification('');
    setLastLogin('TIME');

    (async () => {
      await NmClearSetting(APP_KEYS.ACCESS_ACCOUNT_LIST);
      await NmClearSetting(APP_KEYS.ACCESS_TOKEN_CURRENT);
      await NmClearSetting(APP_KEYS.ACCESS_COMPTOKEN_CURRENT);
      await NmClearSetting(APP_KEYS.NOTIF_LIST_ALL);
      await NmClearSetting(APP_KEYS.NOTIF_LIST_UNREAD);
      await NmClearSetting(APP_KEYS.NOTIF_MINDATE_ALL);
      await NmClearSetting(APP_KEYS.NOTIF_MINDATE_UNREAD);
      await NmClearSetting(APP_KEYS.ACCESS_NAME);
      await NmClearSetting(APP_KEYS.ACCESS_USER);
      await NmClearSetting(APP_KEYS.ACCESS_TOKEN);
      await NmClearSetting(APP_KEYS.ACCESS_TOKEN_EXPIRE);
      await NmClearSetting(APP_KEYS.ACCESS_LOGIN_TIME);
      await NmClearSetting(APP_KEYS.SETT_APPTHEME);

      const endpointUsers = await NmGetSetting(APP_KEYS.ENDPOINT_CREDENTIALS);
      const updatedAccountList = endpointUsers.filter((val: any) => val.EndpointCode != EndpointCurrent.Code);

      if (updatedAccountList.length) {
        await NmSaveSetting(APP_KEYS.ENDPOINT_CREDENTIALS, updatedAccountList);
      } else {
        await NmClearSetting(APP_KEYS.ENDPOINT_CREDENTIALS);
      }
      // Update current list and remove the credentials for the current user
      // await NmClearSetting(APP_KEYS.ENDPOINT_LIST);
    })();
  }

  return (
    <AccountDetailsContext.Provider
      value={{
        EndpointCurrent,
        isLoaded,
        ctxClearUserData,
        userAccounts,
        setUserAccounts,
        currentAccount,
        setCurrentAccount,
        v9Token,
        setV9Token,
        loginToken,
        tokenExpiration,
        companyToken,
        setCompanyToken,
        companyCode,
        propertyName,
        setPropertyName,
        headerTitle,
        setHeaderTitle,
        recuser,
        recname,
        lastLogin,
        loginSetters,
        notifManager,
        demoMode,
        setDemoMode,
        showClearCache,
        showClearData,
        noahStandard,
        dashboardView,
        disableMockCheck,
      }}>
      {children}
    </AccountDetailsContext.Provider>
  );
};

interface IAppConfigContext {
  ctxClearUserConfig: () => void;
  v9Link: boolean;
  setV9Link: React.Dispatch<React.SetStateAction<boolean>>;
  // demoMode: boolean;
  // setDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  // showClearCache: boolean;
  // showClearData: boolean;
  // noahStandard: string;
  // dashboardView: string;
  // disableMockCheck: boolean;
  landingPage: any;
  setLandingPage: React.Dispatch<React.SetStateAction<any>>;
  hideAnnouncement: any;
  setHideAnnouncement: React.Dispatch<React.SetStateAction<any>>;
  biometricAsked: boolean;
  setBiometricAsked: React.Dispatch<React.SetStateAction<boolean>>;
  biometricUse: boolean;
  setBiometricUse: React.Dispatch<React.SetStateAction<boolean>>;
  AssetManager: any;
  enableNotification: boolean;
  setEnableNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppConfigContext = createContext<IAppConfigContext>({} as IAppConfigContext);
export const AppConfigProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const v9Link_DEFAULT = false;
  const demoMode_DEFAULT = false;
  const showClearCache_DEFAULT = false;
  const showClearData_DEFAULT = false;
  const noahStandard_DEFAULT = 'NOAH';
  const dashboardView_DEFAULT = 'GRID';
  const disableMockCheck_DEFAULT = true;
  const landingPage_DEFAULT = null;
  const hideAnnouncement_DEFAULT = null;
  const biometricAsked_DEFAULT = false;
  const biometricUse_DEFAULT = false;
  const dashboardApps_DEFAULT = {};
  const enableNotification_DEFAULT = false;

  const [v9Link, setV9Link] = useState<boolean>(v9Link_DEFAULT);

  // const [demoMode, setDemoMode] = useState<boolean>(demoMode_DEFAULT);
  // const [showClearCache, setShowClearCache] = useState<boolean>(showClearCache_DEFAULT);
  // const [showClearData, setShowClearData] = useState<boolean>(showClearData_DEFAULT);
  // const [noahStandard, setNoahStandard] = useState<string>(noahStandard_DEFAULT);
  // const [dashboardView, setDashboardView] = useState<string>(dashboardView_DEFAULT);
  // const [disableMockCheck, setDisableMockCheck] = useState<boolean>(disableMockCheck_DEFAULT);

  const [landingPage, setLandingPage] = useState<any>(landingPage_DEFAULT);
  const [hideAnnouncement, setHideAnnouncement] = useState<any>(hideAnnouncement_DEFAULT);
  const [biometricAsked, setBiometricAsked] = useState<boolean>(biometricAsked_DEFAULT);
  const [biometricUse, setBiometricUse] = useState<boolean>(biometricUse_DEFAULT);
  const [appAssets, setAppAssets] = useState<any>(dashboardApps_DEFAULT);
  const [enableNotification, setEnableNotification] = useState<boolean>(enableNotification_DEFAULT);
  const [appItems, setAppitems] = useState<any>({});
  const [drawerItems, setDrawerItems] = useState<any>({});

  useEffect(() => {
    (async () => {
      const tmpV9Link = (await NmGetSetting(APP_KEYS.APP_SYSCONFIG_V9LINK)) || v9Link_DEFAULT;
      // const tmpDemoMode = (await NmGetSetting(APP_KEYS.DEVOPS_DEMO_MODE)) || demoMode_DEFAULT;
      // const tmpShowClearCache = (await NmGetSetting(APP_KEYS.DEVOPS_CLEAR_CACHE)) || showClearCache_DEFAULT;
      // const tmpShowClearData = (await NmGetSetting(APP_KEYS.DEVOPS_CLEAR_DATA)) || showClearData_DEFAULT;
      // const tmpNoahStandard = (await NmGetSetting(APP_KEYS.DEVOPS_STANDARD_NOAH)) || noahStandard_DEFAULT; // NOAH or CUSTOM only
      // const tmpDashboardView = (await NmGetSetting(APP_KEYS.DEVOPS_DASHBOARD_VIEW)) || dashboardView_DEFAULT;
      // const tmpDisableMockCheck = (await NmGetSetting(APP_KEYS.DEVOPS_MOCK_SETT)) || disableMockCheck_DEFAULT;
      const tmpLandingPage = (await NmGetSetting(APP_KEYS.APP_SYSCONFIG_LANDING)) || landingPage_DEFAULT;
      const tmpHideAnnouncement = (await NmGetSetting(APP_KEYS.SETT_HIDE_ANNOUNCEMENT)) || hideAnnouncement_DEFAULT;
      const tmpEnableNotification = (await NmGetSetting(APP_KEYS.SETT_PUSHNOTIF)) || false;

      setV9Link(tmpV9Link);
      // setDemoMode(tmpDemoMode);
      // setShowClearCache(tmpShowClearCache);
      // setShowClearData(tmpShowClearData);
      // setNoahStandard(tmpNoahStandard);
      // setDashboardView(tmpDashboardView);
      // setDisableMockCheck(tmpDisableMockCheck);
      setLandingPage(tmpLandingPage);
      setHideAnnouncement(tmpHideAnnouncement);
      setEnableNotification(tmpEnableNotification);
    })();
  }, []);

  const AssetManager = {
    appAssets: appAssets,
    setAppAssets: setAppAssets,
    appItems: appItems,
    setAppitems: setAppitems,
    drawerItems: drawerItems,
    setDrawerItems: setDrawerItems,
    setBiometricAsked: setBiometricAsked,
    setBiometricUse: setBiometricUse,
  };

  function ctxClearUserConfig() {
    setHideAnnouncement(hideAnnouncement_DEFAULT);
    setBiometricAsked(biometricAsked_DEFAULT);
    setBiometricUse(biometricUse_DEFAULT);
    setEnableNotification(enableNotification_DEFAULT);

    (async () => {
      // await NmClearSetting(APP_KEYS.SETT_HIDE_ANNOUNCEMENT);
      // await NmClearSetting(APP_KEYS.APP_BIOMETRIC_ASKED);
      // await NmClearSetting(APP_KEYS.APP_BIOMETRIC_USE);
      // await NmClearSetting(APP_KEYS.SETT_PUSHNOTIF);
    })();
  }

  return (
    <AppConfigContext.Provider
      value={{
        ctxClearUserConfig,
        v9Link,
        setV9Link,
        // demoMode,
        // setDemoMode,
        // showClearCache,
        // showClearData,
        // noahStandard,
        // dashboardView,
        // disableMockCheck,
        landingPage,
        setLandingPage,
        hideAnnouncement,
        setHideAnnouncement,
        biometricAsked,
        setBiometricAsked,
        biometricUse,
        setBiometricUse,
        AssetManager,
        enableNotification,
        setEnableNotification,
      }}>
      {children}
    </AppConfigContext.Provider>
  );
};

interface INotificationsContext {
  notificationsList: any[];
  setNotificationsList: React.Dispatch<React.SetStateAction<any[]>>;
  chatMessages: any[];
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  currentNotification: any;
  setCurrentNotification: React.Dispatch<React.SetStateAction<any>>;
  updateChatList: (newMessage: Record<string, any>) => void;
  updateNotifContext: () => void;
}

export const NotificationsContext = createContext<INotificationsContext>({} as INotificationsContext);
export const NotificationsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [currentNotification, setCurrentNotification] = useState<any | undefined>();
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const tempMessagingData = (await NmGetSetting(APP_KEYS.MESSAGE_CHAT_DATA)) || [];
      const tempMotificationList = (await NmGetSetting(APP_KEYS.MESSAGE_NOTIF_DATA)) || [];

      setChatMessages(tempMessagingData);
      setNotificationsList(tempMotificationList);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (chatMessages.length > 0) {
        await NmSaveSetting(APP_KEYS.MESSAGE_CHAT_DATA, chatMessages);
      }
    })();
  }, [chatMessages]);

  useEffect(() => {
    (async () => {
      if (notificationsList.length > 0) {
        await NmSaveSetting(APP_KEYS.MESSAGE_NOTIF_DATA, notificationsList);
      }
    })();
  }, [notificationsList]);

  async function updateNotifContext() {
    const tempMessagingData = (await NmGetSetting(APP_KEYS.MESSAGE_CHAT_DATA)) || [];
    const tempMotificationList = (await NmGetSetting(APP_KEYS.MESSAGE_NOTIF_DATA)) || [];

    setChatMessages(tempMessagingData);
    setNotificationsList(tempMotificationList);
  }

  const updateChatList = (newMessage: Record<string, any>) => {
    let userID = newMessage.userID;
    let userDesc = newMessage.userDesc;
    let fromUser = newMessage.fromUser;
    let message = newMessage.message;

    interface IMessage {
      [key: string]: any;
    }

    let prevData: IMessage[] = [...chatMessages];
    let userIndex = prevData.findIndex((convo: any) => convo.userID == userID);

    if (userIndex > -1) {
      // Already have previous conversation
      let userMessages = prevData[userIndex].messages;
      userMessages.unshift({
        fromUser: fromUser,
        dateTime: new XDate(),
        message: message,
      });
      prevData[userIndex].messages = userMessages;
      prevData[userIndex].lastUpdate = new XDate();
    } else {
      // New user conversation
      prevData.unshift({
        userID: userID,
        userDesc: userDesc,
        lastUpdate: new XDate(),
        readStatus: true,
        messages: [
          {
            fromUser: fromUser,
            dateTime: new XDate(),
            message: message,
          },
        ],
      });
    }

    setChatMessages(prevData);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notificationsList,
        setNotificationsList,
        chatMessages,
        setChatMessages,
        currentNotification,
        setCurrentNotification,
        updateChatList,
        updateNotifContext,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const ShopCartContext = createContext([]);
export const AppointmentContext = createContext<any>([]);
export const HandymanContext = createContext<any>([]);
export const FoodCartContext = createContext<any>([]);
export const ParkingTicketContext = createContext({});
export const TransportContext = createContext({});
export const LeasingContext = createContext({});

export const MainDemoContext = createContext({});
export const MessagesContext = createContext({});
export const NotifDataContext = createContext({});
export const LocPermissionContext = createContext({});

export const ClockCoordsContext = createContext({});
export const GeoDescContext = createContext({});
export const GeofenceContext = createContext({});
export const TimeSheetContext = createContext({});
export const ClockStatusContext = createContext({});

export const HeaderNameContext = createContext({});
export const HeaderButtonContext = createContext({});

export const NavBarContext = createContext({});
export const WebTabsContext = createContext({});
export const WebTabsActiveContext = createContext({});

export const TabsContext = createContext({});
export const TabsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [tabList, setTabList] = useState<any[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<Record<string, any>>({});
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const [storedHistory, setStoredHistory] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getBookmarks();
    getHistory();
  }, []);

  // BOOKMARK MANAGEMENT
  useEffect(() => {
    if (activeTabKey) {
      const linkSaved = bookmarks.find(item => item['url'].includes(activeTabKey?.link));
      setIsBookmarked(linkSaved ? true : false);
    } else {
      setIsBookmarked(false);
    }
  }, [activeTabKey, bookmarks]);

  async function getBookmarks() {
    const getBookmarks = await AsyncStorage.getItem(APP_KEYS.WEB_BOOKMARKS);
    const savedBookmarks = getBookmarks ? JSON.parse(getBookmarks) : [];
    setBookmarks(savedBookmarks);
  }

  async function actBookmark() {
    if (activeTabKey) {
      const linkSaved = bookmarks.find(item => item['url'].includes(activeTabKey.link));

      if (linkSaved) {
        const delFilter = bookmarks.filter(item => !item['url'].includes(activeTabKey.link));
        await AsyncStorage.setItem(APP_KEYS.WEB_BOOKMARKS, JSON.stringify(delFilter));
      } else {
        const adFilter = [...bookmarks];
        adFilter.push({
          title: activeTabKey.title,
          url: activeTabKey.link,
        });
        await AsyncStorage.setItem(APP_KEYS.WEB_BOOKMARKS, JSON.stringify(adFilter));
      }
      getBookmarks();
    }
  }

  async function removeBookmark(index: number) {
    const tmpBookmarks = [...bookmarks];
    tmpBookmarks.splice(index, 1);
    await AsyncStorage.setItem(APP_KEYS.WEB_BOOKMARKS, JSON.stringify(tmpBookmarks));
    getBookmarks();
  }

  // HISTORY MANAGEMENT
  async function getHistory() {
    // await AsyncStorage.setItem(APP_KEYS.WEB_HISTORY, JSON.stringify([]));
    // return;

    const getHistory = await AsyncStorage.getItem(APP_KEYS.WEB_HISTORY);
    const historyList = getHistory ? JSON.parse(getHistory) : [];
    setStoredHistory(historyList);

    const sectionData = NmCreateSectionData(historyList);
    setHistory(sectionData);
  }

  async function actHistory(historyObject: object) {
    const currentHistory = [...storedHistory];
    currentHistory.unshift(historyObject); // {dateTime, title, link}

    await AsyncStorage.setItem(APP_KEYS.WEB_HISTORY, JSON.stringify(currentHistory));
    getHistory();
  }

  return (
    <TabsContext value={{tabList, setTabList, activeTabKey, setActiveTabKey, showNavbar, setShowNavbar, isBookmarked, bookmarks, actBookmark, removeBookmark, history, actHistory, storedHistory}}>
      {children}
    </TabsContext>
  );
};

export const ReloadContext = createContext({});
export const ReloadProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [shouldReload, setShouldReload] = useState(false);

  const triggerReload = useCallback(() => {
    setShouldReload(true);
  }, []);

  const resetReload = useCallback(() => {
    setShouldReload(false);
  }, []);

  return <ReloadContext.Provider value={{shouldReload, triggerReload, resetReload}}>{children}</ReloadContext.Provider>;
};

export const LoadingContext = createContext({});
export const LoadingProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [loading, setLoading] = useState(false);

  return <LoadingContext.Provider value={{loading, setLoading}}>{children}</LoadingContext.Provider>;
};

import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, Text, Image, StyleSheet, BackHandler, TouchableWithoutFeedback, Linking, Platform, DimensionValue} from 'react-native';

import {ProgressBar} from 'react-native-paper';
import ReactNativeBiometrics from 'react-native-biometrics';
import RNRestart from 'react-native-restart';
import {useDeviceOrientation} from '../functions/NmFunctions.tsx';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';

import {useStyles} from '../functions/Orientation.js';
import {APP_CONST, APP_KEYS} from '../constants/NmConstants.js';
import {
  NmInitializeDrawer,
  NmCreateLocalToken,
  NmInitMobileAssets,
  NmSaveSetting,
  NmClearAppData,
  NmInitializeSettings,
  NmRefreshUnreadNotificationList,
  NmRefreshNotificationList,
  NmHasInternet,
  NmInitEndpoints,
} from '../functions/NmFunctions.tsx';
import {NmStartDatabase, NmSelectApprovalItems, NmInitApprovalDrawerItems} from '../functions/NmDatabase.js';
import {NmAesDecrypt} from '../functions/NmCipher.tsx';

import {NmModal, NmEndpointPrompt, NmEndpointList} from '../components/index.jsx';
import {ThemesContext} from '../functions/ThemeContext.tsx';
import {getEndpointDetails, EndpointSet} from '../functions/NmEndpoint.tsx';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts.tsx';
import {Config} from '../app.config.tsx';
import {ConfigDetails, NOAHConfig} from '../functions/NmAppConfig.tsx';
import {NmGetMobileAppData} from '../functions/NmNetwork.tsx';
import {AssetResult} from '../constructs/interfaces/NmFunctionsInterface.tsx';
import {StackScreenProps} from './NavigationTypes.tsx';

type Props = StackScreenProps<'SplashScreen'>;

const SplashScreen = ({navigation, route}: Props) => {
  const fromNotifClick = route.params?.fromNotifClick;

  const {setV9Link, landingPage, setLandingPage, AssetManager, setBiometricAsked, setBiometricUse} = useContext(AppConfigContext);
  const {isLoaded, recuser, loginToken, notifManager, loginSetters, demoMode} = useContext(AccountDetailsContext);

  const {theme, setDarkTheme} = useContext(ThemesContext);
  const {SetupDone, EndpointCode} = getEndpointDetails();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>();

  interface IupdateAvailable {
    visible: boolean;
    type: number | undefined;
  }

  const [updateAvailable, setUpdateAvailable] = useState<IupdateAvailable>({
    visible: false,
    type: 4,
  });
  const [updatingResource, setUpdatingResource] = useState<boolean>(false);
  const [endpointTitle, setEndpointTitle] = useState<string | undefined>('Change API');
  const [endpointMsg, setEndpointMsg] = useState<string | undefined>('An error occured. change endpoint?\nCurrent endpoint is: ' + EndpointCode);
  const [loadingMsg, setLoadingMsg] = useState<string>();
  const [appContinue, setAppContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [hasInternetConnection, setHasInternetConnection] = useState<boolean>(true);
  const [changeEndpointVisible, setChangeEndpointVisible] = useState<boolean>(false);

  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState<DimensionValue | undefined>('70%');

  const LANDING_DEFAULT = landingPage ? landingPage : 'LoginOptionScreen';
  const pendingDeepLink = useRef<string | null>('');

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    NmHasInternet().then(result => {
      if (result == true) {
        const deepLink = Linking.addEventListener('url', handleUrl);

        Linking.getInitialURL()
          .then(url => {
            pendingDeepLink.current = url;

            if (isLoaded) {
              initializeMobileApp();
            }
          })
          .catch(err => console.error('An error occurred', err));

        return () => {
          deepLink.remove();
        };
      } else {
        setHasInternetConnection(false);
      }
    });
  }, [isLoaded]);

  useEffect(() => {
    const handleBackButton = () => {
      navigation.navigate(LANDING_DEFAULT);
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (appContinue) {
      getMobileAppData(pendingDeepLink.current);
    }
  }, [appContinue]);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  function initializeMobileApp(): void {
    setLoadingMsg('Starting...');

    //
    //setAppContinue(true);
    //return;
    //

    NmInitEndpoints(EndpointSet, loginSetters, AssetManager, setDarkTheme).then(done => {
      if (done) {
        setLoadingMsg('Initializing Resources...');

        NmInitializeSettings().then(initResult => {
          if (initResult) {
            if (SetupDone == true) {
              //createAssets().then(result => { //Function for getting/preparing images from server (Not yet implemented)
              setLoadingMsg('Getting Assets...');

              NmInitMobileAssets(setV9Link, demoMode, setLandingPage, AssetManager).then((response: unknown) => {
                const result = response as AssetResult;
                if (result?.value == true) {
                  setLoadingMsg('Initializing App Items...');

                  if (result?.versionCheck == APP_CONST.APP_VERCODE_OKAY) {
                    setAppContinue(true);
                  } else {
                    setUpdateAvailable({
                      visible: true,
                      type: result?.versionCheck,
                    });
                  }
                } else {
                  setEndpointTitle(result?.title ?? 'NOAH');
                  setEndpointMsg(result?.message ?? 'Unknown error occured');

                  if (Config.APP_LIVE) {
                    setModalMessage('Something went wrong on our end. Please try again later.');
                    setModalVisible(true);
                  } else {
                    setChangeEndpointVisible(true);
                  }
                }
              });
            } else {
              navigation.navigate('EndpointOption');
            }
          }
        });
      }
    });
  }

  function getMobileAppData(deepLinkURL: string | null): void {
    NmGetMobileAppData().then(responseData => {
      setLoadingMsg('Get Mobile App Data...');
      const tempAppItems: Record<string, unknown> = {};

      tempAppItems.Module = responseData.Module;
      tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
      tempAppItems.MenuDriven = responseData.MenuDriven;

      AssetManager.setAppitems(tempAppItems);

      NmInitializeDrawer(AssetManager, tempAppItems).then(() => {
        setLoadingMsg('Initializing App Drawer...');
        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
          checkDrawerItems(deepLinkURL);
        }

        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
          checkDrawerItems(deepLinkURL);
        }
      });
    });
  }

  //Async function for starting database, then creating drawer items, then logging in
  //Can be shortened if we store the drawer items to database or encrypted storage once created. Call again if there are database changes to menu items
  function checkDrawerItems(url: string | null): void {
    setLoadingMsg('Check Drawer Items...');
    if (AssetManager.drawerItems == undefined) {
      setLoadingMsg('AssetManager.drawerItems == undefined...');

      NmInitializeDrawer(AssetManager).then(() => {
        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
          startLogin(url);
        }

        if (ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER) {
          NmStartDatabase().then(() => {
            NmSelectApprovalItems().then(result => {
              if (result == true) {
                NmInitApprovalDrawerItems().then(result => {
                  if (result == true) {
                    startLogin(url);
                  }
                });
              }
            });
          });
        }
      });
    } else {
      setLoadingMsg('startLogin...');
      startLogin(url);
    }
  }

  function startLogin(url: string | null): void {
    if (url) {
      Linking.openURL(url);
    } else {
      try {
        if (loginToken == undefined || loginToken == '') {
          navigation.navigate(LANDING_DEFAULT, {
            fromNotifClick: fromNotifClick,
          });
        } else {
          // checkUserToken(recuser, loginToken).then(result => {
          //   if (result == true) {
          //     console.log('SPLASH HERE');
          //     processLogin();
          //   } else {
          //     //global.NmClearLoginData();
          //     setModalVisible(true);
          //   }
          // });
          processLogin();
        }
        //NmPlayCheck();
        //NmResponseDecrypt(global.TestResponse);
        //NmSecCheck();
      } catch (error) {
        console.log('SPLASH ERROR: ' + error);
      }
    }
  }

  function processLogin(): void {
    setLoadingMsg('processLogin...');

    NmRefreshNotificationList(recuser, notifManager).then(result => {
      if (result) {
        NmRefreshUnreadNotificationList(recuser, notifManager).then(() => {
          navigation.navigate(LANDING_DEFAULT);
        });
      } else {
        navigation.navigate(LANDING_DEFAULT);
      }
    });
  }

  const handleUrl = ({url}: {url: string}) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        if (url.includes(ConfigDetails().DeepLinkRoute)) {
          if (url.includes('Approved')) {
            const tmpUrl = url.split('?');
            const tmpParams = tmpUrl[1].split('&');

            const idtok = tmpParams[0].substr(6, tmpParams[0].length - 6);

            const nwusr = NmCreateLocalToken(tmpParams[1].substr(6, tmpParams[1].length - 6));

            const pwtok = tmpParams[2].substr(6, tmpParams[2].length - 6);

            const regToken = NmAesDecrypt(nwusr);

            if (regToken.includes(idtok.toUpperCase()) == true) {
              navigation.navigate('NewPassword', {
                newAccount: true,
                pwtku: pwtok,
              });
            } else {
              returnToLogin('Error: Invalid Registration Link');
            }
          } else if (url.includes('Invalid')) {
            returnToLogin('Error: Invalid Registration Link');
          }
        }
      } else {
        returnToLogin('Error: Invalid Application Link');
      }
    });
  };

  function returnToLogin(message: string): void {
    navigation.navigate(LANDING_DEFAULT, {
      linkFail: true,
      message: message,
    });
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.splashBackground}]}>
      <NmModal
        winVisible={!hasInternetConnection}
        setWinVisible={setHasInternetConnection}
        OkTitle={'Try again.'}
        onClickOk={() => {
          RNRestart.restart();
        }}
        onClickClose={() => {
          BackHandler.exitApp();
        }}
        modalType={'WIN_INFO'}
        title={'No Internet Connection'}
        message={'This app requires a stable internet connection to function. Please enable Wifi or Mobile Data then try again.'}
      />

      <NmEndpointList
        setLoading={setLoading}
        winVisible={changeEndpointVisible}
        setWinVisible={setChangeEndpointVisible}
        containerStyle={{}}
        onClickClose={() => {
          setChangeEndpointVisible(false);
        }}
        onBackButtonPress={() => {
          BackHandler.exitApp();
        }}
        onBackdropPress={() => {
          BackHandler.exitApp();
        }}
        errorMsg={endpointMsg}
      />

      {/* <NmEndpointPrompt
        winVisible={changeEndpointVisible}
        setWinVisible={setChangeEndpointVisible}
        containerStyle={{}}
        onButtonPress={(EndpointCode: string, Endpoint: string) => {
          setLoadingMsg('Changing endpoint...');
          setChangeEndpointVisible(false);

          switch (EndpointCode) {
            case APP_CONST.ENDPOINT_CODE_CUS: {
              navigation.navigate('EndpointScanner');
              break;
            }

            case APP_CONST.ENDPOINT_CODE_CANCEL: {
              RNExitApp.exitApp();
              break;
            }

            default: {
              NmClearAppData().then(result => {
                if (result == true) {
                  NmSaveSetting(APP_KEYS.ENDPOINT_URL, Endpoint);
                  NmSaveSetting(APP_KEYS.ENDPOINT_CODE, EndpointCode);
                  NmSaveSetting(APP_KEYS.ENDPOINT_KEY, APP_CONST.ENDPOINTKEY_SIT_UAT);

                  setTimeout(() => {
                    RNRestart.Restart();
                  }, 3000);
                } else {
                  setLoadingMsg('Failed to clear application data. Exiting.');

                  setTimeout(() => {
                    RNExitApp.exitApp();
                  }, 3000);
                }
              });

              break;
            }
          }
        }}
        onClickClose={() => {
          BackHandler.exitApp();
        }}
        title={endpointTitle}
        message={endpointMsg}
      /> */}

      <NmModal
        winVisible={modalVisible}
        setWinVisible={setModalVisible}
        containerStyle={{}}
        showCloseButton={false}
        onClickOk={() => {
          setModalVisible(false);
          RNExitApp.exitApp();
        }}
        onBackdropPress={() => {
          setModalVisible(false);
          RNExitApp.exitApp();
        }}
        modalType={'WIN_INFO'}
        title={'WeConnect Mobile'}
        message={modalMessage}
      />

      <NmModal
        winVisible={updateAvailable.visible}
        setWinVisible={() => {
          setUpdateAvailable(val => ({
            ...val,
            visible: !updateAvailable.visible,
          }));
        }}
        showCloseButton={false}
        onBackButtonPress={() => {
          RNExitApp.exitApp();
        }}
        onBackdropPress={() => {}}
        hideNoButton={updateAvailable?.type == APP_CONST.APP_VERCODE_HIGH ? true : false}
        YesTitle={'Update Now'}
        NoTitle={'Update Later'}
        onClickYes={() => {
          if (Platform.OS == 'ios') {
            Linking.openURL(`itms-apps://apps.apple.com/app/id${NOAHConfig.APPSTORE_ID}`);
          } else {
            const playStoreUrl = `https://play.google.com/store/apps/details?id=${NOAHConfig.PLAYSTORE_ID}`;

            Linking.openURL(playStoreUrl).catch(err => {
              console.error('An error occurred', err);
            });
          }
        }}
        onClickNo={() => {
          setAppContinue(true);
          setUpdateAvailable(val => ({
            ...val,
            visible: false,
          }));
        }}
        modalType={'WIN_QUESTION'}
        title={'New Version Available'}
        message={'We’ve polished the app to make it faster and smoother. Update now to enjoy the latest improvements.'}
      />

      <MainLoadingScreen theme={theme} logo={theme.logo.splash} setChangeEndpointVisible={setChangeEndpointVisible} loadingMsg={loadingMsg} screenWidth={screenWidth} />
    </View>
  );
};

interface MainLoadingScreenProps {
  theme: typeof import('../functions/ThemeContext').themes.light;
  logo?: any;
  setChangeEndpointVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  loadingMsg?: string;
  screenWidth: DimensionValue | undefined;
}

export const MainLoadingScreen: React.FC<MainLoadingScreenProps> = ({theme, logo, setChangeEndpointVisible, loadingMsg, screenWidth}) => {
  const NwClass = useStyles();

  return (
    <>
      <TouchableWithoutFeedback style={{width: '100%', alignItems: 'center'}} onLongPress={() => setChangeEndpointVisible?.(true)}>
        <Image
          source={logo}
          style={{
            height: 180,
            width: '80%',
            resizeMode: 'contain',
            marginTop: -50,
          }}
        />
      </TouchableWithoutFeedback>

      <View
        style={[
          NwClass.progressBar,
          {
            width: screenWidth,
            height: 4,
            marginTop: 0,
            backgroundColor: theme.splashLoading, // replaces unfilledColor
            borderColor: theme.splashBorder, // replaces borderColor
            borderWidth: theme.splashBorder ? StyleSheet.hairlineWidth : 0,
            borderRadius: 2,
            overflow: 'hidden',
          },
        ]}>
        <ProgressBar
          indeterminate={true}
          color={theme.splashBar}
          style={{
            height: 4,
            backgroundColor: 'transparent',
          }}
        />
      </View>
      {/* <Progress.Bar
        style={[
          NwClass.progressBar,
          {
            height: 4,
            width: screenWidth,
            marginTop: 0,
          },
        ]}
        width={400}
        height={15}
        indeterminate={true}
        indeterminateAnimationDuration={2500}
        color={theme.splashBar}
        unfilledColor={theme.splashLoading}
        progress={1}
        borderColor={theme.splashBorder}
        useNativeDriver={true}
        animationType="decay"
      /> */}

      {Config.APP_SHOW_LOADMSG && <Text style={{color: theme.textColor}}>{loadingMsg}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;

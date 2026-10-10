import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {View, Text, BackHandler, Platform} from 'react-native';

import {WebView} from 'react-native-webview';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {APP_CONST} from '../constants/NmConstants';
import {useFocusEffect} from '@react-navigation/native';
import {NmHasInternet, NmCreateWebToken, NmGetDate} from '../functions/NmFunctions';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {NmModal, LoadingScreen, NDContext} from '../components';
import {Config} from '../app.config';
import {ConfigDetails} from '../functions/NmAppConfig';
import {ThemesContext} from '../functions/ThemeContext';

var RNFS = require('react-native-fs');
var XDate = require('xdate');

import {StackScreenProps} from '../navigation/NavigationTypes';

type Props = StackScreenProps<'WebViewerHome'>;

const WebViewerHome = ({navigation, route}: Props) => {
  const {NmCreateLogs, viewLinkLogs} = useContext(NDContext);
  const {v9Link} = useContext(AppConfigContext);
  const {theme} = useContext(ThemesContext);
  const {currentAccount, companyToken, companyCode, v9Token, loginToken} = useContext(AccountDetailsContext);

  const {link, webLink, newPage, accountNo, menuCode, fromNotifWindow, otherLink, devMode} = route.params;

  const [loading, setLoading] = useState<boolean>(newPage);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [webViewcanGoBack, setWebViewcanGoBack] = useState<boolean>(false);

  const [hasInternet, setHasInternet] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isNOAH, setIsNOAH] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('Sample error');

  const webviewRef = useRef<any>(null);
  const [pdfURL, setPDFUrl] = useState<string>('');

  let itemLink: any | undefined = '';

  // For disabling zoom if the web app does not contain the meta data
  const injectedJavaScript = `
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
      `;

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS == 'android') {
        const onBackPress = () => {
          if (webviewRef.current && webViewcanGoBack) {
            if (isNOAH == true) {
              webviewRef.current.injectJavaScript('hasOpenModal();');
            } else {
              webviewRef.current.goBack();
              return true;
            }
          } else {
            navigation.goBack();
            return true;
          }
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
      }
    }, [webViewcanGoBack]),
  );

  useEffect(() => {
    NmHasInternet().then((result: unknown) => {
      setHasInternet(result as boolean);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, []),
  );

  if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
    if (accountNo == null || accountNo == undefined) {
      itemLink = link + currentAccount + APP_CONST.WEB_QS_NSC + companyToken + APP_CONST.WEB_QS_POPMOB;
    } else {
      itemLink = link + currentAccount + APP_CONST.WEB_QS_NSC + companyToken + APP_CONST.WEB_QS_POPMOB;
    }
  }

  if (devMode == true) {
    itemLink = itemLink + '&nwdev=p8dev';
  }

  switch (menuCode) {
    case 'SCMS_PDE':
      itemLink = link + '&nwtku=' + currentAccount + APP_CONST.WEB_QS_POPMOB;
      break;

    case 'HRTICKET_COMPANY':
    case 'HRTICKET_PROJECT':
      itemLink = link + NmCreateWebToken(loginToken) + APP_CONST.WEB_QS_NSC + APP_CONST.WEB_QS_POPMOB;
      break;

    default:
      if (menuCode?.includes('SCMS_HRMI')) {
        itemLink = link + '&nwu=' + v9Token;
      }
      break;
  }

  if (v9Link == true) {
    itemLink = link;
    itemLink += '&nwu=' + v9Token + '&nwcom=' + companyCode;
  }

  if (otherLink == true) {
    itemLink = webLink;
  }

  useEffect(() => {
    if (viewLinkLogs) {
      const webLogs = `
      === WEBVIEW ===:
      menuCode: ${menuCode}\n
      itemLink: ${itemLink}\n
      link: ${link}\n
      webLink: ${webLink}\n
      newPage: ${newPage}\n
      acc: ${accountNo}\n
      fromNotif: ${fromNotifWindow}\n
      otherLink: ${otherLink}\n
      devMode: ${devMode}\n
      companyCode: ${companyCode}\n
      v9Token: ${v9Token}\n
      loginToken: ${loginToken}`;

      NmCreateLogs(webLogs);
    }
  }, [viewLinkLogs, itemLink, menuCode]);

  function handleWebviewMessage(event: any) {
    if (event.nativeEvent.data == 'NOAH_APP') {
      setIsNOAH(true);
    }

    if (event.nativeEvent.data == 'MODAL_NONE') {
      navigateBack();
    }
  }

  function navigateBack() {
    if (webViewcanGoBack) {
      webviewRef.current?.goBack();
    } else {
      const backRoute = fromNotifWindow ? 'NotificationScreen' : 'Home';

      if (!otherLink) {
        navigation.navigate(backRoute);
      } else {
        //Change to remove tab if end of webpage
        //props.navigation.navigate('New Tab');
      }
    }
  }

  function handleError(errorDomain: string | undefined, errorCode: number, errorDesc: string): void {}

  useEffect(() => {
    console.log('itemLink', itemLink);
  }, [itemLink]);

  const handleLoadEnd = () => {
    //setTimeout(() => {

    const jsCode = `
                (function() {
                  const darkMode = '${theme.webTheme}';
                  const maincon = document.querySelector('.menuitem-container.full');

                  if(darkMode == '1') {
                    maincon.classList.add('main-c','theme_secondary_dark');
                    maincon.style.backgroundColor = '#18191a';
                  } else if (darkMode == '0') {
                    maincon.classList.remove('main-c','theme_secondary_dark');
                    maincon.style.backgroundColor = null;
                  }
                })();`;
    if (!menuCode?.includes('PMOTerms') && !menuCode?.includes('PMOPrivacyPolicy')) {
      webviewRef.current?.injectJavaScript(jsCode);
    }

    //}, 100);
  };

  return (
    <View style={{flex: 1}}>
      <NmModal winVisible={modalVisible} setWinVisible={setModalVisible} customView={true} customAnimate={true} customAnimateIn={'fadeIn'} customAnimateOut={'fadeOut'}>
        <View style={{flex: 1, paddingHorizontal: 16, justifyContent: 'flex-end', alignItems: 'center'}}>
          <View style={{marginBottom: '20%', backgroundColor: 'white', paddingHorizontal: 16, borderRadius: 6, paddingVertical: 5, alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 14}}>{'File Downloaded'}</Text>
          </View>
        </View>
      </NmModal>

      {!hasInternet && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#FFF'}}>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 14, color: '#777'}}>{'No Internet Connection.'}</Text>
        </View>
      )}

      {hasError && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF'}}>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 14, color: '#777', textAlign: 'center'}}>
            {'Something went wrong while loading the app.\nPlease try again.\n\n'}
            <Text style={{fontFamily: 'Poppins-Bold', fontSize: 14, color: '#1974D1', textAlign: 'center', textDecorationLine: 'underline'}} onPress={() => webviewRef.current?.reload()}>
              {'Refresh'}
            </Text>
          </Text>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 12, color: '#CCC', textAlign: 'center', marginTop: 14}}>{'Error Message: ' + errMsg}</Text>
        </View>
      )}

      {loading ? <LoadingScreen /> : null}

      {hasInternet && !hasError && (
        <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' ? -100 : 0} behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} style={{flex: 1, width: '100%'}}>
          {/* <ViewShot ref={viewShotRef} options={{format: 'png', quality: 0.9}}> */}
          <View style={{flex: 1}} collapsable={false}>
            <WebView
              ref={ref => {
                webviewRef.current = ref;
              }}
              onMessage={event => {
                handleWebviewMessage(event);
              }}
              domStorageEnabled={true}
              onLoadStart={() => {
                setLoading(true);
              }}
              onLoadEnd={() => {
                if (Config.APP_WEBTHEME) {
                  handleLoadEnd();
                }
                setLoading(false);
              }}
              onLoadProgress={({nativeEvent}) => {
                if (nativeEvent.progress != 1 && loading == false) {
                  setLoading(true);
                } else if (nativeEvent.progress == 1) {
                  setLoading(false);
                }
                setWebViewcanGoBack(nativeEvent.canGoBack);
              }}
              injectedJavaScript={injectedJavaScript}
              onShouldStartLoadWithRequest={request => {
                if (Platform.OS == 'ios') {
                  if (request.url.endsWith('.pdf')) {
                    if (!request.url.includes('?nkmob=y&file=')) {
                      setPDFUrl(request.url);
                    } else {
                      const tmpUrl = request.url;
                      let fileIndex = tmpUrl.indexOf('?nkmob=y&file=');
                      let tmpFileUrlIndex = tmpUrl.indexOf('https:', fileIndex);

                      setPDFUrl(tmpUrl.substring(tmpFileUrlIndex));
                      //downloadFileserver(tmpUrl.substring(tmpFileUrlIndex));
                      return true;
                    }
                  } else if (request.url.startsWith('blob')) {
                    var path = RNFS.DocumentDirectoryPath + '/' + Config.APP_NAME + NmGetDate(undefined, 'fullNoMs') + '.pdf';

                    setLoading(true);
                    RNFS.downloadFile({
                      fromUrl: pdfURL,
                      toFile: path,
                      background: false,
                      cacheable: true,
                    }).promise.then(() => {
                      setLoading(false);

                      setModalVisible(true);
                      setTimeout(() => {
                        setModalVisible(false);
                      }, 3000);
                    });
                    return false;
                  }
                  return true;
                } else {
                  return true;
                }
              }}
              renderError={(domain, code, desc) => {
                setHasError(true);
                return (
                  <View>
                    <Text>{`Something went wrong. ${desc}`}</Text>
                  </View>
                );
              }}
              // renderError={(e: string) => {
              //   setErrMsg(e.toString());
              //   setHasError(true);
              // }}
              onError={e => {
                setErrMsg(e.toString());
                setHasError(true);
              }}
              originWhitelist={['*']}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              scalesPageToFit={false}
              source={{uri: itemLink}}
              javaScriptEnabled={true}
              mixedContentMode={'always'}
              allowsFullscreenVideo={true}
              style={{
                flex: 1,
                opacity: 1,
                overflow: 'hidden',
                backgroundColor: 'white',
              }}></WebView>
          </View>
          {/* </ViewShot> */}
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default WebViewerHome;

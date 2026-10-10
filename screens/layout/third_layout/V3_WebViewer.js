import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {View, StyleSheet, Text, BackHandler, Platform} from 'react-native';

import {WebView} from 'react-native-webview';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {captureRef} from 'react-native-view-shot';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';

import {TabsContext, ReloadContext, AccountDetailsContext, AppConfigContext} from '../../../functions/Contexts';
import {APP_CONST} from '../../../constants/NmConstants';

import {NmHasInternet, NmCreateWebToken, NmGetDate} from '../../../functions/NmFunctions';
import {NmModal, LoadingScreen} from '../../../components';
import {Config} from '../../../app.config';
import {ConfigDetails} from '../../../functions/NmAppConfig';

var RNFS = require('react-native-fs');

const V3_WebViewer = props => {
  const {v9Link} = useContext(AppConfigContext);
  const {tabList, setTabList, activeTabKey, setActiveTabKey} = useContext(TabsContext);
  const {currentAccount, companyToken, v9Token, companyCode, loginToken} = useContext(AccountDetailsContext);
  const {shouldReload, resetReload} = useContext(ReloadContext);

  const viewShotRef = useRef();
  const webviewRef = useRef();
  const route = useRoute();
  const isFocused = useIsFocused();

  const {link, webLink, newPage, accountNo, menuCode, localTab, fromNotifWindow, tabKey, otherLink, devMode} = route.params || {};

  const [pdfURL, setPDFUrl] = useState('');
  const [loading, setLoading] = useState(newPage);
  const [modalVisible, setModalVisible] = useState(false);
  const [webViewcanGoBack, setWebViewcanGoBack] = useState(false);

  const [hasInternet, setHasInternet] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isNOAH, setIsNOAH] = useState(false);
  const [errMsg, setErrMsg] = useState('Sample error');
  const localTabKey = localTab;

  let itemLink = '';

  // For disabling zoom if the web app does not contain the meta data
  const injectedJavaScript = `
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);
      `;

  useEffect(() => {
    NmHasInternet().then(result => {
      setHasInternet(result);
    });
  }, []);

  useEffect(() => {
    if (!isFocused && viewShotRef.current) {
      saveSnapshot().then(uri => {
        if (uri) {
          setTabList(currentTabList => {
            const originalArray = [...currentTabList];
            const itemToUpdate = originalArray.find(tab => tab.key == tabKey);

            if (itemToUpdate) {
              itemToUpdate.snapshot = uri;
            }
            return originalArray;
          });
        }
      });
    } else if (isFocused) {
      setActiveTabKey(localTabKey);
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        const onBackPress = () => {
          if (webviewRef.current && webViewcanGoBack) {
            if (isNOAH == true) {
              webviewRef.current.injectJavaScript('hasOpenModal();');
            } else {
              webviewRef.current.goBack();
              return true;
            }
          } else {
            let tmpTabs = [...tabList];
            const updatedTabs = tmpTabs.filter(tab => tab.key != tabKey);
            setTabList(updatedTabs);

            if (updatedTabs?.length > 0) {
              props.navigation.navigate(updatedTabs[0].key);
              return true;
            } else {
              return false;
            }
          }
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
      }
    }, [webViewcanGoBack, tabList]),
  );

  useEffect(() => {
    if (shouldReload && webviewRef.current && tabKey == activeTabKey.link) {
      webviewRef.current.reload();
      resetReload();
    }
  }, [shouldReload, resetReload]);

  if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
    if (accountNo == null || accountNo == undefined) {
      itemLink = link + currentAccount + APP_CONST.WEB_QS_NSC + companyToken + APP_CONST.WEB_QS_POPMOB; // + KEYS_WEBVIEW.PARAMS_SSL_WORKAROUND;
    } else {
      itemLink = link + currentAccount + APP_CONST.WEB_QS_NSC + companyToken + APP_CONST.WEB_QS_POPMOB; // + KEYS_WEBVIEW.PARAMS_SSL_WORKAROUND;
    }
  }

  if (devMode == true) {
    itemLink = itemLink + '&nwdev=p8dev';
  }

  if (menuCode == 'SCMS_PDE') {
    itemLink = link + '&nwtku=' + currentAccount + APP_CONST.WEB_QS_POPMOB;
  } else if (menuCode == 'HRTICKET_COMPANY' || menuCode == 'HRTICKET_PROJECT') {
    itemLink = link + NmCreateWebToken(loginToken) + APP_CONST.WEB_QS_NSC + global.HardCodeTicketNSC + APP_CONST.WEB_QS_POPMOB;
  }

  if (v9Link == true) {
    itemLink = link;
    itemLink += '&nwu=' + v9Token + '&nwcom=' + companyCode;
  }

  if (otherLink == true) {
    itemLink = webLink;
  }

  function handleWebviewMessage(event) {
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
      let backRoute = fromNotifWindow ? 'NotificationScreen' : 'Home';

      if (!otherLink) {
        props.navigation.navigate(backRoute);
      }
    }
  }

  const saveSnapshot = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const uri = await captureRef(viewShotRef, {format: 'png', quality: 0.7});
        resolve(uri);
      } catch (error) {
        reject(false);
      }
    });
  };

  const handleNavigationStateChange = navState => {
    setWebViewcanGoBack(navState.canGoBack);

    // if (!navState.loading) {
    //   setTabList(currentTabList => {
    //     const originalArray = [...currentTabList];
    //     const itemToUpdate = originalArray.find(tab => tab.key == tabKey);

    //     if (itemToUpdate) {
    //       itemToUpdate.webLink = navState.url; // Update URL
    //       itemToUpdate.title = navState.title; // Update Tab Title
    //     }
    //     return originalArray;
    //   });
    // }
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
          <View style={{flex: 1}} collapsable={false} ref={viewShotRef}>
            <WebView
              ref={ref => (webviewRef.current = ref)}
              onMessage={event => {
                handleWebviewMessage(event);
              }}
              domStorageEnabled={true}
              onLoadStart={event => {
                setLoading(true);
              }}
              onLoadEnd={() => setLoading(false)}
              onLoadProgress={({nativeEvent}) => {
                if (nativeEvent.progress != 1 && loading == false) {
                  setLoading(true);
                } else if (nativeEvent.progress == 1) {
                  setLoading(false);
                }
                setWebViewcanGoBack(nativeEvent.canGoBack);
              }}
              onNavigationStateChange={handleNavigationStateChange}
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
                    }).promise.then(r => {
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
              renderError={e => {
                setErrMsg(e.toString());
                setHasError(true);
              }}
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
                opacity: 0.99,
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.6)',
    zIndex: 1,
  },
  text: {
    paddingVertical: 20,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default V3_WebViewer;

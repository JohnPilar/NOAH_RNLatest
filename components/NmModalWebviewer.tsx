import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Platform, DimensionValue, StyleProp, ViewStyle} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../functions/NmFunctions';
import Modal, {Animations} from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';

import {NmGetDate} from '../functions/NmFunctions';
import {ThemesContext} from '../functions/ThemeContext';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {NDContext} from './NmDevTools';
import {Config} from '../app.config';

var RNFS = require('react-native-fs');

interface NmModalWebviewerProps {
  newPage?: boolean;
  link: string;
  modalStyle?: StyleProp<ViewStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  title?: string;
  onClickClose?: () => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  customAnimateIn?: Animations;
  customAnimateOut?: Animations;
  inTiming?: number;
  outTiming?: number;
  containerStyle?: StyleProp<ViewStyle>;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  backdropOpacity?: number;
  backdropColor?: string;
  hasBackdrop?: boolean;
}

export default function NmModalWebviewer(props: NmModalWebviewerProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {currentAccount, companyToken, companyCode, v9Token, loginToken} = useContext(AccountDetailsContext);

  const {
    newPage,
    link,
    modalStyle,
    headerContainerStyle,
    closeButtonStyle,
    title,
    onClickClose,
    visible,
    setVisible,
    customAnimateIn,
    customAnimateOut,
    inTiming,
    outTiming,
    containerStyle,
    onBackButtonPress,
    onBackdropPress,
  } = props || {};

  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('95%');

  const {NmCreateLogs, viewLinkLogs} = useContext(NDContext);
  const {v9Link} = useContext(AppConfigContext);

  const [loading, setLoading] = useState<boolean>(newPage ?? false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [hasInternet, setHasInternet] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isNOAH, setIsNOAH] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('Sample error');

  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [pdfURL, setPDFUrl] = useState<string>('');

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  function closeFunction(actionProps?: () => void): void {
    if (actionProps) {
      actionProps();
      return;
    }
    setVisible(false);
  }

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => closeFunction(onBackButtonPress)}
      onBackdropPress={() => closeFunction(onBackdropPress)}
      backdropOpacity={props?.backdropOpacity || 0.3}
      style={[{alignItems: 'center', margin: 0}, modalStyle]}
      backdropColor={props?.backdropColor}
      hasBackdrop={props?.hasBackdrop}
      animationIn={customAnimateIn || 'slideInLeft'}
      animationOut={customAnimateOut || 'slideOutRight'}
      animationInTiming={inTiming || 400}
      animationOutTiming={outTiming || 400}
      backdropTransitionOutTiming={0}>
      <View style={[styles.container, {width: screenWidth, backgroundColor: theme.notifModalBackgroundColor}, containerStyle]}>
        <View
          style={[
            {
              height: 40,
              backgroundColor: '#1974D1',
              width: '100%',
              borderTopStartRadius: 6,
              borderTopEndRadius: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            },
            headerContainerStyle,
          ]}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              closeFunction(onClickClose);
            }}
            style={closeButtonStyle}>
            <MaterialCommunityIcons style={[{marginRight: 8}]} name={'close-circle-outline'} size={28} color={'#FFF'} />
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', backgroundColor: theme.notifModalBackgroundColor, padding: 10, borderBottomStartRadius: 6, borderBottomEndRadius: 6}}>
          <WebView
            ref={ref => {
              webviewRef.current = ref;
            }}
            domStorageEnabled={true}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadProgress={({nativeEvent}) => {
              if (nativeEvent.progress != 1 && loading == false) {
                setLoading(true);
              } else if (nativeEvent.progress == 1) {
                setLoading(false);
              }
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
            onShouldStartLoadWithRequest={(request: WebViewNavigation) => {
              if (Platform.OS == 'ios') {
                if (request.url.endsWith('.pdf')) {
                  if (!request.url.includes('?nkmob=y&file=')) {
                    setPDFUrl(request.url);
                  } else {
                    const tmpUrl = request.url;
                    let fileIndex = tmpUrl.indexOf('?nkmob=y&file=');
                    let tmpFileUrlIndex = tmpUrl.indexOf('https:', fileIndex);

                    setPDFUrl(tmpUrl.substring(tmpFileUrlIndex));
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
            renderError={(errorDomain, errorCode, errorDesc) => {
              setErrMsg(errorDesc ?? '');
              setHasError(true);
              return <></>;
            }}
            onError={(e: any) => {
              setErrMsg(e.toString() ?? '');
              setHasError(true);
            }}
            originWhitelist={['*']}
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            scalesPageToFit={false}
            source={{uri: link}}
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 6,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
  },
  message: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 15,
    marginTop: 0,
    textAlign: 'justify',
  },
  buttonStyle: {
    height: 36,
    flex: 1,
    backgroundColor: '#1974D1',
  },
  buttonTextStyle: {
    fontSize: 14,
  },
  textInputStyle: {
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
});

import {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';

import {WebView} from 'react-native-webview';
import {EventRegister} from 'react-native-event-listeners';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import {NmHardwareBackPress, NmHasInternet} from '../../functions/NmFunctions';
import {APP_CONST} from '../../constants';
import {NmModal, LoadingScreen} from '../../components';

var RNFS = require('react-native-fs');

const WebWatsonx = props => {
  const [pdfURL, setPDFUrl] = useState('');
  const webviewRef = useRef();

  let newPage = props.route.params?.newPage;
  const itemLink = require('./Watsonx.html');

  // Dynamic IDs
  let injectedJavaScript = `
        window.watsonAssistantChatOptions = {
          integrationID: '60763901-0134-4771-aade-1fa141e3df1c',
          region: 'au-syd',
          serviceInstanceID: 'serviceInstanceIDKEY',
          onLoad: function (instance) {
            instance.render();
          },
          showLauncher: false, 
          openChatByDefault: true, 
          hideCloseButton: false, 
        };
      `;

  injectedJavaScript.replace('serviceInstanceIDKEY', '519fe638-46b2-4314-aa98-bc9ed5c5bf6a');

  const [loading, setLoading] = useState(newPage);
  const [modalVisible, setModalVisible] = useState(false);

  const [hasInternet, setHasInternet] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState('Sample error');

  NmHardwareBackPress(() => {
    try {
      EventRegister.emit('UpdateHeaderTitle', 'Messaging');
      EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_MENU);
      props.navigation.goBack();
    } catch (err) {
      console.log('[handleBackButtonPress] Error : ', err.message);
    }
    return true;
  });

  useEffect(() => {
    EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_ASST);
    EventRegister.emit('UpdateHeaderTitle', 'NOAH Assistant');

    NmHasInternet().then(result => {
      setHasInternet(result);
    });
  }, []);

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
        <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' ? 50 : 0} behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} style={{flex: 1, width: '100%'}}>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <WebView
              ref={ref => (webviewRef.current = ref)}
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
              }}
              injectedJavaScript={injectedJavaScript}
              originWhitelist={['*']}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              scalesPageToFit={false}
              source={itemLink}
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

export default WebWatsonx;

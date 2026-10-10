import {useEffect, useState, useCallback, useRef, useContext} from 'react';
import {StyleSheet, View, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {LoadingScreen} from '../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemesContext} from '../../functions/ThemeContext';
import {NmHardwareBackPress} from '../../functions/NmFunctions';

const UpdatesWebview = props => {
  const route = useRoute();
  const {link} = route.params || {};
  const {theme} = useContext(ThemesContext);
  const webviewRef = useRef();

  const [loading, setLoading] = useState(true);
  const [webViewcanGoBack, setWebViewcanGoBack] = useState(false);

  const customBackpress = useCallback(() => {
    if (webviewRef.current && webViewcanGoBack) {
      if (isNOAH == true) {
        webviewRef.current.injectJavaScript('hasOpenModal();');
      } else {
        webviewRef.current.goBack();
        return true;
      }
    } else {
      props.navigation.goBack();
      return true;
    }
  }, [webViewcanGoBack]);

  NmHardwareBackPress(customBackpress);

  return (
    <View style={[styles.container, {paddingTop: useSafeAreaInsets().top, backgroundColor: theme.homeDrawerBackgroundColor}]}>
      {loading ? <LoadingScreen /> : null}

      <WebView
        ref={ref => (webviewRef.current = ref)}
        domStorageEnabled={true}
        onLoadStart={() => {
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
        source={{uri: link}}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default UpdatesWebview;

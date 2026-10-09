import React, {useState, useEffect, useContext} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import Modal from 'react-native-modal';

import NmButton from './NmButton';
import NmColors from '../constants/NmColors';
import {AppConfigContext} from '../functions/Contexts';

interface NmModalTermsProps {
  setShowModalTaC: (show: boolean) => void;
  onAccept: () => void;
  isVisible: boolean;
}

interface ScrollEvent {
  layoutMeasurement: {
    height: number;
  };
  contentOffset: {
    y: number;
  };
  contentSize: {
    height: number;
  };
}

export default function NmModalTerms(props: NmModalTermsProps): React.JSX.Element {
  const {setShowModalTaC, onAccept} = props;
  const {AssetManager} = useContext(AppConfigContext);

  const [webviewHeight, setWebviewHeight] = useState<number>(0);
  const [tacScrolled, setTacScrolled] = useState<boolean>(false);
  const [iOSHdrMargin, setiOSHdrMargin] = useState<number>(20);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (DeviceInfo.hasNotch()) {
        setiOSHdrMargin(10);
      }
    }
  }, []);

  const onMessage = (event: WebViewMessageEvent): void => {
    setWebviewHeight(Number(event.nativeEvent.data));
  };

  function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}: ScrollEvent): boolean {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  }

  return (
    <Modal
      isVisible={props.isVisible}
      onBackButtonPress={() => {
        setTacScrolled(false), setShowModalTaC(false);
      }}
      backdropOpacity={0.3}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      animationInTiming={300}
      animationOutTiming={300}
      style={{alignItems: 'center', margin: 0, flex: 1}}
      backdropColor={'white'}
      backdropTransitionOutTiming={0}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={styles.loadingContainer}>
          <View style={{width: '100%', marginTop: iOSHdrMargin, paddingHorizontal: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                setShowModalTaC(false);
                setTacScrolled(false);
              }}
              style={{backgroundColor: '#F0F4F9', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
              <MaterialCommunityIcons name={'arrow-left'} size={30} color={'#516DF6'} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <View style={{marginLeft: 0, marginBottom: 10}}>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 26, color: 'black', marginTop: 20}}>{'Terms and Conditions'}</Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: '#A4A8B0'}}>Last updated of March 2023</Text>
            </View>

            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              style={{marginHorizontal: -5}}
              onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  setTacScrolled(true);
                } else {
                  setTacScrolled(false);
                }
              }}>
              <View style={{flex: 1, paddingHorizontal: 0}} onStartShouldSetResponder={() => true}>
                <WebView
                  source={{
                    html: `
                            <html>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <body>
                                    ${AssetManager.appAssets.TermsAndConditions}
                                </body>
                                <script>
                                    window.onload = function() {
                                      setTimeout(() => {
                                        const height = document.body.scrollHeight;
                                        window.ReactNativeWebView.postMessage(height.toString());
                                      }, "400");
                                    }
                                </script>
                            </html>
                        `,
                  }}
                  onMessage={onMessage}
                  style={{
                    width: '100%',
                    height: webviewHeight,
                    fontSize: 20,
                  }}
                />
              </View>
            </ScrollView>
          </View>
          <View>
            <NmButton
              buttonTheme="dark"
              disabled={!tacScrolled}
              style={[{backgroundColor: !tacScrolled ? NmColors.buttonDisabled : NmColors.buttonDark, marginTop: 20}]}
              titleStyle={styles.buttonTextStyle}
              title="I Accept"
              onPress={() => {
                setTacScrolled(false);
                setShowModalTaC(false);
                onAccept();
              }}
            />
            <NmButton
              buttonTheme="dark"
              disabled={!tacScrolled}
              style={[{backgroundColor: '#FFF', marginBottom: 0, marginTop: 10}]}
              titleStyle={[styles.buttonTextStyle, {color: !tacScrolled ? NmColors.buttonDisabled : NmColors.buttonTextNoBackground}]}
              buttonTitle
              title="I Do Not Accept"
              onPress={() => {
                setTacScrolled(false);
                setShowModalTaC(false);
              }}
            />
          </View>
          <View style={{alignItems: 'center', width: '100%'}}>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 11, color: '#DF3E3E', marginTop: 10, marginBottom: 10, textAlign: 'center'}}>
              {'Upon clicking I Do Not Accept, user will return to the log in page. For questions/clarifications regarding Terms and Conditions, please contact the administration office.'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    zIndex: 1,
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  iconTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#13151B',
  },
  iconDescription: {
    width: '60%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A4A8B0',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 60,
  },
  textInputStyle: {
    paddingVertical: 0,
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
  },
  actionButtons: {
    backgroundColor: '#133561',
    borderRadius: 6,
    width: '100%',
    height: 45,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 14,
    color: '#ff005e',
    textAlign: 'center',
    fontWeight: '400',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#777',
    height: 40,
    color: '#000',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    fontWeight: '800',
    color: '#333',
    fontSize: 12,
  },
  labels: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  inputs: {
    flex: 2,
  },
});

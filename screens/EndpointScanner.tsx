import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, PermissionsAndroid, Platform, TouchableWithoutFeedback, Linking, AppState, TouchableOpacity, DimensionValue, AppStateStatus} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDeviceOrientation} from '@react-native-community/hooks';
import DeviceInfo from 'react-native-device-info';
import RNRestart from 'react-native-restart';
import RNQRGenerator from 'rn-qr-generator';
import {pick, types} from '@react-native-documents/picker';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';
import {Camera, useCodeScanner, useCameraDevice} from 'react-native-vision-camera';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

import {NmSaveSetting, NmClearAppData, NmHardwareBackPress, NmGetSetting, NmGetNextEdpCode} from '../functions/NmFunctions';
import {NmStyles, APP_KEYS, APP_CONST} from '../constants';
import {NmButton, LoadingScreen, NmLabel} from '../components';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/NmStyles';
import {NOAHConfig} from '../functions/NmAppConfig';
import {AppConfigContext} from '../functions/Contexts';

import {StackScreenProps} from '../navigation/NavigationTypes';
import {APP_ENDPOINT_CONFIGS} from '../constants/NmConstants';
import {NmEndpointCheck} from '../functions/NmNetwork';
import {NmQRDecode} from '../functions/NmCipher';

type Props = StackScreenProps<'EndpointScanner'>;

/* UPDATE THIS FUNCTION/SCREEN FOR THE DYNAMIC ENDPOINT LIST */
const EndpointScanner = ({navigation, route}: Props): React.JSX.Element => {
  const {AssetManager} = useContext(AppConfigContext);
  const isDeviceTablet: boolean = DeviceInfo.getDeviceType().toUpperCase() == 'TABLET';

  const device = useCameraDevice('back');
  const orientation = useDeviceOrientation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [enableScanner, setEnableScanner] = useState<boolean>(false);
  const [enableCodeScan, setEnableCodeScan] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Android: Handling camera render after permissions are set in settings (DeepLinking)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      if (nextAppState == 'active') {
        requestPermission().then((result: boolean | undefined) => {
          if (result == true) {
            setEnableScanner(true);
            setEnableCodeScan(true);
          }
        });
      } else {
        //console.log('App is in background or inactive');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return (): void => {
      subscription.remove();
    };
  }, []);

  // Android: On initial screen navigation
  useEffect(() => {
    requestPermission().then((result: boolean | undefined) => {
      if (result == true && device != null) {
        setEnableScanner(true);
        setEnableCodeScan(true);
      }
    });
  }, []);

  async function requestPermission(): Promise<boolean | undefined> {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    } else if (Platform.OS == 'ios') {
      const pResult = check(PERMISSIONS.IOS.CAMERA).then((status): boolean | Promise<boolean | undefined> => {
        switch (status) {
          case RESULTS.DENIED: {
            return request(PERMISSIONS.IOS.CAMERA).then((reqStatus): boolean | undefined => {
              switch (reqStatus) {
                case RESULTS.GRANTED:
                  return true;

                case RESULTS.DENIED:
                  return false;

                default:
                  return false;
              }
            });
          }

          case RESULTS.BLOCKED:
            return false;

          case RESULTS.GRANTED:
            return true;

          case RESULTS.LIMITED:
            return true;

          default:
            return false;
        }
      });

      return pResult;
    }
  }

  NmHardwareBackPress();

  useEffect(() => {
    if (isDeviceTablet == true) {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
        //setViewfinderHeight('50%'); //Modify for tablet  (do on iOS)
      } else {
        setScreenWidth('35%');
        //setViewfinderHeight('60%');
      }
    }
  }, [orientation]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'aztec', 'data-matrix'],
    onCodeScanned: (codes): void => {
      setEnableCodeScan(false);
      processQRCode(codes[0].value);
    },
  });

  const processQRCode = async (data: any): Promise<void> => {
    setLoading(true);

    const parsedData = NmQRDecode(data);
    const endpointWorking = await NmEndpointCheck(parsedData?.EndpointUrl);

    if (!endpointWorking) {
      setEnableCodeScan(true);
      setLoading(false);
      showError('Invalid Endpoint');
      return;
    }

    const CleanEndpointLink = parsedData?.EndpointUrl.replace(/\/?$/, '/');

    const providedEndpoint = {
      Code: parsedData?.EndpointCode,
      Description: parsedData?.EndpointDescription,
      EndpointLink: CleanEndpointLink,
      SecretKey: parsedData?.SecretKey,
      Environment: parsedData?.Environment,
      DeveloperOptions: parsedData?.DeveloperOptions ?? [],
    };

    const savedEndpointList = await NmGetSetting(APP_KEYS.ENDPOINT_LIST);

    const defaultList = [...APP_ENDPOINT_CONFIGS];
    if (savedEndpointList?.length) {
      const EdpCodeIndex = savedEndpointList.findIndex((item: any) => item.Code == providedEndpoint.Code);
      // Check the new endpoint code and make it unique if it exists
      providedEndpoint.Code = NmGetNextEdpCode(parsedData?.EndpointCode, savedEndpointList);

      const newList = [...savedEndpointList];
      if (EdpCodeIndex > -1) {
        newList[EdpCodeIndex] = providedEndpoint;
      } else {
        newList.push(providedEndpoint);
      }

      await NmSaveSetting(APP_KEYS.ENDPOINT_LIST, newList);
    } else {
      defaultList.push(providedEndpoint);
      await NmSaveSetting(APP_KEYS.ENDPOINT_LIST, defaultList);
    }

    await NmSaveSetting(APP_KEYS.ENDPOINT_CURRENT, providedEndpoint);
    await NmSaveSetting(APP_KEYS.ENDPOINT_INIT, true);
    await NmSaveSetting(APP_KEYS.APP_SETUP_FINISHED, true);

    setTimeout((): void => {
      setLoading(false);
      RNRestart.Restart();
    }, 3000);
  };

  async function pickMediaFile(): Promise<void> {
    if (Platform.OS == 'android') {
      try {
        const pickerResult = await pick({
          type: [types.images],
          presentationStyle: 'fullScreen',
          copyTo: 'cachesDirectory',
        });

        const pickType: string | null = pickerResult[0].type;

        if (pickType?.includes('image')) {
          const imgResponse = [pickerResult[0]];

          checkQREndpoint(imgResponse[0].uri);
          showError('');
        } else {
          showError('Please select image file only.');
        }
      } catch (e: any) {
        console.log('APick', e.toString());
      }
    } else if (Platform.OS == 'ios') {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
      };

      launchImageLibrary(options, (response): void => {
        if (response?.assets != undefined) {
          const responseObject: any = response.assets[0];

          if (responseObject.hasOwnProperty('fileSize') && responseObject?.width > 0 && responseObject?.height > 0) {
            const imgResponse = [response.assets[0]];

            checkQREndpoint(imgResponse[0].uri);
            showError('');

            //console.log([response.assets[0]]);
            //NmSetFile([response.assets[0]]);
          } else {
            showError('File may be corrupted.');
          }
        } else {
          showError('No QR Endpoint selected.');
        }
      });
    }
  }

  function checkQREndpoint(fileUri: any): void {
    RNQRGenerator.detect({
      uri: fileUri,
    })
      .then((response): void => {
        const {values} = response; // Array of detected QR code values. Empty if nothing found.
        processQRCode(values[0]);
      })
      .catch((error): void => console.log('Cannot detect QR code in image', error));
  }

  const showError = (err: string): void => {
    setErrorMessage(err);

    setTimeout((): void => {
      setErrorMessage('');
    }, 7000);
  };

  const scanWidth: number = WINDOW_WIDTH * 0.86;
  const horizontalPadding: number = (WINDOW_WIDTH - scanWidth) / 2;
  const verticalPadding: number = (WINDOW_HEIGHT - scanWidth) / 2;
  const overlayColor: string = '#000000b6';
  const adjustTopValue: number = 70;
  const overlayBorderWidth: number = 60;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {loading && <LoadingScreen containerStyle={{zIndex: 10}} />}
      {enableScanner && (
        <View style={{flex: 1, width: '100%', height: '100%'}}>
          <View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 1}}>
            {/*Top Overlay*/}
            <View style={{width: '100%', height: verticalPadding - adjustTopValue, backgroundColor: overlayColor, alignItems: 'flex-end'}}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setIsTorchOn(!isTorchOn);
                }}>
                <MaterialCommunityIcons name={!isTorchOn ? 'flash-outline' : 'flash'} size={34} color={'#FFF'} style={{paddingRight: 24, paddingTop: 56}} />
              </TouchableOpacity>
            </View>
            {/*Middle Overlay: Contains the scanning area design*/}
            <View style={{flexDirection: 'row'}}>
              <View style={{width: horizontalPadding, backgroundColor: overlayColor}}></View>
              <View style={{width: scanWidth, height: scanWidth, justifyContent: 'space-between'}}>
                <View style={{width: '100%', flexDirection: 'row', height: overlayBorderWidth, justifyContent: 'space-between', padding: 10}}>
                  <View style={{height: overlayBorderWidth, width: overlayBorderWidth, borderColor: '#FFF', borderLeftWidth: 4, borderTopWidth: 4, borderRadius: 4}}></View>
                  <View style={{height: overlayBorderWidth, width: overlayBorderWidth, borderColor: '#FFF', borderRightWidth: 4, borderTopWidth: 4, borderRadius: 4}}></View>
                </View>
                <View style={{width: '100%', flexDirection: 'row', height: overlayBorderWidth, justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10}}>
                  <View style={{height: overlayBorderWidth, width: overlayBorderWidth, borderColor: '#FFF', borderLeftWidth: 4, borderBottomWidth: 4, borderRadius: 4}}></View>
                  <View style={{height: overlayBorderWidth, width: overlayBorderWidth, borderColor: '#FFF', borderRightWidth: 4, borderBottomWidth: 4, borderRadius: 4}}></View>
                </View>
              </View>
              <View style={{width: horizontalPadding, backgroundColor: overlayColor}} />
            </View>
            {/*Bottom Overlay: Contains the error message area*/}
            <View style={{width: '100%', height: verticalPadding + adjustTopValue, backgroundColor: overlayColor, alignItems: 'center', paddingHorizontal: 16, paddingTop: 16}}>
              <NmLabel style={[NmStyles.poppinsRegular, {textAlign: 'center', marginTop: 10, color: 'red'}]}>{errorMessage} </NmLabel>
            </View>
          </View>
          {device != null && <Camera style={{flex: 1, width: '100%'}} codeScanner={enableCodeScan ? codeScanner : undefined} device={device} isActive={true} torch={isTorchOn ? 'on' : 'off'} />}
        </View>
      )}
      {!enableScanner && (
        <View style={{flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 16}}>
          <NmLabel style={[NmStyles.poppinsBold, {color: '#303030ff', fontSize: 18, marginBottom: 4}]}>{'Camera Permissions Denied'}</NmLabel>
          <NmLabel style={{textAlign: 'center', marginBottom: 4}}>{'Please enable Camera Permissions to continue.'}</NmLabel>
          {Platform.OS == 'android' && (
            <TouchableWithoutFeedback
              onPress={async () => {
                await Linking.openSettings();
              }}>
              <NmLabel style={{textAlign: 'center', textDecorationLine: 'underline', color: '#000cb4ff'}}>{'Open app settings'}</NmLabel>
            </TouchableWithoutFeedback>
          )}
        </View>
      )}
      <View style={{width: screenWidth, paddingHorizontal: 16, position: 'absolute', bottom: 20, zIndex: 2}}>
        <NmButton
          buttonTheme="dark"
          style={{marginVertical: 10}}
          titleStyle={styles.buttonTextStyle}
          title="Scan from Image"
          onPress={() => {
            pickMediaFile();
          }}
        />
        <NmButton
          buttonTheme="dark"
          titleStyle={styles.buttonTextStyle}
          title="Back"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555',
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
});

export default EndpointScanner;

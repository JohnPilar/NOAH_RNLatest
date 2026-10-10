import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {View, PermissionsAndroid, Platform, AppState, TouchableOpacity, BackHandler, StyleSheet, ActivityIndicator, Text, Image, TouchableWithoutFeedback} from 'react-native';

import {useDeviceOrientation} from '@react-native-community/hooks';
import DeviceInfo from 'react-native-device-info';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import ImageEditor from '@react-native-community/image-editor';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

import {AppConfigContext} from '../../../functions/Contexts';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../constants/NmStyles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

export default function IDScanner({onFinalImageReady}) {
  const {AssetManager} = useContext(AppConfigContext);
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [layoutMetrics, setLayoutMetrics] = useState({
    cameraWidth: 0,
    cameraHeight: 0,
    guideX: 0,
    guideY: 0,
    guideWidth: 0,
    guideHeight: 0,
  });

  NmHardwareBackPress();

  useEffect(() => {
    requestPermission().then(result => {
      if (result === true && device != null) {
        setHasPermission(true);
      }
    });
  }, [device]);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        requestPermission().then(result => {
          if (result === true) {
            setHasPermission(true);
          }
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  //==========================================================================================

  async function requestPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        return false;
      }
    } else if (Platform.OS === 'ios') {
      return await check(PERMISSIONS.IOS.CAMERA).then(async status => {
        if (status === RESULTS.DENIED) {
          const reqStatus = await request(PERMISSIONS.IOS.CAMERA);
          return reqStatus === RESULTS.GRANTED;
        }
        return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
      });
    }
    return false;
  }

  const cropToViewfinder = async (photoPath, photoWidth, photoHeight, photoOrientation) => {
    const {cameraWidth, cameraHeight, guideWidth, guideHeight} = layoutMetrics;

    if (!cameraWidth || !cameraHeight) {
      throw new Error('Layout metrics not gathered yet.');
    }

    const isPortrait = photoOrientation === 'portrait' || photoOrientation === 'portrait-upside-down';

    let widthPercent, heightPercent;
    let wPercent, hPercent, wGuide, hGuide;

    wPercent = (guideWidth / cameraWidth).toFixed(2);
    hPercent = (guideHeight / cameraHeight).toFixed(2);

    if (isPortrait) {
      widthPercent = (wPercent * photoHeight).toFixed(2);
      heightPercent = (hPercent * photoWidth).toFixed(2);

      wGuide = (photoHeight - widthPercent) / 2;
      hGuide = (photoWidth - heightPercent) / 2;
    } else {
      widthPercent = (hPercent * photoWidth).toFixed(2);
      heightPercent = (wPercent * photoHeight).toFixed(2);

      wGuide = (photoWidth - widthPercent) / 2;
      hGuide = (photoHeight - heightPercent) / 2;
    }

    let xOffset = Math.round(wGuide);
    let yOffset = Math.round(hGuide);
    let cropWidth = Math.round(widthPercent);
    let cropHeight = Math.round(heightPercent);

    const cropData = {
      offset: {
        x: xOffset,
        y: yOffset,
      },
      size: {
        width: cropWidth,
        height: cropHeight,
      },
      // displaySize: {
      //   width: isPortrait ? 1080 : 1920,
      //   height: isPortrait ? 1920 : 1080,
      // },
      resizeMode: 'contain',
    };

    const targetUri = Platform.OS === 'android' ? `file://${photoPath}` : photoPath;
    return await ImageEditor.cropImage(targetUri, cropData);
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);

        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
          enableShutterSound: true,
        });

        // Pass the internal orientation alongside the raw layout width and height
        const croppedImgUri = await cropToViewfinder(photo.path, photo.width, photo.height, photo.orientation);
        let picOrientation = photo.orientation;
        picOrientation = picOrientation.includes('portrait') ? 'PORTRAIT' : 'LANDSCAPE';

        if (onFinalImageReady) {
          onFinalImageReady({uri: croppedImgUri, orientation: picOrientation});
        }
      } catch (error) {
        console.error('OCR Pipeline Processing Failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleTapToFocus = async event => {
    if (!cameraRef.current) return;

    // Grab where the user tapped on the screen
    const {locationX, locationY} = event.nativeEvent;

    try {
      // Vision Camera automatically converts screen coordinates to camera focus points!
      await cameraRef.current.focus({
        x: locationX,
        y: locationY,
      });
    } catch (error) {
      console.warn('Focus failed or not supported on this device lens:', error);
    }
  };

  if (!hasPermission)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Awaiting Permission...</Text>
      </View>
    );
  if (!device)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No Camera Hardware Found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Top section layout spacer to push the 4:3 box area into optimal eye-line placement */}
      <View style={styles.topSpacer}>
        <Text style={styles.topHeaderText}>Scan ID Card</Text>
      </View>

      {/* FIXED CAMERA VIEW CONTAINER: Scaled to 4:3 window bounding box limits */}

      <TouchableWithoutFeedback onPress={handleTapToFocus}>
        <View
          style={styles.cameraBox43}
          onLayout={e => {
            const {width, height} = e.nativeEvent.layout;
            setLayoutMetrics(prev => ({...prev, cameraWidth: width, cameraHeight: height}));
          }}>
          <Camera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} orientation="landscape" enableNativeTapToFocusGesture={true} />

          <View style={styles.uiOverlayContainer} pointerEvents="none">
            <Text style={[styles.rotatedInstructionText, {position: 'absolute', top: layoutMetrics.guideHeight / 2 + layoutMetrics.guideY}]}>{'ALIGN ID HERE'}</Text>

            <View
              pointerEvents="none"
              style={styles.idTargetGuideBox}
              onLayout={e => {
                const {x, y, width, height} = e.nativeEvent.layout;
                setLayoutMetrics(prev => ({
                  ...prev,
                  guideX: x,
                  guideY: y,
                  guideWidth: width,
                  guideHeight: height,
                }));
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Bottom actionable menu controller tray */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.shutterBtn} onPress={handleCapture} disabled={isProcessing}>
          {isProcessing ? <ActivityIndicator color="#000" /> : <View style={styles.shutterInner} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
  },
  topSpacer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  topHeaderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Fixed aspect ratio container box matching standard 4:3 preview feeds
  cameraBox43: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  uiOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idTargetGuideBox: {
    width: '70%',
    aspectRatio: 1 / 1.58, // Draws a card profile guide optimized for landscape orientation
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 16,
  },
  rotatedInstructionText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: 'bold',
    transform: [{rotate: '90deg'}],
  },
  bottomActionBar: {
    flex: 1.2,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});

/*
{
  cameraWidth: 406.6666564941406, 
  cameraHeight: 542.3333129882812, 
  guideX: 40.66666793823242, 
  guideY: 14, 
  guideWidth: 325.3333435058594, 
  guideHeight: 514
}

cropToViewfinder - photoOrientation: landscape-right, photoWidth: 4096, photoHeight: 


cropToViewfinder - photoOrientation: portrait, photoWidth: 4096, photoHeight: 3072
*/

import {useState, useEffect, useRef, useCallback, useContext} from 'react';
import {View, StyleSheet, PermissionsAndroid, Platform, BackHandler, TouchableOpacity, AppState, Linking} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import * as Location from 'expo-location';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ntpSync from '@ruanitto/react-native-ntp-sync';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {BatteryOptEnabled} from 'react-native-battery-optimization-check';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';

import {NmSendClockAction, NmGetTodayTimeRecords} from '../../../functions/NmNetwork';
import NmStyles, {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {LoadingScreen, LoadingPanel, NmLabel, NmModal} from '../../../components';
import {NmGetGeoAddress, NmGetTimeGreeting, NmHardwareBackPress} from '../../../functions/NmFunctions';
import {APP_CONST, APP_KEYS} from '../../../constants';
import * as turf from '@turf/turf';
import {EventRegister} from 'react-native-event-listeners';
import DeviceInfo from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ClockStatusContext, ClockCoordsContext, AccountDetailsContext, AppConfigContext} from '../../../functions/Contexts';
import {Config} from '../../../app.config.tsx';

//import {resolve} from 'patch-package/dist/path';

var XDate = require('xdate');

const ClockingHome = props => {
  const insets = useSafeAreaInsets();
  const {recuser, recname, loginToken} = useContext(AccountDetailsContext);
  const clockedStatus = useContext(ClockStatusContext);
  const coordsContext = useContext(ClockCoordsContext);
  const {disableMockCheck} = useContext(AppConfigContext);

  const isFocused = useIsFocused();
  const mapRef = useRef();
  const locationSubRef = useRef(null);

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [panelLoading, setPanelLoading] = useState(false);
  const [geoWatchID, setGeoWatchID] = useState();
  const [locIntervalID, setLocIntervalID] = useState();
  const [trackingID, setTrackingID] = useState();

  const [permissionAllowed, setPermissionAllowed] = useState(false);
  const [battOpsDisabled, setBattOpsDisabled] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(false);
  const [fenceData, setFenceData] = useState();
  const [currentFenceData, setCurrentFenceData] = useState();
  const [geofenceArray, setGeofenceArray] = useState();
  const [greeting, setGreeting] = useState('');

  const MESSAGE_TYPE = {
    MSG_NORMAL: 0,
    BATT_OPTIMIZATION: 1,
    LOC_MOCKED: 2,
    LOC_SETTING: 3,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPersist, setModalPersist] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalMessageType, setModalMessageType] = useState(MESSAGE_TYPE.MSG_NORMAL);

  // Get States from online to ensure controls cannot be overriden
  const [clockButtonControl, setClockButtonControl] = useState(false);
  const [clockButtonIcon, setClockButtonIcon] = useState('clock-check-outline');
  const [clockButtonMessage, setClockButtonMessage] = useState('Clock In');
  const [clockButtonColor, setClockButtonColor] = useState('#c4c4c4ff');

  const [clockInEnabled, setClockInEnabled] = useState(false);
  const [clockOutEnabled, setClockOutEnabled] = useState(false);

  // Break function variables
  const [breakButtonControl, setBreakButtonControl] = useState(false);
  const [breakButtonIcon, setBreakButtonIcon] = useState('coffee-outline');
  const [breakButtonMessage, setBreakButtonMessage] = useState('Start Break');
  const [breakButtonColor, setBreakButtonColor] = useState('#c4c4c4ff');
  const [breakOngoing, setBreakOngoing] = useState(false);

  const [userClockedData, setUserClockedData] = useState();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [preciseLoc, setPreciseLoc] = useState('...');

  const [initialRegion, setInitialRegion] = useState({
    latitude: 12.2339822,
    longitude: 122.8341213,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    // Check Battery and Location settings
    initializeChecks();

    // Set Clock for UI
    var options = {};
    var clock = (ntp = new ntpSync(options));

    var currentTime = clock.getTime();
    const intervalId = setInterval(() => {
      currentTime = clock.getTime();
      setCurrentTime(new Date(currentTime));
    }, 1000);

    setGreeting(NmGetTimeGreeting(currentTime));

    // Get watchID
    (async () => {
      const currentTrackID = await AsyncStorage.getItem(APP_CONST.NIT_TRACKID);
      if (currentTrackID) {
        setTrackingID(parseInt(currentTrackID));
      }
    })();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const customBackpress = useCallback(() => {
    if (clockedStatus == APP_CONST.NIT_NOTCLOCKED || clockedStatus == APP_CONST.NIT_CLOCKEDOUT) {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }

      (async () => {
        await AsyncStorage.removeItem(APP_CONST.NIT_TEMPSTORE);
      })();
    }

    props.navigation.goBack();
    return true;
  }, [locIntervalID]);

  NmHardwareBackPress(customBackpress);

  useEffect(() => {
    return () => {
      clearInterval(locIntervalID);
    };
  }, [locIntervalID]);

  useFocusEffect(
    useCallback(() => {
      // 1. Screen GAINED focus:
      // If permissions are ready and user is NOT clocked in, start foreground UI location watch.
      // (If user IS clocked in, the background service is already tracking coordinates).
      if (permissionAllowed && (clockedStatus === APP_CONST.NIT_NOTCLOCKED || clockedStatus === APP_CONST.NIT_CLOCKEDOUT)) {
        startLocationWatch();
      }

      // AppState change listener for when app returns from background
      const handleAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
          initializeChecks();
        }
      };
      const subscription = AppState.addEventListener('change', handleAppStateChange);

      // 2. Screen LOST focus (user switches tabs, navigates forward/backward):
      return () => {
        subscription.remove();

        // Stop foreground map location tracking ONLY
        if (locationSubRef.current) {
          locationSubRef.current.remove();
          locationSubRef.current = null;
        }
      };
    }, [permissionAllowed, clockedStatus]),
  );

  // For IOS Swipe back (BackHandler counterpart on Android)
  useEffect(() => {
    const beforeRemoveListener = props.navigation.addListener('beforeRemove', e => {
      if (clockedStatus == APP_CONST.NIT_NOTCLOCKED || clockedStatus == APP_CONST.NIT_CLOCKEDOUT) {
        if (locationSubRef.current) {
          locationSubRef.current.remove();
          locationSubRef.current = null;
        }
      }
    });

    return () => {
      beforeRemoveListener();
    };
  }, [clockedStatus]);

  useEffect(() => {
    if (geofenceStatus == true) {
      if (clockInEnabled == true) {
        setClockButtonColor('#0aa6eeff');
      }

      if (clockOutEnabled == true) {
        setBreakButtonControl(true);
        setBreakButtonColor(breakOngoing == false ? '#f59b34ff' : '#1b42c0ff');
        setClockButtonColor('#c22a25ff');
      }

      if (clockInEnabled == true || clockOutEnabled == true) {
        setClockButtonControl(true);
      }
    } else {
      disableButtonControls();
    }
  }, [geofenceStatus, clockInEnabled, clockOutEnabled, breakOngoing]);

  useEffect(() => {
    EventRegister.emit('UpdateCurrentTimeSheet', userClockedData);
  }, [userClockedData]);

  // Load User Time Data and Generate Geofence Data
  useEffect(() => {
    if (userData) {
      checkUserTimeData();
    }

    if (fenceData) {
      generateGeofenceData();
    }
  }, [userData, fenceData]);

  // After initializeChecks is complete
  useEffect(() => {
    if (permissionAllowed == true) {
      (async () => {
        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const {latitude, longitude} = position.coords;
          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });

          mapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000,
          );
        } catch (error) {
          console.warn('Initial GPS fix failed:', error);
        } finally {
          getUserDataRecords();
        }
      })();
    }
  }, [permissionAllowed]);

  // For Geofence check
  useEffect(() => {
    if (geofenceArray) {
      GeoFenceCheck();
      setLoading(false);
    }
  }, [geofenceArray]);

  useEffect(() => {
    if (geofenceArray) {
      EventRegister.emit('UserCurrentCoords', {latitude: initialRegion.latitude, longitude: initialRegion.longitude});
      GeoFenceCheck();
    }
  }, [initialRegion]);

  //For saving watchPosition ID
  useEffect(() => {
    if (trackingID) {
      (async () => {
        await AsyncStorage.setItem(APP_CONST.NIT_TRACKID, trackingID + '');
      })();
    }
  }, [trackingID]);

  const initializeChecks = () => {
    BatteryOptEnabled().then(isEnabled => {
      if (isEnabled) {
        showModalMessage(
          'Please disable any battery optimizations enabled on the app. This will ensure the Live Tracking feature will run in the background continuously.',
          MESSAGE_TYPE.BATT_OPTIMIZATION,
        );
      } else {
        requestLocationPermission();
      }
    });
  };

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const fineLocation = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

        const hasFinePermission = await PermissionsAndroid.check(fineLocation);

        if (hasFinePermission) {
          setModalVisible(false);
          setPermissionAllowed(true);
          return;
        }

        // 2. Request ONLY foreground location ("While using the app")
        const granted = await PermissionsAndroid.request(fineLocation, {
          title: 'NOAH Location Access',
          message: 'NOAH requires your current location to verify workplace geofences.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setModalVisible(false);
          setPermissionAllowed(true);
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          showModalMessage('Location permission is permanently denied. Please allow location in system settings to continue.', MESSAGE_TYPE.LOC_SETTING);
        } else {
          showModalMessage('Please allow location permission to use clocking features.', MESSAGE_TYPE.LOC_SETTING);
        }
      } catch (err) {
        console.warn('Location permission request error:', err);
      }
    } else if (Platform.OS === 'ios') {
      // On iOS, request WhenInUse first; upgrade to Always only if necessary
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status === RESULTS.GRANTED) {
        setPermissionAllowed(true);
        setModalVisible(false);
      } else {
        const reqStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (reqStatus === RESULTS.GRANTED) {
          setPermissionAllowed(true);
          setModalVisible(false);
        } else {
          showModalMessage('Please allow location permission to continue.', MESSAGE_TYPE.LOC_SETTING);
        }
      }
    }
  }

  // async function requestLocationPermission() {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION], {
  //         title: 'NOAH',
  //         message: 'Allow app to access location to determine your current location',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       });

  //       if (granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] == PermissionsAndroid.RESULTS.GRANTED) {
  //         setModalVisible(false);
  //         setPermissionAllowed(true);
  //       } else if (granted[(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)] == PermissionsAndroid.RESULTS.DENIED) {
  //         showModalMessage('Please allow precise/always location permission for the app inside the settings app to continue.', MESSAGE_TYPE.LOC_SETTING);
  //       } else if (granted[(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //         showModalMessage('Please allow precise/always location permission for the app inside the settings app to continue.', MESSAGE_TYPE.LOC_SETTING);
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(status => {
  //       switch (status) {
  //         case RESULTS.DENIED: {
  //           //('The permission has not been requested / is denied but requestable');
  //           request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(reqSatus => {
  //             switch (reqSatus) {
  //               case RESULTS.GRANTED:
  //                 {
  //                   setPermissionAllowed(true);
  //                   setModalVisible(false);
  //                 }
  //                 break;
  //               case RESULTS.DENIED:
  //                 showModalMessage('Please allow precise location permission to continue.');
  //                 break;
  //             }
  //           });
  //         }
  //         case RESULTS.BLOCKED:
  //           showModalMessage('Please allow precise/always location permission for the app inside the settings app to continue.', MESSAGE_TYPE.LOC_SETTING);
  //           break;
  //         case RESULTS.GRANTED:
  //           {
  //             setPermissionAllowed(true);
  //             setModalVisible(false);
  //           }
  //           break;
  //         case RESULTS.LIMITED:
  //           showModalMessage('Please allow precise location permission to continue.');
  //           break;
  //       }
  //     });
  //   }
  // }

  async function isLocationMocked() {
    const isSimulator = await DeviceInfo.isEmulator();
    if (disableMockCheck || Config.APP_DISABLE_MOCKCHECK || isSimulator) {
      return false;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Fast, uses cell/wifi/GPS combined
      });
      return Boolean(loc.mocked);
    } catch (e) {
      console.warn('Mock check error:', e);
      return false;
    }
  }

  async function getUserDataRecords() {
    NmGetTodayTimeRecords(recuser, loginToken).then(response => {
      if (response.status == '200') {
        const clockData = response.data;
        setUserData(clockData);

        let tempFenceData = [];
        try {
          if (response.ldata?.length > 0) {
            let rfenceData = JSON.parse(response.ldata);

            let uniqueComps = [...new Set(rfenceData.map(item => item.Company))];
            let uniqueBranch = [...new Set(rfenceData.map(item => item.Branch))];

            uniqueComps.forEach(compName => {
              uniqueBranch.forEach(branchName => {
                const compBranchIndex = rfenceData.findIndex(item => item.Company == compName && item.Branch == branchName);
                if (compBranchIndex >= 0) {
                  if (rfenceData[compBranchIndex]?.Coordinates != '' && rfenceData[compBranchIndex]?.Radius != '') {
                    const newRadFenceObject = {
                      type: 'RADIUS',
                      coords: rfenceData[compBranchIndex].Coordinates,
                      radius: rfenceData[compBranchIndex].Radius,
                      company: rfenceData[compBranchIndex].Company,
                      branch: rfenceData[compBranchIndex].Branch,
                    };

                    tempFenceData.push(newRadFenceObject);
                  }

                  if (rfenceData[compBranchIndex]?.Coordinates == '' && rfenceData[compBranchIndex]?.Radius == null) {
                    const filteredCoords = rfenceData.filter(item => item.Company == compName && item.Branch == branchName);

                    let newPoints = filteredCoords.map(item => item.LocPol);
                    newPoints.sort((a, b) => (a.Rowno = b.Rowno));
                    newPoints = [...newPoints, newPoints[0]];
                    const newRadFenceObject = {
                      type: 'POLYGON',
                      coords: newPoints,
                      company: rfenceData[compBranchIndex].Company,
                      branch: rfenceData[compBranchIndex].Branch,
                    };

                    tempFenceData.push(newRadFenceObject);
                  }
                }
              });
            });
          } else {
            setLoading(false);
          }
        } catch (e) {}

        setFenceData(tempFenceData);
      } else {
        setLoading(false);
        showModalMessage('Error occured when fetching user data.');
      }
    });
  }

  async function checkUserTimeData(fromHome = false) {
    if (userClockedData == undefined) {
      const clockData = JSON.parse(userData);
      if (userData != undefined) {
        const clockedInData = clockData.ClockedInTable;
        const clockedOutData = clockData.ClockedOutTable;

        if (clockedInData.length == 0 && clockedOutData.length == 0) {
          EventRegister.emit('UserClockedStatus', APP_CONST.NIT_NOTCLOCKED);

          const isMocked = await isLocationMocked();
          if (isMocked == true) {
            showModalMessage('Cannot Continute: Fake Location Detected!', MESSAGE_TYPE.LOC_MOCKED, true);
            setTimeout(() => {
              setModalVisible(false);
              props.navigation.goBack();
            }, 4000);
          } else if (isMocked == false) {
            startLocationWatch();
          } else {
            //Handle mock check failure
          }

          setClockInEnabled(true);
        } else if (clockedInData.length >= 1 && clockedOutData.length == 0) {
          EventRegister.emit('UserClockedStatus', APP_CONST.NIT_CLOCKEDIN);
          const intervalID = startLocationFetch();
          setLocIntervalID(intervalID);
          // Clock Button Management
          setClockButtonIcon('stop-circle-outline');
          setClockButtonMessage('Clock Out');
          setClockOutEnabled(true);

          // Break Button Management
          setBreakButtonControl(true);
          let breakData = clockData?.TimeSheetTable.filter(row => row.Tag == 2 || row.Tag == 3);

          if (breakData?.length > 0) {
            const latestBreakTag = breakData[breakData.length - 1].Tag;

            if (latestBreakTag == 2) {
              //setBreakButtonColor('#1b42c0ff');
              setBreakButtonMessage('Stop Break');
              setBreakButtonIcon('coffee-off');
              setBreakOngoing(true);
            } else if (latestBreakTag == 3) {
              setBreakButtonMessage('Start Break');
              setBreakButtonIcon('coffee-outline');
              setBreakOngoing(false);
            }
          }
        } else if (clockedInData.length >= 1 && clockedOutData.length >= 1) {
          const isMocked = await isLocationMocked();
          if (isMocked == true) {
            showModalMessage('Cannot Continute: Fake Location Detected!', MESSAGE_TYPE.LOC_MOCKED, true);
            setTimeout(() => {
              setModalVisible(false);
              props.navigation.goBack();
            }, 4000);
          } else if (isMocked == false) {
            startLocationWatch();
          } else {
            //Handle mock check failure
          }
          EventRegister.emit('UserClockedStatus', APP_CONST.NIT_CLOCKEDOUT);
        }

        setUserClockedData(clockData);
      } else {
        //
      }
    }
  }

  function generateGeofenceData() {
    let fenceArray = [];

    if (fenceData != undefined && fenceData?.length > 0) {
      fenceData.forEach(fence => {
        if (fence.type == 'RADIUS') {
          const splitCoords = fence.coords.split(', ');
          let cset = [];
          cset.push(splitCoords[1]);
          cset.push(splitCoords[0]);

          var center = turf.point(cset);
          const radiusInKm = fence.radius / 1000;
          const options = {units: 'kilometers'};
          const geofence = turf.circle(center, radiusInKm, options);

          let newPolygon = [];
          let newCoSet = [];

          geofence.geometry.coordinates[0].forEach(coord => {
            newCoSet = [];
            newCoSet.push(coord[1]);
            newCoSet.push(coord[0]);
            newPolygon.push(newCoSet);
          });

          var poly = turf.polygon([newPolygon]);

          fenceArray.push({polygon: poly, company: fence.company, branch: fence.branch});
        } else if (fence.type == 'POLYGON') {
          let newPolygon = [];
          let newCoSet = [];

          fence.coords.forEach(coset => {
            newCoSet = [];
            const splitSet = coset.split(', ');
            newCoSet.push(parseFloat(splitSet[0]));
            newCoSet.push(parseFloat(splitSet[1]));
            newPolygon.push(newCoSet);
          });

          var poly = turf.polygon([newPolygon]);
          fenceArray.push({polygon: poly, company: fence.company, branch: fence.branch});
        }
      });

      setGeofenceArray(fenceArray);
    }
  }

  async function sendClockAction(clockAction) {
    //setPanelLoading(true);

    let liveTrackingData = [];
    if (clockAction == APP_KEYS.CLOCK_ACTION_CLOCKOUT) {
      const savedTrackingData = await AsyncStorage.getItem(APP_CONST.NIT_TEMPSTORE);
      liveTrackingData = savedTrackingData ? JSON.parse(savedTrackingData) : [];
    }

    const actionData = {
      _logDatetime: new XDate(currentTime).toString('yyyy/MM/dd HH:mm:ss.fff'),
      _logCoords: 'lat: ' + initialRegion.latitude + ', long: ' + initialRegion.longitude,
      _logCoordsDesc: currentFenceData?.company + ' - ' + currentFenceData?.branch, //preciseLoc,
      _logLocInfo: currentFenceData,
      _logLocTracking: liveTrackingData,
    };

    await NmSendClockAction(recuser, loginToken, clockAction, JSON.stringify(actionData)).then(response => {
      if (response.status == '200') {
        NmGetTodayTimeRecords(recuser, loginToken).then(response => {
          if (response.status == '200') {
            const clockData = response.data;
            setUserClockedData(JSON.parse(clockData));

            switch (clockAction) {
              case APP_KEYS.CLOCK_ACTION_CLOCKIN:
                {
                  try {
                    startBackgroundTask();
                  } catch (e) {
                    //
                  } finally {
                    EventRegister.emit('UserClockedStatus', APP_CONST.NIT_CLOCKEDIN);
                    setClockButtonMessage('Clock Out');
                    setClockButtonIcon('stop-circle-outline');
                    setClockInEnabled(false);

                    setClockOutEnabled(true);
                    setBreakButtonControl(true);
                  }
                }
                break;
              case APP_KEYS.CLOCK_ACTION_CLOCKOUT:
                {
                  clearInterval(locIntervalID);
                  BackgroundService.stop();
                  if (locationSubRef.current) {
                    locationSubRef.current.remove();
                    locationSubRef.current = null;
                  }

                  EventRegister.emit('UserClockedStatus', APP_CONST.NIT_CLOCKEDOUT);
                  setClockButtonMessage('Clock In');
                  setClockButtonIcon('clock-check-outline');
                  setClockOutEnabled(false);

                  setBreakButtonMessage('Start Break');
                  setBreakButtonIcon('coffee-outline');
                  //refreshLocation();
                  disableButtonControls();
                  startLocationWatch();
                }
                break;
              case APP_KEYS.CLOCK_ACTION_STARTBREAK:
                {
                  setBreakButtonControl(true);
                  setBreakButtonMessage('Stop Break');
                  setBreakButtonIcon('coffee-off');
                  setBreakOngoing(true);
                }
                break;
              case APP_KEYS.CLOCK_ACTION_STOPBREAK:
                {
                  setBreakButtonMessage('Start Break');
                  setBreakButtonIcon('coffee-outline');
                  setBreakOngoing(false);
                }
                break;
            }
            setPanelLoading(false);
          } else {
            setPanelLoading(false);
            showModalMessage('Error occured when fetching user data.');
          }
        });
      } else {
        setPanelLoading(false);
        showModalMessage('Unable to process request');
      }
    });
  }

  function GeoFenceCheck() {
    try {
      var pt = turf.point([initialRegion.latitude, initialRegion.longitude]);
      let insideFenceCtr = 0;

      if (geofenceArray?.length > 0) {
        geofenceArray.forEach(polyData => {
          const inFence = turf.booleanPointInPolygon(pt, polyData.polygon);

          if (inFence == true) {
            setCurrentFenceData({company: polyData.company, branch: polyData.branch});
            insideFenceCtr += 1;
          }
        });

        if (insideFenceCtr == 0) {
          setCurrentFenceData({company: 'Unknown Location', branch: 'Unknown Address'});
        }
      }

      setGeofenceStatus(insideFenceCtr > 0 ? true : false);
    } catch (e) {
      console.log('GeoFenceCheck', e.toString());
    }
  }

  async function startLocationWatch() {
    try {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 5,
          // iOS requirement
          showsBackgroundLocationIndicator: true,
        },
        position => {
          const {latitude, longitude} = position.coords;
          setInitialRegion(prev => ({
            ...prev,
            latitude,
            longitude,
          }));

          mapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            },
            800,
          );

          setLoading(false);
        },
      );

      locationSubRef.current = subscription;
    } catch (error) {
      setLoading(false);
      console.warn('startLocationWatch error:', error);
    }
  }

  const bgTaskOptions = {
    taskName: 'BGLocService',
    taskTitle: 'NOAHinTouch Live Tracking',
    taskDesc: 'Location data is currently saved.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    linkingURI: 'noahmobile://',
  };

  async function startBackgroundTask() {
    //await AsyncStorage.setItem(APP_CONST.NIT_TEMPSTORE, JSON.stringify([{latitude: initialRegion.latitude, longitude: initialRegion.longitude}]));

    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }

    await BackgroundService.start(startGeolocationWatch, bgTaskOptions);
    //const intervalID = startLocationFetch();
    //setLocIntervalID(intervalID);
  }

  const startLocationFetch = () => {
    const intervalId = setInterval(async () => {
      const storedLocations = await AsyncStorage.getItem(APP_CONST.NIT_TEMPSTORE);
      if (storedLocations) {
        const parseStoredLocations = JSON.parse(storedLocations);
        setInitialRegion({
          latitude: parseStoredLocations[parseStoredLocations.length - 1].latitude,
          longitude: parseStoredLocations[parseStoredLocations.length - 1].longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    }, 1000);

    return intervalId;
  };

  async function startGeolocationWatch() {
    await new Promise(async () => {
      let bgSub = null;
      try {
        bgSub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          async position => {
            try {
              if (Config.APP_DISABLE_MOCKCHECK || disableMockCheck == true || position?.mocked == false) {
                const existingLocations = await AsyncStorage.getItem(APP_CONST.NIT_TEMPSTORE);
                const locations = existingLocations ? JSON.parse(existingLocations) : [];

                const newLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                locations.push(newLocation);

                await AsyncStorage.setItem(APP_CONST.NIT_TEMPSTORE, JSON.stringify(locations));
              }
            } catch (e) {
              console.log('TSave Err:', e.toString());
            }
          },
        );
      } catch (error) {
        console.log('WL Err:', error);
      }
    });
  }

  function showModalMessage(message, messageType = MESSAGE_TYPE.MSG_NORMAL, isFixed = false) {
    setModalMessageType(messageType);
    setModalPersist(isFixed);
    setModalMessage(message);
    setModalVisible(true);
  }

  function disableButtonControls() {
    setBreakButtonControl(false);
    setClockButtonControl(false);
    setBreakButtonColor('#c4c4c4ff');
    setClockButtonColor('#c4c4c4ff');
  }

  function getCurrentLocationInfo() {
    NmGetGeoAddress(initialRegion.latitude, initialRegion.longitude).then(res => {
      if (res.status == 'OK') {
        setPreciseLoc(res.formattedAddress);
      } else {
        setPreciseLoc('Cannot provide location details');
      }
      setLoading(false);
    });
  }

  const fenceCompany = currentFenceData == undefined ? 'Unknown Company' : currentFenceData?.company;
  const fenceBranch = currentFenceData == undefined ? 'Unkown Branch' : currentFenceData?.branch;

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      {panelLoading && <LoadingPanel />}

      <NmModal
        title={'NOAHinTouch'}
        customContent={true}
        winVisible={modalVisible}
        setWinVisible={setModalVisible}
        onBackdropPress={() => {}}
        {...(modalPersist && {onBackButtonPress: () => {}, closeButtonStyle: {opacity: 0}})}
        {...(modalMessageType == MESSAGE_TYPE.BATT_OPTIMIZATION && {
          onBackButtonPress: () => {
            //Close modal, disable other tabs and buttons, then stop loading -- implement with onbackdrop and on close button press
          },
        })}>
        <View style={{backgroundColor: '#FFF', padding: 6}}>
          <NmLabel>{modalMessage}</NmLabel>
          {(modalMessageType == MESSAGE_TYPE.BATT_OPTIMIZATION || modalMessageType == MESSAGE_TYPE.LOC_SETTING) && (
            <TouchableOpacity
              style={{marginTop: 10}}
              activeOpacity={0.6}
              onPress={() => {
                Linking.openSettings();
              }}>
              <NmLabel style={[NmStyles.poppinsBold, {alignSelf: 'center', textDecorationLine: 'underline', color: '#1974D1'}]}>{'Open App Settings'}</NmLabel>
            </TouchableOpacity>
          )}
        </View>
      </NmModal>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={initialRegion}
        showsUserLocation={isFocused}
        showsMyLocationButton={false}
        loadingEnabled={true}
        //zoomEnabled={false}
        //rotateEnabled={false}
        //scrollEnabled={false}
        pitchEnabled={false}
        moveOnMarkerPress={false}>
        {fenceData?.map((data, index) => {
          if (data.type == 'RADIUS') {
            const splitCoords = data.coords.split(', ');
            let cset = [];
            cset.push(splitCoords[1]);
            cset.push(splitCoords[0]);

            const cPoint = {
              latitude: parseFloat(splitCoords[0]),
              longitude: parseFloat(splitCoords[1]),
            };

            var center = turf.point(cset);

            const radiusInKm = data.radius / 1000;
            const options = {units: 'kilometers'};
            const geofence = turf.circle(center, radiusInKm, options);

            const coordinates = geofence.geometry.coordinates[0].map(coord => ({
              longitude: coord[0],
              latitude: coord[1],
            }));

            return (
              <View key={index.toString()}>
                <Polygon coordinates={coordinates} strokeColor="#00ff2254" fillColor="rgba(0, 65, 204, 0.31)" strokeWidth={1} />
                <Marker coordinate={cPoint} title={data.company} description={data.branch} tracksViewChanges={false}>
                  <MaterialIcons name={'location-pin'} size={20} color={'#195999'} />
                </Marker>
              </View>
            );
          } else if (data.type == 'POLYGON') {
            const parsedCoords = data.coords;
            let newSet = [];
            parsedCoords.forEach(coord => {
              const splitC = coord.split(', ');
              newSet.push({
                latitude: parseFloat(splitC[0]),
                longitude: parseFloat(splitC[1]),
              });
            });

            const sumCoords = [...newSet];

            let sumLatitudes = 0;
            let sumLongitudes = 0;

            sumCoords.forEach(coord => {
              sumLatitudes += coord.latitude;
              sumLongitudes += coord.longitude;
            });

            const centerLatitude = sumLatitudes / sumCoords.length;
            const centerLongitude = sumLongitudes / sumCoords.length;

            const centerCoordinate = {
              latitude: centerLatitude,
              longitude: centerLongitude,
            };

            return (
              <View key={index.toString()}>
                <Polygon key={index.toString()} coordinates={newSet} strokeColor="#00ff2254" fillColor="rgba(0, 65, 204, 0.31)" strokeWidth={1} />
                <Marker coordinate={centerCoordinate} title={data.company} description={data.branch} tracksViewChanges={false}>
                  <MaterialIcons name={'location-pin'} size={20} color={'#195999'} />
                </Marker>
              </View>
            );
          }
        })}
      </MapView>

      {/* Current Location Data */}
      <View style={[styles.locationContainer, {top: insets.top + 6}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <NmLabel style={[NmStyles.poppinsMedium, {marginBottom: -2, lineHeight: 22, fontSize: 20, paddingTop: 2}]} numberOfLines={1}>
            {greeting}
          </NmLabel>
        </View>
        <View style={{height: 1, backgroundColor: '#2E7FF9', width: '100%', marginBottom: 10}}></View>
        <View style={{flexDirection: 'row', marginBottom: 12, alignItems: 'center'}}>
          <MaterialCommunityIcons name={'account-outline'} color={'#2E7FF9'} size={24} style={{width: 24}} />
          <View>
            <NmLabel style={[NmStyles.poppinsBold, {marginLeft: 10, marginBottom: -2, lineHeight: 20}]} numberOfLines={1}>
              {recname}
            </NmLabel>
            <NmLabel style={[{marginLeft: 10, marginTop: 4, lineHeight: 13, fontSize: 11, color: '#AAA'}]} numberOfLines={1}>
              {recuser}
            </NmLabel>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 12, alignItems: 'center'}}>
          <MaterialCommunityIcons name={'office-building-marker-outline'} color={'#2E7FF9'} size={24} style={{width: 24}} />
          <View>
            <NmLabel style={[NmStyles.poppinsBold, {marginLeft: 10, marginBottom: -2, lineHeight: 20}]} numberOfLines={1}>
              {fenceCompany}
            </NmLabel>
            <NmLabel style={[{marginLeft: 10, marginTop: 4, lineHeight: 13, fontSize: 11, color: '#AAA'}]} numberOfLines={1}>
              {fenceBranch}
            </NmLabel>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name={'clock-time-eight-outline'} color={'#2E7FF9'} size={24} style={{width: 24}} />
          <View>
            <NmLabel style={[NmStyles.poppinsBold, {marginLeft: 10, marginBottom: -2, lineHeight: 20}]} numberOfLines={1}>
              {currentTime.toLocaleTimeString()}
            </NmLabel>
            <NmLabel style={[{marginLeft: 10, marginTop: 4, lineHeight: 13, fontSize: 11, color: '#AAA'}]} numberOfLines={1}>
              {new XDate().toString('MMM dd, yyyy')}
            </NmLabel>
          </View>
        </View>
      </View>

      {/* {Platform.OS == 'ios' && <View style={{position: 'absolute', left: 0, width: 12, height: '100%', backgroundColor: '#ffffff01'}}></View>} */}

      <View style={styles.breakControls}>
        <View style={[styles.breakButtons, {marginBottom: 10, backgroundColor: '#FFF', width: 138}]}>
          {/* #0aa6eeff */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.breakButtons, {backgroundColor: clockButtonColor, padding: 10, width: '100%', justifyContent: 'center', paddingVertical: 14}]}
            disabled={!clockButtonControl}
            onPress={() => {
              if (clockInEnabled == true) {
                sendClockAction(APP_KEYS.CLOCK_ACTION_CLOCKIN);
              } else if (clockOutEnabled == true) {
                sendClockAction(APP_KEYS.CLOCK_ACTION_CLOCKOUT);
              }
            }}>
            <MaterialCommunityIcons name={clockButtonIcon} color={'#FFF'} size={20} style={{}} />
            <NmLabel style={[NmStyles.poppinsMedium, {marginLeft: 10, marginRight: 4, marginBottom: -2, color: '#FFF', fontSize: 15}]} numberOfLines={1}>
              {clockButtonMessage}
            </NmLabel>
          </TouchableOpacity>
        </View>
        <View style={[styles.breakButtons, {marginBottom: 10, backgroundColor: '#FFF', width: 138}]}>
          {/* #f59b34ff */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.breakButtons, {backgroundColor: breakButtonColor, padding: 10, width: '100%', justifyContent: 'center', paddingVertical: 14}]}
            disabled={!breakButtonControl}
            onPress={() => {
              if (breakOngoing == true) {
                sendClockAction(APP_KEYS.CLOCK_ACTION_STOPBREAK);
              } else if (breakOngoing == false) {
                sendClockAction(APP_KEYS.CLOCK_ACTION_STARTBREAK);
              }
            }}>
            <MaterialCommunityIcons name={breakButtonIcon} color={'#FFF'} size={20} style={{}} />
            <NmLabel style={[NmStyles.poppinsMedium, {marginLeft: 10, marginRight: 4, marginBottom: -2, color: '#FFF', fontSize: 15}]} numberOfLines={1}>
              {breakButtonMessage}
            </NmLabel>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  locationContainer: {
    width: '92%',
    backgroundColor: '#FFF',
    borderRadius: 6,
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 2, // Android specific elevation
      },
    }),
  },
  breakControls: {
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  breakButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 1.4, // Android specific elevation
      },
    }),
  },
});

export default ClockingHome;

import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Pressable, BackHandler, TouchableOpacity, ToastAndroid} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeInLeft, FadeOutLeft, FadeInRight, FadeOutRight, useSharedValue, runOnJS} from 'react-native-reanimated';
import {Gesture, GestureDetector, Directions, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ClearCache from '@type-any/react-native-clear-cache';
import XDate from 'xdate';

import {APP_CONST} from '../constants/NmConstants.js';
import {ThemesContext} from '../functions/ThemeContext.tsx';
import {NotifDataContext, AccountDetailsContext, AppConfigContext} from '../functions/Contexts.tsx';
import {getDashboardIcon, UIConfig} from '../Global/UIConfig.js';
import {NmNewsBanner, NmModalBanner} from '../components/index.jsx';
import NmStyles, {WINDOW_WIDTH} from '../constants/NmStyles.tsx';
import {Config} from '../app.config.tsx';
import {NmGetLocalScreenName} from '../navigation/NavigationRef.tsx';
import {ConfigDetails} from '../functions/NmAppConfig.tsx';
import {NmHomeDrawerNavigate} from '../functions/NmNotifications.tsx';
import {APP_KEYS} from '../constants/NmConstants.js';
import {NmGetSetting, NmSaveSetting, NmDevItems} from '../functions/NmFunctions.tsx';
import {NmGetMobileUpdates} from '../functions/NmNetwork.tsx';

import {StackScreenProps} from '../navigation/NavigationTypes.tsx';

type Props = StackScreenProps<'Home'>;

const HomepageScreen = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {v9Link, hideAnnouncement, AssetManager} = useContext(AppConfigContext);
  const {propertyName, setHeaderTitle, recuser, recname, loginToken, companyCode, demoMode, noahStandard, dashboardView} = useContext(AccountDetailsContext);
  const {theme} = useContext(ThemesContext);
  const NotifData = useContext(NotifDataContext);

  const [infoMessage, setInfoMessaeg] = useState<string>('');
  const [announcementVisible, setAnnouncementVisible] = useState<boolean>(false);
  const [serverImgUrl, setServerImgUrl] = useState<string>('');
  const [announcementData, setAnnouncementData] = useState<any[]>([]);

  const isFocused = useIsFocused();

  const [iconColCount, setIconColCount] = useState<number>(3);
  const carouselRef = useRef<any>(null);

  const AppStandard = ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? true : false;

  const boardMessage = AppStandard == true ? 'Welcome to your Dashboard.' : 'Kindly choose your transaction below.';
  const boardGreeting = AppStandard == true ? 'Hi,' : 'Welcome,';
  const emptyDashboard = AppStandard == true ? 'Dashboard shortcuts not configured.' : 'No transactions for approval.';

  const [clicked, setClicked] = useState<number>(-1);
  const [featureNotAvailable, setFeatureNotAvailable] = useState<boolean>(false);

  const myItems = Config.APP_MODE_DEV
    ? NmDevItems(
        [], //AssetManager.appAssets.DashboardIcons,
        {
          // demoSingleAPI: true,
          // clocking: Config.HOME_CLOCKINGSYSTEM,
          // demoMode: true,
          // ocrFunction: true,
          wfmApprove: true,
        },
      )
    : NmDevItems(AssetManager.appAssets.DashboardIcons, {
        demoMode: demoMode,
      });

  const [greetingVisible, setGreetingVisible] = useState<boolean>(true);

  const bibleVerse = AssetManager.appAssets.BibleVerseData;
  const bibleVerseLength = Object.keys(bibleVerse || {}).length > 0 ? true : false;

  const [bannerCounter, setBannerCounter] = useState<number>(1);

  const initialInterval = 5000;
  const standardInterval = 10000;

  let BannerTimer: ReturnType<typeof setInterval>;

  const swipeToLeft = useSharedValue(false);
  const swipeToRight = useSharedValue(false);

  let enterAnimation = swipeToLeft.value ? FadeInRight.duration(500) : FadeInLeft.duration(500);
  let exitAnimation = swipeToLeft.value ? FadeOutLeft.duration(500) : FadeOutRight.duration(500);

  const ToLeftGesture = Gesture.Fling()
    .enabled(bibleVerseLength)
    .direction(Directions.LEFT)
    .onStart(() => {
      swipeToLeft.value = true;
      runOnJS(animateGreetings)();
    })
    .onEnd(() => {
      runOnJS(resetBannerTimer)();
    });

  const ToRightGesture = Gesture.Fling()
    .enabled(bibleVerseLength)
    .direction(Directions.RIGHT)
    .onStart(() => {
      swipeToRight.value = true;
      runOnJS(animateGreetings)();
    })
    .onEnd(() => {
      runOnJS(resetBannerTimer)();
    });

  function resetBannerTimer(): void {
    swipeToLeft.value = false;
    swipeToRight.value = false;

    clearInterval(BannerTimer);
  }

  useFocusEffect(
    React.useCallback(() => {
      setHeaderTitle('');
      return () => {};
    }, []),
  );

  useEffect(() => {
    function handleBackButton(): boolean {
      navigation.pop();
      navigation.navigate('LoginOptionScreen');
      return true;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    NmGetMobileUpdates({
      user: recuser,
      token: loginToken,
      compcode: companyCode,
      datatype: APP_CONST.MUC_ANNOUNCE,
    }).then((response: any) => {
      if (response.status == '200') {
        if (response.data.Updates.length > 0) {
          const aData = response.data.Updates;
          const sLink = response.data.ImgLink;

          // Code: "000000000005"
          // ContentImage: "&per=%2ByXJYW3gCAlJOuv6YMkbCR8C98fYo3dcRZdtSidKu%2FUjYJpK9ML2%2FYqHuvCemMo2RhStidCMtQfWQxEJuuRQKRYlRs0t0490qqDV3iRbNd7Bj1ZdpfbtW8033UOC%2FZfa&scky=VBWCCUGCVXAL1SXG5C9LOH20NS7CQ9&ftype=.png"
          // ContentLink: "http://localhost:51123/NOAHMobCMS?nwc=C65FFq1Cx183CC8Cqx1q516x115C5q1x1C6x1qFF1a1FFC6F&isv9=1"
          // Summary: "Menu item sp modified to get latest data for refresh function"
          // Title: "Announce this"

          setAnnouncementData(aData);
          setServerImgUrl(sLink);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (Config.HOME_SHOW_ANNOUNCEMENT == true) {
      if (isFocused && announcementData.length > 0) {
        if (hideAnnouncement == undefined || hideAnnouncement == null) {
          showAnnouncementBanner();
        } else {
          const todayDate = new XDate().setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
          const savedDate = new XDate(hideAnnouncement);

          if (savedDate < todayDate) {
            showAnnouncementBanner();
          }
        }
      }
    }
  }, [announcementData, isFocused]);

  useEffect(() => {
    if (bibleVerseLength && noahStandard == 'NOAH') {
      BannerTimer = setInterval(
        () => {
          animateGreetings();
        },
        bannerCounter < 3 ? initialInterval : standardInterval,
      );

      return () => clearInterval(BannerTimer);
    }
  }, []);

  function animateGreetings(): void {
    setGreetingVisible(!greetingVisible);

    if (bannerCounter < 3) {
      setBannerCounter(bannerCounter + 1);
    }
  }

  useEffect(() => {
    (async () => {
      const clickedNotification = await NmGetSetting(APP_KEYS.NOTIF_ACTION_CLICK);

      if (clickedNotification) {
        const TempNotifData = {...clickedNotification.data};

        try {
          setTimeout(() => {
            NmHomeDrawerNavigate({
              notificationData: TempNotifData,
              navigation: navigation,
              setHeaderTitle: setHeaderTitle,
            });
          }, 1000);

          await NmSaveSetting(APP_KEYS.NOTIF_ACTION_CLICK, undefined);
        } catch (e: any) {
          console.log('NOTIF DATA ERR:', e.toString());
        }
      }
    })();
  }, []);

  const [rowVerticalMargin, setRowVerticalMargin] = useState<number>(5);
  const [boxImageSize, setBoxImageSize] = useState<number>(40);
  const [boxSize, seBoxSize] = useState<number>(100);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      setRowVerticalMargin(10);
      setBoxImageSize(60);
      seBoxSize(120);
    } else {
      setIconColCount(orientation == 'portrait' ? 3 : 5);
    }
  }, [orientation]);

  const showError = (message: string): void => {
    setInfoMessaeg(message);
    setFeatureNotAvailable(true);

    setTimeout(() => {
      setInfoMessaeg('');
      setFeatureNotAvailable(false);
    }, 3000);
  };

  function navigateTo(link: string, linkProps: Record<string, any> = {}): void {
    try {
      navigation.navigate('WebViewerHome', {
        link: link,
        newPage: true,
        ...linkProps,
      });
    } catch (e: any) {
      ToastAndroid.show(e.toString(), 5000);
    }
  }

  async function clearAppCache(): Promise<void> {
    await ClearCache.clearCacheDir().then(() => {
      showError('Cache cleared.');
    });
  }

  function showAnnouncementBanner(): void {
    setTimeout(() => {
      if (isFocused) {
        setAnnouncementVisible(true);
      }
    }, 2000);
  }

  let itemCtr = 0,
    rowCtr = 0,
    tmpCtr = 0;

  let tmpItems: any[] = [];

  const renderGridRow = (homeItems: any[], rowID: number) => {
    tmpItems = [];

    return (
      <View style={[styles.row, {marginVertical: rowVerticalMargin}]} key={rowID}>
        {homeItems.map((item: any) => {
          if (item.disabled == 1) {
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.box,
                  {
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: theme.homeIconDisabledColor,
                    borderWidth: 0,
                    opacity: 0.5,
                  },
                ]}
                onPress={() => showError('Feature not yet available.')}>
                <View style={styles.boxItems}>
                  <Image source={UIConfig.FAQIcon} style={[styles.boxImage, {width: boxImageSize, height: boxImageSize}]} />
                  <Text style={[styles.boxLabel, {color: '#7F8083'}]}>{item.title}</Text>
                </View>
              </Pressable>
            );
          } else if (item.placeHolder == 1) {
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.box,
                  {
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: theme.homeIconDisabledColor,
                    borderWidth: 0,
                    opacity: 0,
                  },
                ]}>
                <View style={styles.boxItems}></View>
              </Pressable>
            );
          } else {
            let localItem = item?.local != undefined ? true : false;
            const itemImage = getDashboardIcon(item.icon);

            if (itemImage == undefined) {
              localItem = true;
            }

            return (
              <View
                key={item.id}
                style={[
                  styles.box,
                  {
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: theme.homeIconClickedColor,
                    borderColor: theme.homeIconBorderColor,
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.boxItems,
                    {
                      backgroundColor: theme.homeIconBackgroundColor,
                    },
                  ]}
                  activeOpacity={0.5}
                  onPress={() => {
                    if (localItem == true) {
                      setHeaderTitle('');

                      let extraProps: any;

                      if (item?.screenName != 'Lifestyle') {
                        extraProps = {hideHeader: true};
                        setHeaderTitle(item.title);
                      }

                      navigation.navigate(item?.screenName, extraProps);
                    } else {
                      setHeaderTitle(propertyName ?? '');

                      const localScreen = NmGetLocalScreenName(item.code);

                      if (localScreen != undefined) {
                        navigation.navigate(localScreen);
                      } else {
                        //Link Navigation
                        switch (item.code) {
                          case 'SCMS_UTG':
                          case 'SCMS_URA':
                            navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU, {devMode: true});
                            break;

                          case 'SCMS_PDE':
                            navigateTo(
                              'https://scms.promptus8.com/SCMS_NLT/Menuitem?nsc=KyEPuIeG6c4sYdp7ZwcShqdipPUgSk8SwustQQZqiSPfXNXKDga/AwKMr6ai1xPv&nsu=uCCavAAGxAAGOgsKwpkJ3lnKRyHI6g/lduDk/N5MEn1DlBufh1OlZ4iNwPlNa1CRYCzzxp&plink=urBs3LxCWY6xcTgCHNiwdNS538VXDuA9PK3QcMPoKWDFbLDhy4wfmgkATCr7wOwwxuPTN0Up414Zq6ghsDoiusDMZ1fSaWpWhZHzEmPCsX7pFUF/eQpm/vVvW4HTN2IPqUrj20NL16BSMVxMSTusng==&nmid=00Z4xdc8cHEyIVrB8hwbGI/AAGxAAG8Dupm3m9G/E4JU9UCgk=&ntitle=GdDW38Nm45Pg0UMlwssULDYkw75YL6CAAGxAAGNAVFeD2Y7Lk=&nver=xM8T2ArrhzymxwOQ7KCscA==',
                              {menuCode: item.code},
                            );
                            break;

                          case 'HRTICKET_COMPANY':
                          case 'HRTICKET_PROJECT':
                            navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU, {menuCode: item.code});
                            break;

                          default:
                            if (item.code?.includes('SCMS_HRMI')) {
                              navigateTo(item.link, {menuCode: item.code});
                              break;
                            }

                            try {
                              if (v9Link == true) {
                                navigateTo(ConfigDetails().BaseLinkURL + item.link);
                              } else {
                                navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU);
                              }
                            } catch (e: any) {
                              navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU);
                            }

                            break;
                        }
                      }
                    }
                  }}>
                  {localItem && <MaterialCommunityIcons style={[styles.boxImage, {width: boxImageSize, height: boxImageSize}]} name={item?.icon} size={boxImageSize} color={'#466dc6'} />}

                  {!localItem && <Image source={getDashboardIcon(item.icon)} style={[styles.boxImage, {width: boxImageSize, height: boxImageSize, top: -5}]} />}

                  <Text style={[styles.boxLabel, {color: theme.homeIconTextColor, lineHeight: 12, position: 'absolute', top: boxSize * 0.67, textAlign: 'center'}]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
        })}
      </View>
    );
  };

  const renderListItem = (item: any) => {
    if (item.disabled != 1) {
      return (
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
          key={item.id}>
          <TouchableOpacity
            activeOpacity={0.5}
            key={item.id}
            onPress={() => {
              navigateTo(ConfigDetails().BaseLinkURL + item.link + APP_CONST.WEB_QS_NWTKU);
            }}
            style={[styles.listItem, {backgroundColor: theme.homeIconBackgroundColor}, clicked == item.id ? {backgroundColor: theme.homeIconClickedColor} : null]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={getDashboardIcon(item.icon)}
                style={[
                  styles.boxImage,
                  {
                    width: boxImageSize,
                    height: boxImageSize,
                    marginRight: 20,
                    marginLeft: 10,
                    marginTop: 5,
                  },
                ]}
              />
              <Text style={[styles.boxLabel, {color: theme.homeIconTextColor, fontSize: 18, marginTop: 1}]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            opacity: 0.5,
          }}
          key={item.id}>
          <Pressable key={item.id} onPress={() => showError('Feature not yet available.')} style={[{width: '100%', borderColor: theme.homeIconBorderColor}]}>
            <View
              style={[
                {
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 70,
                  borderRadius: 10,
                  backgroundColor: theme.homeIconDisabledColor,
                },
              ]}>
              <Image
                source={getDashboardIcon(item.icon)}
                style={[
                  styles.boxImage,
                  {
                    width: boxImageSize,
                    height: boxImageSize,
                    marginRight: 20,
                    marginLeft: 10,
                    marginTop: 5,
                  },
                ]}
              />
              <Text style={[styles.boxLabel, {color: '#7F8083', fontSize: 18, marginTop: 1}]}>{item.title}</Text>
            </View>
          </Pressable>
        </View>
      );
    }
  };

  const mBoardItems = [
    {
      id: 'MAIN',
      greeting: 'Hi, ',
      message: 'Welcome to your WeConnect Dashboard.',
    },
  ];

  let mIndex = 0;

  useEffect(() => {
    if (mBoardItems.length > 1) {
      const mBoardTimer = setInterval(() => {
        if (mIndex < Number(mBoardItems?.length) - 1) {
          mIndex += 1;
        } else {
          mIndex = 0;
        }

        carouselRef.current?.scrollToIndex({index: mIndex, animated: true});
      }, 5000);

      return () => clearInterval(mBoardTimer);
    }
  });

  const renderApproverItems = (item: any) => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
        key={item.TranType}>
        <TouchableOpacity
          activeOpacity={0.5}
          key={item.id}
          onPress={() => {
            if (item.hasOwnProperty('screenName')) {
              navigation.navigate(item.screenName);
            } else if (item.hasOwnProperty('link')) {
              navigation.navigate('WebViewerHome', {
                link: item.link,
                newPage: true,
              });
            }
          }}
          style={[styles.listItem, {backgroundColor: theme.homeIconBackgroundColor}]}>
          <View style={{justifyContent: 'center', marginLeft: 15}}>
            <Text style={[styles.approvalTitle]} numberOfLines={1}>
              {item.menuItem}
            </Text>
            <Text style={[styles.approvalDesc, {color: theme.welcomeGreetingsColor}]} numberOfLines={1}>
              {'You have '}
              <Text style={{fontFamily: 'Poppins-Bold'}}>{item.Count}</Text>
              {' transaction(s) for approval'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  return (
    <View style={{flex: 1}}>
      <NmModalBanner isVisible={announcementVisible} setIsVisible={setAnnouncementVisible} bannerData={announcementData} imgServer={serverImgUrl} />

      <View style={[styles.container, {backgroundColor: theme.homeBackgroundColor, paddingBottom: 0}]}>
        <View style={{marginTop: -5, backgroundColor: '#133561', height: 120, width: '100%', justifyContent: 'flex-end'}}></View>

        <View style={[styles.greetingsContainer]}>
          <TouchableWithoutFeedback delayLongPress={1000} onLongPress={clearAppCache}>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 22, color: '#FFF', opacity: ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL ? 1 : 0}} numberOfLines={1}>
              {propertyName}
            </Text>
          </TouchableWithoutFeedback>

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL && (
            <GestureDetector gesture={Gesture.Race(ToLeftGesture, ToRightGesture)}>
              <View style={[styles.textContainer, {backgroundColor: theme.homeIconBackgroundColor}]}>
                {greetingVisible && (
                  <Animated.View style={{backgroundColor: theme.homeIconBackgroundColor, flex: 1, justifyContent: 'center'}} entering={enterAnimation} exiting={exitAnimation}>
                    <Text style={[styles.greetings, {color: theme.welcomeGreetingsColor}]} numberOfLines={1}>
                      {boardGreeting} {recname}
                    </Text>

                    <Text style={styles.subGreetings}>{boardMessage}</Text>
                  </Animated.View>
                )}

                {!greetingVisible && bibleVerseLength && (
                  <Animated.View style={{backgroundColor: theme.homeIconBackgroundColor, flex: 1, justifyContent: 'center'}} entering={enterAnimation} exiting={exitAnimation}>
                    <Text style={[NmStyles.poppinsMedium, {fontSize: 12, fontStyle: 'italic', color: '#A4A8B0'}]}>{'Verse for the Day'}</Text>

                    <Text style={[NmStyles.poppinsMedium, {fontSize: 14, fontWeight: 600, color: theme.welcomeGreetingsColor, marginTop: 4}]}>{bibleVerse.versetitle}</Text>

                    <Text style={[NmStyles.poppinsRegular, {fontSize: 14, marginTop: -4, color: theme.welcomeGreetingsColor}]}>{bibleVerse.versebody}</Text>
                  </Animated.View>
                )}
              </View>
            </GestureDetector>
          )}

          {ConfigDetails().AppType == APP_CONST.APP_TYPE_APPROVER && (
            <View style={[styles.textContainer, {backgroundColor: theme.homeIconBackgroundColor}]}>
              <Text style={[styles.subGreetings, {marginBottom: 5}]}>{boardGreeting}</Text>

              <Text style={[styles.greetings, {color: theme.welcomeGreetingsColor}]} numberOfLines={1}>
                {recname}
              </Text>

              <Text style={styles.subGreetings}>{boardMessage}</Text>
            </View>
          )}
        </View>

        <ScrollView style={[{flexGrow: 1, marginTop: 80, width: '100%'}]} contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'space-between'}}>
          <View
            style={[
              styles.gridContainer,
              {
                backgroundColor: theme.homeBackgroundColor,
                flex: myItems.length > 0 ? 0 : 1,
                width: '100%',
              },
            ]}>
            {myItems.length > 0 ? (
              myItems.map((item: any) => {
                if (ConfigDetails().AppType == APP_CONST.APP_TYPE_PORTAL) {
                  if (dashboardView.toUpperCase() == 'GRID') {
                    item.id = tmpCtr;
                    tmpCtr += 1;

                    if (item.code == 'SCMS_NLT') {
                      item.link = 'https://scms.promptus8.com/SCMS_NLT/NOAHLearningTool';
                    }

                    tmpItems.push(item);
                    itemCtr += 1;

                    if (tmpCtr == myItems.length && itemCtr < iconColCount) {
                      tmpItems.push({
                        id: tmpCtr,
                        placeHolder: 1,
                        title: '',
                      });
                    }

                    if (itemCtr == iconColCount || tmpCtr == myItems.length) {
                      rowCtr += 1;
                      itemCtr = 0;
                      return renderGridRow(tmpItems, rowCtr);
                    }
                  }

                  if (dashboardView.toUpperCase() == 'LIST') {
                    item.id = tmpCtr;
                    tmpCtr += 1;
                    return renderListItem(item);
                  }
                } else {
                  return renderApproverItems(item);
                }

                return null;
              })
            ) : (
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontWeight: '900',
                    fontSize: 20,
                    opacity: 0.2,
                    color: theme.notifNoUnread,
                  }}>
                  {emptyDashboard}
                </Text>
              </View>
            )}
          </View>

          {Config.HOME_SHOW_NEWS && (
            <NmNewsBanner
              onLayout={handleLayout}
              hideDisclaimer={true}
              componentTitle={'News and Updates'}
              containerStyle={{
                alignSelf: 'center',
                marginBottom: 20,
                width: WINDOW_WIDTH * 0.9,
              }}
              parentWidth={containerWidth}
            />
          )}
        </ScrollView>

        {featureNotAvailable && <Text style={[styles.boxLabel, {marginVertical: 5, fontSize: 14}]}>{infoMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  gridContainer: {
    backgroundColor: '#F0F4F9',
    paddingHorizontal: 20,
  },
  welcomeImageContainer: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 40,
    width: '100%',
    height: 120,
    elevation: 10,
    borderColor: 'black',
    borderWidth: 0.3,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 10,
  },
  greetingsContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    justifyContent: 'center',
    height: 'auto',
    paddingHorizontal: 20,
  },
  textContainer: {
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 14,
    elevation: 3,
    paddingHorizontal: 15,
    overflow: 'hidden',
    paddingVertical: 12,
  },
  greetings: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
  subGreetings: {
    color: '#A4A8B0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  listItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    borderRadius: 10,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    alignItems: 'center',
    marginHorizontal: DeviceInfo.getDeviceType().toUpperCase() == 'TABLET' ? 20 : undefined,
  },
  boxItems: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  boxImageContainer: {
    borderRadius: 15,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxImage: {
    width: 36,
    height: 36,
    marginBottom: 5,
  },
  boxDetails: {
    marginLeft: 10,
    padding: 10,
  },
  boxCount: {
    fontSize: 35,
    color: 'white',
    fontWeight: '600',
  },
  boxLabel: {
    color: '#36559B',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: DeviceInfo.getDeviceType().toUpperCase() == 'TABLET' ? 'center' : 'space-between',
    height: DeviceInfo.getDeviceType().toUpperCase() == 'TABLET' ? 140 : 118,
    marginVertical: 5,
  },
  approvalTitle: {
    color: '#466dc6',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
  },
  approvalDesc: {
    color: '#444',
    fontSize: 15,
    fontFamily: 'Poppins-Light',
  },
});

export default HomepageScreen;

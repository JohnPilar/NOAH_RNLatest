import {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text} from 'react-native';

import Animated, {useSharedValue, useDerivedValue, useAnimatedStyle, withTiming, runOnJS, Easing, ReduceMotion} from 'react-native-reanimated';
import {GestureDetector, Gesture, Directions, GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import NmStyles, {WINDOW_WIDTH} from '../constants/NmStyles';
import {NmSaveSetting} from '../functions/NmFunctions';
import {APP_KEYS} from '../constants';
import {AppConfigContext} from '../functions/Contexts';
import {NmLabel} from './NmComponents';
var XDate = require('xdate');
import {useNavigation} from '@react-navigation/native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.9;
const FULL_ITEM_WIDTH = MODAL_WIDTH;

interface BannerItemData {
  ID?: string | number;
  ContentImage: string;
  ContentLink: string;
  Title: string;
  Summary: string;
}

interface InfiniteBannerCarouselProps {
  data: BannerItemData[];
  imgServer: string;
  setIsVisible: (isVisible: boolean) => void;
}

const InfiniteBannerCarousel = (props: InfiniteBannerCarouselProps): React.JSX.Element => {
  const {data, imgServer, setIsVisible} = props;

  const infiniteData: BannerItemData[] = [...data, ...data, ...data];
  const navigation = useNavigation();

  const translateX = useSharedValue(0);

  const contentWidth = infiniteData.length * (WINDOW_WIDTH * 0.9);
  const initialOffset = data.length * (WINDOW_WIDTH * 0.9);

  const activeIndex = useDerivedValue(() => {
    return Math.round(-translateX.value / FULL_ITEM_WIDTH) % data.length;
  });

  useEffect(() => {
    translateX.value = -initialOffset;
  }, []);

  const handleLooping = (): void => {
    const numItems = data.length;
    const currentOffset = translateX.value;

    if (currentOffset <= -(numItems * 2 * FULL_ITEM_WIDTH)) {
      const offsetIntoThirdSet = Math.abs(currentOffset) - numItems * FULL_ITEM_WIDTH * 2;
      const targetX = -(numItems * FULL_ITEM_WIDTH) - offsetIntoThirdSet;
      translateX.value = withTiming(targetX, {duration: 0});
    } else if (currentOffset >= -((numItems - 1) * FULL_ITEM_WIDTH)) {
      const targetX = -((numItems * 2 - 1) * FULL_ITEM_WIDTH);
      translateX.value = withTiming(targetX, {duration: 0});
    }
  };

  const FlingToLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentOffset = translateX.value - FULL_ITEM_WIDTH;
      const nearestItemIndex = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 240,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(handleLooping)();
        },
      );
    });

  const FlingToRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      const currentOffset = translateX.value + FULL_ITEM_WIDTH;
      const nearestItemIndex = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 240,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(handleLooping)();
        },
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const animatedDotStyle = (index: number) =>
    useAnimatedStyle(() => {
      const isActive = activeIndex.value === index;
      return {
        opacity: withTiming(isActive ? 1 : 0.5),
        backgroundColor: withTiming(isActive ? '#FFF' : '#CCC'),
      };
    });

  return (
    <>
      <GestureDetector gesture={Gesture.Simultaneous(FlingToLeft, FlingToRight)}>
        <Animated.View style={[styles.bannerContainer, animatedStyle, {width: contentWidth, backgroundColor: '#DDD'}]}>
          {infiniteData.map((item: BannerItemData, index: number) => {
            return (
              <BannerItem
                key={`banner-${item.ID || index}`} // Avoid new Date() here!
                item={item}
                imgServer={imgServer}
                navigation={navigation}
                setIsVisible={setIsVisible}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>

      <View style={styles.pageDotsContainer}>
        {data.map((item: BannerItemData, index: number) => {
          return <Animated.View key={index} style={[styles.pageDot, animatedDotStyle(index)]}></Animated.View>;
        })}
      </View>
    </>
  );
};

interface BannerItemProps {
  item: BannerItemData;
  imgServer: string;
  navigation: any;
  setIsVisible: (isVisible: boolean) => void;
}

const BannerItem = (props: BannerItemProps): React.JSX.Element => {
  const {item, imgServer, navigation, setIsVisible} = props;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imageLink = item.ContentImage;
  const imgUrl = imgServer + imageLink;
  //const imgUrl = 'https://static.vecteezy.com/system/resources/thumbnails/008/957/166/small/red-ribbon-banner-design-set-free-vector.jpg';

  return (
    <TouchableOpacity
      activeOpacity={0.99}
      style={[styles.bannerItem, {overflow: 'hidden', backgroundColor: '#FFF'}]}
      onPress={() => {
        try {
          setIsVisible(false);
          navigation.navigate('UpdatesWebview', {link: item.ContentLink});
        } catch (e) {
          console.log(e);
        }
      }}>
      <ImageBackground source={{uri: imgUrl}} style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}} imageStyle={{resizeMode: 'cover'}} onLoadEnd={() => setIsLoaded(true)}>
        {!isLoaded && (
          <View style={{flex: 1, width: '100%', padding: 12, justifyContent: 'center'}}>
            <NmLabel style={{color: '#99999996', marginBottom: 10, textAlign: 'center'}}>{'Image Loading...'}</NmLabel>
            <NmLabel style={{color: '#999', fontWeight: 900}}>{item.Title}</NmLabel>
            <NmLabel style={{color: '#999', fontSize: 12}}>{item.Summary}</NmLabel>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};
interface NmModalBannerProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  bannerData: BannerItemData[];
  imgServer: string;
}

const NmModalBanner = (props: NmModalBannerProps): React.JSX.Element => {
  const {isVisible, setIsVisible, bannerData, imgServer} = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {setHideAnnouncement} = useContext(AppConfigContext);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      style={{alignItems: 'center', margin: 0}}
      backdropTransitionOutTiming={0}>
      <GestureHandlerRootView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.bannerWrapper}>
            <InfiniteBannerCarousel data={bannerData} imgServer={imgServer} setIsVisible={setIsVisible} />
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setIsVisible(false);
            }}>
            <View style={styles.closeButtonContainer}>
              <Icon name="close" size={24} color={'#ffffffe5'} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.hideTodayContainer}
            onPress={() => {
              (async () => {
                const hideDate = new XDate().setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
                setHideAnnouncement(hideDate);
                await NmSaveSetting(APP_KEYS.SETT_HIDE_ANNOUNCEMENT, hideDate);
                setIsVisible(false);
              })();
            }}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 13, color: '#FFF', textDecorationLine: 'underline'}]}>{"Don't show again today"}</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: WINDOW_WIDTH * 0.9,
    height: '70%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFFFFF44',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    alignSelf: 'flex-end',
    right: 2,
    padding: 6,
  },
  closeButtonContainer: {
    padding: 2,
    backgroundColor: '#AAAAAA30',
    borderRadius: 12,
  },
  hideTodayContainer: {
    position: 'absolute',
    bottom: -24,
    alignSelf: 'center',
  },
  pageDotsContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pageDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 100,
    marginHorizontal: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
  },
  bannerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    // This is the key to preventing the overflow
  },
  bannerContainer: {
    flexDirection: 'row',
    height: '100%', // Fixed height for the banner
    alignItems: 'center',
  },
  bannerItem: {
    width: WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NmModalBanner;

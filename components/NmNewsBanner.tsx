import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, ImageBackground, Text} from 'react-native';

import {NmGetMobileUpdates} from '../functions/NmNetwork';
import NmStyles from '../constants/NmStyles';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing, ReduceMotion} from 'react-native-reanimated';
import {GestureDetector, Gesture, Directions} from 'react-native-gesture-handler';
import {AccountDetailsContext} from '../functions/Contexts';
import {APP_CONST} from '../constants';
import {NmLabel} from './NmComponents';
import {useNavigation} from '@react-navigation/native';
import {ThemesContext} from '../functions/ThemeContext';
import {StackNavigationProp} from '../navigation/NavigationTypes';

interface NmNewsBannerProps {
  hideDisclaimer?: boolean;
  hideTitle?: boolean;
  disclaimerMsg?: string;
  componentTitle?: string;
  onLayout?: (event: any) => void;
  parentWidth?: number;
  containerStyle?: any;
  headerFontStyle?: any;
}

interface NewsItem {
  [key: string]: any;
}

interface LoopScrollProps {
  data: NewsItem[];
  parentWidth: number;
  noahStandard: string;
  serverImgUrl: string;
}

export default function NmNewsBanner(props: NmNewsBannerProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {recuser, loginToken, companyCode, noahStandard} = useContext(AccountDetailsContext);
  const {hideDisclaimer, hideTitle, componentTitle, onLayout, parentWidth} = props;
  const [emptyMesasge, setEmptyMessage] = useState<string>('Loading news...');
  const [latestNews, setLatestNews] = useState<NewsItem[] | undefined>();
  const [serverImgUrl, setServerImgUrl] = useState<string>('');

  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect((): void => {
    NmGetMobileUpdates({user: recuser, token: loginToken, compcode: companyCode, datatype: APP_CONST.MUC_NEWS}).then((response: any) => {
      if (response.status == '200') {
        if (response.data.Updates.length > 0) {
          const aData: NewsItem[] = response.data.Updates;
          const sLink: string = response.data.ImgLink;

          // Code: "000000000005"
          // ContentImage: "&per=%2ByXJYW3gCAlJOuv6YMkbCR8C98fYo3dcRZdtSidKu%2FUjYJpK9ML2%2FYqHuvCemMo2RhStidCMtQfWQxEJuuRQKRYlRs0t0490qqDV3iRbNd7Bj1ZdpfbtW8033UOC%2FZfa&scky=VBWCCUGCVXAL1SXG5C9LOH20NS7CQ9&ftype=.png"
          // ContentLink: "[http://localhost:51123/NOAHMobCMS?nwc=C65FFq1Cx183CC8Cqx1q516x115C5q1x1C6x1qFF1a1FFC6F&isv9=1](http://localhost:51123/NOAHMobCMS?nwc=C65FFq1Cx183CC8Cqx1q516x115C5q1x1C6x1qFF1a1FFC6F\&isv9=1)"
          // Summary: "Menu item sp modified to get latest data for refresh function"
          // Title: "Announce this"

          setLatestNews(aData);
          setServerImgUrl(sLink);
        } else {
          setLatestNews(undefined);
          setEmptyMessage('No news available');
        }
      } else {
        setLatestNews(undefined);
        setEmptyMessage('No news available');
      }
    });
  }, []);

  return (
    <View style={[styles.container, props?.containerStyle]} onLayout={onLayout}>
      {!hideTitle && (
        <Text style={[{fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0, color: '#133561', textAlign: 'left', width: '100%'}, props.headerFontStyle]}>
          {componentTitle == undefined ? 'News' : componentTitle}
        </Text>
      )}
      {!hideDisclaimer && (
        <Text style={[{fontFamily: 'Poppins-Regular', fontSize: 13, marginleft: 0, color: '#777', textAlign: 'left', width: '100%', marginBottom: 5}, props.headerFontStyle]}>
          {'Disclaimer: The news below comes from a News API provider'}
        </Text>
      )}
      {latestNews != undefined ? (
        <View style={{width: '100%', overflow: 'hidden', alignSelf: 'center', borderRadius: 12}}>
          <LoopScroll data={latestNews} parentWidth={parentWidth ?? 0} noahStandard={noahStandard} serverImgUrl={serverImgUrl} />
        </View>
      ) : (
        <View style={{width: parentWidth, height: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.emptyNewsBackground, borderRadius: 12}}>
          <Text style={[NmStyles.poppinsBold, {fontSize: 18, color: theme.emptyNewsText}]}>{emptyMesasge}</Text>
        </View>
      )}
    </View>
  );
}

const LoopScroll = ({data, parentWidth, noahStandard, serverImgUrl}: LoopScrollProps): React.JSX.Element => {
  const newData: NewsItem[] = data;
  const infiniteData: NewsItem[] = [...newData, ...newData, ...newData];

  const translateX = useSharedValue<number>(0);
  const FULL_ITEM_WIDTH: number = parentWidth;
  const initialOffset: number = newData.length * FULL_ITEM_WIDTH;
  const contentWidth: number = infiniteData.length * FULL_ITEM_WIDTH;

  let BannerTimer: ReturnType<typeof setInterval>;

  useEffect((): (() => void) | undefined => {
    if (newData?.length > 1 && noahStandard == 'NOAH') {
      BannerTimer = setInterval(() => {
        const targetX: number = translateX.value + -FULL_ITEM_WIDTH;
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
      }, 10000);
      return () => clearInterval(BannerTimer);
    }

    return undefined;
  });

  useEffect((): void => {
    translateX.value = -initialOffset;
  }, []);

  const handleLooping = (): void => {
    const numItems: number = newData.length;
    const currentOffset: number = translateX.value;

    //For 2 or more banner data
    if (currentOffset <= -(numItems * 2 * FULL_ITEM_WIDTH)) {
      const targetX: number = -initialOffset; // Return to initial offset to mimic looping
      translateX.value = withTiming(targetX, {duration: 0});
    } else if (currentOffset >= -((numItems - 1) * FULL_ITEM_WIDTH)) {
      const targetX: number = -((numItems * 2 - 1) * FULL_ITEM_WIDTH);
      translateX.value = withTiming(targetX, {duration: 0});
    }
  };

  function resetTimer(): void {
    clearInterval(BannerTimer);
  }

  const FlingToLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentOffset: number = translateX.value - FULL_ITEM_WIDTH;
      const nearestItemIndex: number = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX: number = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 240,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(resetTimer)();
          runOnJS(handleLooping)();
        },
      );
    });

  const FlingToRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      const currentOffset: number = translateX.value + FULL_ITEM_WIDTH;
      const nearestItemIndex: number = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX: number = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 240,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(resetTimer)();
          runOnJS(handleLooping)();
        },
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <GestureDetector gesture={Gesture.Simultaneous(FlingToLeft, FlingToRight)}>
      <Animated.View style={[{flexDirection: 'row'}, animatedStyle, {width: contentWidth}]}>
        {infiniteData.map((item: NewsItem, index: number) => {
          return (
            <NewsBannerItem
              key={`news-${item.ID || index}`} // Avoid new Date() to prevent flickering
              item={item}
              imgServer={serverImgUrl}
              parentWidth={parentWidth}
            />
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

interface NewsBannerItemProps {
  item: NewsItem;
  imgServer: string;
  parentWidth: number;
}

const NewsBannerItem = ({item, imgServer, parentWidth}: NewsBannerItemProps): React.JSX.Element => {
  const navigation = useNavigation<StackNavigationProp>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [numLinesExceed, setNumLinesExceed] = useState<boolean>(false);
  const [header, setHeader] = useState<string>(item.Summary);

  const image = !item.ContentImage ? require('../assets/Images/nullnews.jpg') : imgServer + item.ContentImage;
  //const image = '[https://static.vecteezy.com/system/resources/thumbnails/008/957/166/small/red-ribbon-banner-design-set-free-vector.jpg](https://static.vecteezy.com/system/resources/thumbnails/008/957/166/small/red-ribbon-banner-design-set-free-vector.jpg)';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.bannerItem, {overflow: 'hidden', backgroundColor: '#000', width: parentWidth}]}
      onPress={() => {
        try {
          navigation.navigate('UpdatesWebview', {link: item.ContentLink});
        } catch (e) {
          console.warn('Link Error', e);
        }
      }}>
      <ImageBackground
        source={{uri: image}}
        style={{height: 180, width: parentWidth, justifyContent: 'flex-end'}}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}>
        {/* Loading Overlay */}
        {isLoading && (
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#AAA'}}>
            <NmLabel style={{color: '#777', textAlign: 'center'}}>{'Image Loading...'}</NmLabel>
          </View>
        )}

        {/* Text Content Overlay */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.Title}
          </Text>
          <View>
            <Text
              style={styles.summary}
              numberOfLines={2}
              onTextLayout={({nativeEvent: {lines}}: any): void => {
                if (lines?.length > 2) {
                  if (lines[1].width > (parentWidth / 3) * 2) {
                    const halfTextLength: number = (lines[1].text.length / 3) * 2;
                    const newSecLineText: string = lines[1].text.substring(0, halfTextLength).trim() + '...';
                    setHeader(lines[0].text + newSecLineText);
                    setNumLinesExceed(true);
                  }
                }
              }}>
              {header}
              {numLinesExceed && <Text style={styles.readMore}>{' Read More'}</Text>}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
  },
  bannerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222', // Subtle background while loading
  },
  loadingText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  textContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
  },
  title: {color: '#000', fontFamily: 'Poppins-Bold'},
  summary: {color: '#000', fontFamily: 'Poppins-Regular'},
  readMore: {color: '#000', fontFamily: 'Poppins-Bold', fontSize: 13},
});

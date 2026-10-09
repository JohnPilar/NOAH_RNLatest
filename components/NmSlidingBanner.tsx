import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View, Text, TouchableOpacity, Image, FlatList, StyleProp, ViewStyle, ImageStyle} from 'react-native';
import type {FlatListProps} from 'react-native';

interface NmSlidingBannerItem {
  backgroundImage?: any;
  [key: string]: any;
}

interface NmSlidingBannerProps {
  data: NmSlidingBannerItem[];
  showPageIndicator?: boolean;
  slideInterval?: number;
  onPress?: (item: NmSlidingBannerItem) => void;
  containerStyle?: StyleProp<ViewStyle>;
  bannerContainerStyle?: StyleProp<ViewStyle>;
  bannerStyle?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  pageIndicatorStyle?: StyleProp<ViewStyle>;
}

type ViewToken<ItemT = any> = Parameters<NonNullable<FlatListProps<ItemT>['onViewableItemsChanged']>>[0]['changed'][number];

export default function NmSlidingBanner(props: NmSlidingBannerProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const slidingBannerRef = useRef<FlatList<NmSlidingBannerItem> | null>(null);
  const [adIndex, setAdIndex] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);

  const showPageIndicator = props?.showPageIndicator == undefined ? true : props.showPageIndicator;
  const bannerItems = props.data;
  const slideInterval = props?.slideInterval == undefined ? 5000 : props.slideInterval;

  const undefinedAction = (): void => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  useEffect(() => {
    if (bannerItems.length > 1) {
      const mBoardTimer = setInterval(() => {
        let tmpIndex = adIndex;
        if (tmpIndex < Number(bannerItems?.length) - 1) {
          tmpIndex += 1;
        } else {
          tmpIndex = 0;
        }
        slidingBannerRef.current?.scrollToIndex({index: tmpIndex, animated: true});
      }, slideInterval);
      return () => clearInterval(mBoardTimer);
    }
  });

  const onViewRef = useRef(({changed}: {changed: ViewToken[]}): void => {
    if (changed[0]?.index != null) {
      setAdIndex(changed[0].index);
    }
  });

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50, minimumViewTime: 150});

  const renderBannerItem = ({item, index}: {item: NmSlidingBannerItem; index: number}): React.JSX.Element => {
    const image = item.backgroundImage == '' ? require('../assets/Images/NoImage.jpg') : item.backgroundImage;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          if (props?.onPress == undefined) {
            undefinedAction();
          } else {
            props.onPress(item);
          }
        }}
        style={[{width: width - 32, height: 120, justifyContent: 'center'}, props.bannerContainerStyle]}>
        <Image
          style={[
            {
              flex: 1,
              backgroundColor: '#FFF',
              width: undefined,
              height: undefined,
              justifyContent: 'center',
              borderRadius: 12,
              overflow: 'hidden',
              resizeMode: 'cover',
            },
            props.bannerStyle,
            props.imageStyle,
          ]}
          source={image}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{width: '100%', justifyContent: 'center', alignItems: 'center'}, props.containerStyle]}>
      <FlatList
        ref={slidingBannerRef}
        horizontal={true}
        data={bannerItems}
        renderItem={renderBannerItem}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{justifyContent: 'center'}}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {showError && (
        <View style={{flexDirection: 'row', height: 24, width: '100%', justifyContent: 'center', position: 'absolute', bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 16}}>{'Feature is disabled'}</Text>
        </View>
      )}

      {showPageIndicator && (
        <View style={[{flexDirection: 'row', height: 12, width: '100%', justifyContent: 'center', position: 'absolute', bottom: 4, zIndex: 0}]}>
          {bannerItems.length > 0 &&
            bannerItems.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[
                    {
                      width: 8,
                      height: 8,
                      backgroundColor: index == adIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(128, 128, 128, 0.5)',
                      borderRadius: 8,
                      marginHorizontal: 2,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    props.pageIndicatorStyle,
                  ]}></View>
              );
            })}
        </View>
      )}
    </View>
  );
}

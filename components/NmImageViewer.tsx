import {useEffect, useRef, useState} from 'react';
import {View, FlatList, Image, TouchableNativeFeedback, Dimensions, StyleSheet} from 'react-native';
import type {FlatListProps} from 'react-native';
import {GestureDetector, Gesture, FlatList as FlatListGesture} from 'react-native-gesture-handler';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {StackScreenProps} from '../navigation/NavigationTypes';

type Props = StackScreenProps<'NmImageViewer'>;
type ViewableItemsChangedInfo<ItemT = any> = Parameters<NonNullable<FlatListProps<ItemT>['onViewableItemsChanged']>>[0];

export default function NmImageViewer({route}: Props): React.JSX.Element {
  const {imgItems, imgIndex} = route.params || {};
  const imgRef = useRef<any>(null);
  const galleryRef = useRef<any>(null);

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const [imageIndex, setImageIndex] = useState<number>(imgIndex ?? 0);

  const offset = useSharedValue({x: 0, y: 0});
  const start = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value.x}, {translateY: offset.value.y}, {scale: scale.value}, {rotateZ: `${rotation.value}rad`}],
    };
  });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      if (scale.value == 1) {
        offset.value = {
          x: 0,
          y: 0,
        };
      }

      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = 1;
      }

      savedScale.value = scale.value;
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      if (savedScale.value == 1) {
        scale.value = withTiming(2, {duration: 450});
        savedScale.value = scale.value;
      }

      if (savedScale.value > 1) {
        scale.value = withTiming(1, {duration: 450});

        offset.value = withTiming(
          {
            x: 0,
            y: 0,
          },
          {duration: 450},
        );

        savedScale.value = scale.value;
      }
    });

  // const rotateGesture = Gesture.Rotation()
  //   .onUpdate((event) => {
  //     rotation.value = savedRotation.value + event.rotation;
  //   })
  //   .onEnd(() => {
  //     savedRotation.value = rotation.value;
  //   });

  //Gesture.Simultaneous(zoomGesture, rotateGesture));

  const renderImage = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    return (
      <GestureDetector
        gesture={Gesture.Simultaneous(
          Gesture.Pinch()
            .onUpdate(event => {
              scale.value = savedScale.value * event.scale;
            })
            .onEnd(() => {
              if (scale.value < 1) {
                scale.value = 1;
              }

              savedScale.value = scale.value;
            }),
          Gesture.Tap()
            .maxDuration(250)
            .numberOfTaps(2)
            .onStart(() => {
              if (savedScale.value == 1) {
                scale.value = withTiming(2, {duration: 250});
                savedScale.value = scale.value;
              }

              if (savedScale.value > 1) {
                scale.value = withTiming(1, {duration: 250});

                offset.value = withTiming(
                  {
                    x: 0,
                    y: 0,
                  },
                  {duration: 250},
                );

                savedScale.value = scale.value;
              }
            }),
          Gesture.Pan()
            .averageTouches(true)
            .onUpdate(e => {
              if (scale.value > 1) {
                offset.value = {
                  x: e.translationX + start.value.x,
                  y: e.translationY + start.value.y,
                };
              }
            })
            .onEnd(() => {
              if (scale.value == 1) {
                offset.value = {
                  x: 0,
                  y: 0,
                };
              }

              start.value = {
                x: offset.value.x,
                y: offset.value.y,
              };
            }),
        )}>
        <Animated.Image key={index} style={[{width: SCREEN_WIDTH, height: '100%', resizeMode: 'contain'}, animatedStyles]} source={item.backgroundImage} />
      </GestureDetector>
    );
  };

  const renderGalleryItems = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    const image = item.backgroundImage == '' ? require('../assets/Images/NoImage.jpg') : item.backgroundImage;
    const boxLength = SCREEN_WIDTH * 0.13;

    return (
      <TouchableNativeFeedback
        onPress={() => {
          imgRef.current.scrollToIndex({index: index, animated: true});
        }}>
        <View
          style={{
            padding: 4,
            flex: 1,
            width: boxLength,
            height: boxLength,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: index == imageIndex ? '#FFF' : undefined,
            borderRadius: 6,
            marginHorizontal: 4,
          }}>
          <Image
            style={[
              {
                flex: 1,
                width: undefined,
                height: undefined,
                borderRadius: 6,
                borderColor: '#28396F',
                justifyContent: 'center',
                overflow: 'hidden',
                resizeMode: 'cover',
              },
            ]}
            source={image}
          />
        </View>
      </TouchableNativeFeedback>
    );
  };

  const onViewImageRef = useRef((info: ViewableItemsChangedInfo) => {
    const newIndex = info.changed[0]?.index;

    if (newIndex == null) {
      return;
    }

    scale.value = 1;
    offset.value = {
      x: 0,
      y: 0,
    };
    setImageIndex(newIndex);
  });

  useEffect(() => {
    galleryRef.current.scrollToIndex({index: imageIndex});
  }, [imageIndex]);

  return (
    <Animated.View style={{flex: 1, backgroundColor: '#000'}}>
      <FlatListGesture
        ref={imgRef}
        horizontal={true}
        data={imgItems}
        renderItem={renderImage}
        initialScrollIndex={imgIndex}
        onScrollToIndexFailed={info => {
          const wait = new Promise<void>(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            imgRef.current?.scrollToIndex({index: info.index, animated: true});
          });
        }}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewImageRef.current}
        viewabilityConfig={{itemVisiblePercentThreshold: 100, minimumViewTime: 150}}
      />

      <View style={{width: '100%', marginBottom: 20}}>
        <FlatList
          ref={galleryRef}
          horizontal={true}
          data={imgItems}
          onScrollToIndexFailed={info => {
            const wait = new Promise<void>(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              galleryRef.current?.scrollToIndex({index: info.index, animated: true});
            });
          }}
          renderItem={renderGalleryItems}
          keyExtractor={(item, index) => index.toString()}
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: 10}}
        />
      </View>
    </Animated.View>
  );
}

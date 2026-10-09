import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing, ReduceMotion} from 'react-native-reanimated';
import {GestureDetector, Gesture, Directions} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.8; // Each banner item takes 80% of screen width
const SPACING = 10;
const FULL_ITEM_WIDTH = ITEM_WIDTH + SPACING;

interface BannerItem {
  id: string;
  text: string;
  color: string;
}

const data: BannerItem[] = [
  {id: '1', text: 'Banner Item 1', color: '#FFDDC1'},
  {id: '2', text: 'Banner Item 2', color: '#DCF8C6'},
  {id: '3', text: 'Banner Item 3', color: '#B2EBF2'},
  {id: '4', text: 'Banner Item 4', color: '#FFF9C4'},
  {id: '5', text: 'Banner Item 5', color: '#F8BBD0'},
];

// Duplicate data to create the illusion of infinite scroll
const infiniteData: BannerItem[] = [...data, ...data, ...data];

export default function App(): React.JSX.Element {
  const translateX = useSharedValue<number>(0);
  const startX = useSharedValue<number>(0);

  const contentWidth = infiniteData.length * FULL_ITEM_WIDTH;
  const initialOffset = data.length * FULL_ITEM_WIDTH;

  useEffect((): void => {
    translateX.value = -initialOffset;
  }, []);

  const handleLooping = (): void => {
    const numItems = data.length;
    const currentOffset = translateX.value;

    if (currentOffset <= -((numItems - 2) * FULL_ITEM_WIDTH * 2)) {
      // Calculate how far into the "third" set we are, then apply that offset to the "second" set
      const offsetIntoThirdSet = Math.abs(currentOffset) - numItems * FULL_ITEM_WIDTH * 2;
      const targetX = -(numItems * FULL_ITEM_WIDTH) - offsetIntoThirdSet; // Jump to corresponding position in middle set
      translateX.value = withTiming(targetX, {duration: 0});
    } else if (currentOffset >= 0) {
      // Calculate how far into the "first" set we are (positive offset from 0)
      const offsetIntoFirstSet = currentOffset;
      const targetX = -(numItems * FULL_ITEM_WIDTH) + offsetIntoFirstSet; // Jump to corresponding position in middle set
      translateX.value = withTiming(targetX, {duration: 0});
    }
  };

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate(event => {
      translateX.value = startX.value + event.translationX;
    })
    .onEnd(event => {
      const currentOffset = translateX.value;
      const nearestItemIndex = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX = nearestItemIndex * FULL_ITEM_WIDTH;
      translateX.value = withTiming(
        targetX,
        {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(handleLooping)();
        },
      );
    });

  const FlingToLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(event => {
      const currentOffset = translateX.value - FULL_ITEM_WIDTH;
      const nearestItemIndex = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 360,
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
    .onEnd(event => {
      const currentOffset = translateX.value + FULL_ITEM_WIDTH;
      const nearestItemIndex = Math.round(currentOffset / FULL_ITEM_WIDTH);
      const targetX = nearestItemIndex * FULL_ITEM_WIDTH;

      translateX.value = withTiming(
        targetX,
        {
          duration: 360,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(handleLooping)();
        },
      );
    });

  // Animated style for the banner container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={Gesture.Race(FlingToLeft, FlingToRight)}>
        <Animated.View style={[styles.bannerContainer, animatedStyle, {width: contentWidth}]}>
          {infiniteData.map((item: BannerItem, index: number) => (
            <View key={`${item.id}-${index}`} style={[styles.bannerItem, {backgroundColor: item.color}]}>
              <Text style={styles.itemText}>
                {item.text} (Index: {index})
              </Text>
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden', // Hide content outside the container
  },
  bannerContainer: {
    flexDirection: 'row',
    height: 200, // Fixed height for the banner
    alignItems: 'center',
  },
  bannerItem: {
    width: ITEM_WIDTH,
    height: 180,
    marginHorizontal: SPACING / 2, // Half spacing on each side to make total spacing
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  itemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 100;
const THUMB_RADIUS = 15;

const Slider = () => {
  const translateX = useSharedValue(0);
  const [value, setValue] = useState(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx: any) => {
      let newX = ctx.startX + event.translationX;
      newX = Math.max(0, Math.min(newX, SLIDER_WIDTH));
      translateX.value = newX;
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Met à jour le state React à chaque changement de translateX.value
  useAnimatedReaction(
    () => translateX.value,
    (current) => {
      const percent = Math.round((current / SLIDER_WIDTH) * 100);
      runOnJS(setValue)(percent);
    }
  );

  return (
    <View style={styles.container}>
      <View style={styles.slider}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </PanGestureHandler>
      </View>
      <Text style={styles.valueText}>
        {value * 5} calories
      </Text>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  slider: {
    width: SLIDER_WIDTH,
    height: 10,
    backgroundColor: 'black',
    borderRadius: 2,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    backgroundColor: '#007AFF',
    top: -THUMB_RADIUS + 2,
    left: -12
  },
  valueText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

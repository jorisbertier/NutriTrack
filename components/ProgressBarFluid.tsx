import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  value: number; // current value
  maxValue: number; // maximum value
  nutri?: string; // label to display (e.g. "Kcal", "Fat")
  colorBarProgresse?: string; // progress color
  backgroundBarprogress?: string; // background track color
  style?: ViewStyle; // optional wrapper style
  height?: number; // height of the bar
};

/**
 * Fluid progress bar: animates width when `value` changes and shows a subtle moving "liquid" shimmer.
 * Comments are in English, per user's preference.
 */
export default function ProgressBarFluid({
  value,
  maxValue,
  nutri = '',
  colorBarProgresse = '#4CAF50',
  backgroundBarprogress = '#E6E6E6',
  style,
  height = 16,
}: Props) {
  // Animated value for the progress width (0..1)
  const progressAnim = useRef(new Animated.Value(0)).current;
  // Animated value for the shimmer translation (loops)
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // clamp and compute ratio
  const ratio = Math.max(0, Math.min(1, maxValue === 0 ? 0 : value / maxValue));

  useEffect(() => {
    // animate the progress bar width smoothly when `value` (hence `ratio`) changes
    Animated.timing(progressAnim, {
      toValue: ratio,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width layout animation can't use native driver
    }).start();
  }, [ratio, progressAnim]);

  useEffect(() => {
    // looping shimmer to create a fluid effect inside the filled area
    shimmerAnim.setValue(0);
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  // interpolated width style (percentage)
  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // shimmer translateX interpolation (moves left -> right)
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-40%', '40%'],
  });

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: backgroundBarprogress,
            height,
            borderRadius: height / 2,
          },
        ]}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: maxValue, now: value }}
      >
        {/* Animated filled bar */}
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: colorBarProgresse,
              height,
              borderRadius: height / 2,
              width: widthInterpolated,
              overflow: 'hidden',
            },
          ]}
        >
          {/* Shimmer overlay to give a fluid/moving feel */}
          <Animated.View
            style={[
              styles.shimmer,
              {
                // move horizontally inside the filled area
                transform: [{ translateX: shimmerTranslate }],
                // height is slightly larger to create a diagonal shimmer
                height: height * 1.4,
                top: -(height * 0.2),
                opacity: 0.18,
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* Label on the right: value / max + nutri */}
      <View style={styles.labelWrapper}>
        <Text style={styles.labelText} numberOfLines={1}>
          {Math.round(value)} / {Math.round(maxValue)} {nutri}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: 10,
  },
  fill: {
    justifyContent: 'center',
  },
  shimmer: {
    position: 'absolute',
    left: 0,
    right: 0,
    // create a diagonal white-ish stripe using rotation
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
    transform: [{ rotate: '25deg' }],
  },
  labelWrapper: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

/*
Usage example (simple):

<ProgressBarFluid
  value={45}
  maxValue={100}
  nutri="kcal"
  colorBarProgresse="#FF7043"
  backgroundBarprogress="#F2F2F2"
  height={18}
/>

Drop this file in your components folder and import it where needed.
*/
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ProgressBarStep = ({ steps, currentStep, colors }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentStep + 1) / steps.length,
      duration: 300, // Durée de l’animation
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  const containerWidth = 100; // largeur en %

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: '#ccc' }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: colors.black,
              width: widthInterpolate,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        width: '100%',
    },
    track: {
        height: 6,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progress: {
        height: 6,
        borderRadius: 4,
    },
});

export default ProgressBarStep;
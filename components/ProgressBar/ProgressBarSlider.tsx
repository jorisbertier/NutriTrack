import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.8;
const CURSOR_SIZE = 40;

const ProgressBarSlider = () => {
  const pan = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const panValue = useRef(0);
  const trackRef = useRef(null);
  const [trackLeft, setTrackLeft] = useState(0);

  useEffect(() => {
    const listenerId = pan.addListener(({ value }) => {
      panValue.current = value;
    });
    return () => pan.removeListener(listenerId);
  }, [pan]);

  // Mesure la position du track une fois monté
  useEffect(() => {
    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.measure((fx, fy, width, height, px) => {
          setTrackLeft(px);
        });
      }
    }, 100); // petit délai pour que le layout soit prêt
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        // Rien de spécial à faire ici désormais
      },
      onPanResponderMove: (_, gesture) => {
        const relativeX = gesture.moveX - trackLeft - CURSOR_SIZE / 2;
        const newX = Math.max(0, Math.min(SLIDER_WIDTH - CURSOR_SIZE, relativeX));
        pan.setValue(newX);
        setDisplayValue(Math.round((newX / (SLIDER_WIDTH - CURSOR_SIZE)) * 100));
      },
      onPanResponderRelease: (_, gesture) => {
        const relativeX = gesture.moveX - trackLeft - CURSOR_SIZE / 2;
        const newX = Math.max(0, Math.min(SLIDER_WIDTH - CURSOR_SIZE, relativeX));
        pan.setValue(newX);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        ref={trackRef}
        onLayout={() => {
          if (trackRef.current) {
            trackRef.current.measure((fx, fy, width, height, px) => {
              setTrackLeft(px);
            });
          }
        }}
      >
        <Animated.View
          style={[
            styles.cursor,
            {
              transform: [{ translateX: pan }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
      <Text style={{ marginTop: 20 }}>{displayValue} %</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  track: {
    width: SLIDER_WIDTH,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cursor: {
    position: 'absolute',
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    borderRadius: CURSOR_SIZE / 2,
    backgroundColor: '#FF6600',
    borderWidth: 2,
    borderColor: '#fff',
    top: -10,
  },
});

export default ProgressBarSlider;

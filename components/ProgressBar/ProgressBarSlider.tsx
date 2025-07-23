import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  findNodeHandle,
  UIManager,
} from 'react-native';

const BAR_WIDTH = 300;
const CURSOR_RADIUS = 30;

const ProgressBarSlider = () => {
  const [value, setValue] = useState(50);
  const [barLayout, setBarLayout] = useState({ x: 0, width: BAR_WIDTH });
  const [dragOffset, setDragOffset] = useState(0);

  const barRef = useRef<View>(null);

  const cursorX = (value / 100) * barLayout.width;

  useEffect(() => {
    if (barRef.current) {
      const handle = findNodeHandle(barRef.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, width, _height, pageX, _pageY) => {
          setBarLayout({ x: pageX, width });
        });
      }
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      // enregistrer l’offset entre le doigt et le centre du curseur
      onPanResponderGrant: (_, gestureState) => {
        const offset = gestureState.x0 - (barLayout.x + cursorX);
        setDragOffset(offset);
      },

      onPanResponderMove: (_, gestureState) => {
        const relativeX = gestureState.moveX - barLayout.x - dragOffset;
        const clampedX = Math.max(0, Math.min(relativeX, barLayout.width));
        const newValue = Math.round((clampedX / barLayout.width) * 100);
        setValue(newValue);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.valueText}>{value}</Text>
      <View ref={barRef} style={styles.barContainer}>
        <View style={styles.barBackground} />
        <View style={[styles.barFill, { width: cursorX }]} />
        <View
          style={[styles.cursor, { left: cursorX - CURSOR_RADIUS }]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

export default ProgressBarSlider;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  valueText: {
    fontSize: 18,
    marginBottom: 16,
  },
  barContainer: {
    width: BAR_WIDTH,
    height: 20,
    justifyContent: 'center',
  },
  barBackground: {
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    position: 'absolute',
    width: '100%',
  },
  barFill: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
    position: 'absolute',
  },
  cursor: {
    position: 'absolute',
    width: CURSOR_RADIUS * 2,
    height: CURSOR_RADIUS * 2,
    borderRadius: CURSOR_RADIUS,
    backgroundColor: '#000',
    top: -8,
  },
});

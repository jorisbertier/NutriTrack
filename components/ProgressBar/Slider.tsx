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
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 100;
const THUMB_RADIUS = 15;

type SliderProps = {
  onValueChange: (value: number) => void;
};


const Slider = ({ onValueChange}: SliderProps) => {

  const { colors } = useTheme();
  const { t } = useTranslation();

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
      runOnJS(onValueChange)(Number(percent)); 
      runOnJS(setValue)(percent);
    }
  );

  return (
    <View style={[styles.container]}>
      <View style={[styles.slider, { backgroundColor: "	rgba(214, 228, 253, 0.5)"}]}>
        <View style={{height: 1, backgroundColor: colors.white, width: '95%', margin: 'auto'}}></View>
        <LinearGradient
          colors={['#F0F0F0', colors.primary]} // exemple de dégradé
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.filledTrack, { width: translateX.value, zIndex: 0 }]}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle, { backgroundColor: colors.blueLight}]}>
            <View style={{zIndex: 100, borderColor: colors.white, borderRadius: 10, borderWidth: 2, justifyContent: 'center',alignItems: 'center', width: 40, height: 40}}>
              <View style={{width: 10, height: 10, backgroundColor: colors.primary, borderRadius: 2, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: colors.white, height: 3, width: 3}}></View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Text style={styles.valueText}>
        {value * 5} {t('calories').toLowerCase()}
      </Text>
      <Text style={{textAlign: 'center'}}>* {t('textEditgoal')}</Text>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10
  },
  slider: {
    width: SLIDER_WIDTH,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    // width: THUMB_RADIUS * 2,
    // height: THUMB_RADIUS * 2,
    width: 40,
    height: 40,
    // borderRadius: THUMB_RADIUS,
    borderRadius: 10,
    // top: -THUMB_RADIUS + 2,
    top: -THUMB_RADIUS + 15,
    left: -12
  },
  valueText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  filledTrack: {
    position: 'absolute',
    height: 40,
    borderRadius: 10,
},
});

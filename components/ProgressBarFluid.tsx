import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  value: number; // current value
  maxValue?: number; // maximum value
  nutri?: string; // label to display (e.g. "Kcal", "Fat")
  colorBarProgresse?: string; // progress color
  backgroundBarprogress?: string; // background track color
  style?: ViewStyle; // optional wrapper style
  height?: number; // height of the bar
};

export default function ProgressBarFluid({
    value,
    maxValue,
    nutri = '',
    colorBarProgresse = '#4CAF50',
    backgroundBarprogress = '#E6E6E6',
    style,
    height = 16,
}: Props) {
    // Don't render if maxValue is not defined or <= 0
    if (!maxValue || maxValue <= 0) return null;

    // Ensure integer values to avoid native precision errors
    const safeValue = Math.round(value);
    const safeMax = Math.round(maxValue);
    const barHeight = Math.round(height);

    // Compute ratio safely (0..1), limited to 2 decimals
    const ratio = Math.min(1, Math.max(0, Math.round((safeValue / safeMax) * 100) / 100));

    const progressAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
        toValue: ratio,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
        }).start();
    }, [ratio, progressAnim]);

    useEffect(() => {
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

    // Animated width (0..100%)
    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Shimmer translation
    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-40%', '40%'],
    });

    const percentage = Math.round((safeValue / safeMax) * 100);

    return (
        <View style={[styles.container, style]}>
        <View
            style={[
            styles.track,
            {
                backgroundColor: backgroundBarprogress,
                height: barHeight,
                borderRadius: Math.round(barHeight / 2),
            },
            ]}
            accessibilityRole="adjustable"
            accessibilityValue={{ min: 0, max: safeMax, now: safeValue }}
        >
            <Animated.View
            style={[
                styles.fill,
                {
                backgroundColor: colorBarProgresse,
                height: barHeight,
                borderRadius: Math.round(barHeight / 2),
                width: widthInterpolated,
                overflow: 'hidden',
                },
            ]}
            >
            <Animated.View
                style={[
                styles.shimmer,
                {
                    transform: [{ translateX: shimmerTranslate }],
                    height: barHeight * 1.4,
                    top: -(barHeight * 0.2),
                    opacity: 0.18,
                },
                ]}
            />
            </Animated.View>
        </View>

        <View style={styles.labelWrapper}>
            <Text style={styles.labelText} numberOfLines={1}>
                {percentage} %
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

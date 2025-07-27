import { useTheme } from '@/hooks/ThemeProvider';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, ViewStyle } from 'react-native';

type ToastType = 'success' | 'error';

    interface AnimatedToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onHide?: () => void;
    containerStyle?: ViewStyle;
}

export default function AnimatedToast({
    message,
    type = 'success',
    duration = 2500,
    onHide,
    containerStyle,
}: AnimatedToastProps) {

    const anim = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();

    useEffect(() => {
        // Show animation
        Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        }).start();

        // Hide après duration
        const timeout = setTimeout(() => {
        Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onHide && onHide();
        });
        }, duration);

        return () => clearTimeout(timeout);
    }, [anim, duration, onHide]);

    const backgroundColor =
        type === 'error' ? '#FF6B6B' : colors.blueLight; // rouge ou bleu (à adapter)

    return (
        <Animated.View
        style={[
            styles.toast,
            containerStyle,
            {
            opacity: anim,
            transform: [
                {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                }),
                },
            ],
            backgroundColor,
            },
        ]}
        >
        <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 200,
        left: 20,
        right: 20,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
        zIndex: 20
    },
    text: {
        color: '#fff',
        fontWeight: '500',
        textAlign: 'center',
    },
});

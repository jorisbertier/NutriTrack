import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

type ProgressBarProps = {
    progress: number;
    nutri: string;
    quantityGoal: number;
    color?: string;
    height?: number;
    isLoading: boolean
};

export const ProgressBarKcal: React.FC<ProgressBarProps> = ({
    isLoading,
    progress,
    nutri,
    quantityGoal,
    color = '#F97216',
    height = 12
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const percentage = Math.min((progress / quantityGoal) * 100, 100);

    // Valeur animée
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: percentage,
            duration: 800,
            useNativeDriver: false, // width n'accepte pas le native driver
        }).start();
    }, [percentage]);

    const widthInterpolated = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={[styles.progressBar1, { backgroundColor: colors.gray, height }]}>
                    <Animated.View style={[styles.progressBar2, { width: widthInterpolated, height }]}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#A9B8E3', '#8592F2', '#5B6FD2']}
                            style={{ flex: 1, borderRadius: 7 }}
                        />
                    </Animated.View>

                </View>
            ) : (
                <Skeleton colorMode={colorMode} width={'95%'} height={height} />
            )}
            {progress < quantityGoal ? (
                <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>
                    {t('work')} ...
                </ThemedText>
            ) : (
                <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>
                    {t('workDone')} !
                </ThemedText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 3,
    },
    progressBar1: {
        position: 'relative',
        width: '100%',
        borderRadius: 7,
        overflow: 'hidden',
        height: 12,
    },
    progressBar2: {
        height: 12,
        borderRadius: 7,
    },
    textProgress: {
        position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        top: 12,
        left: 20,
        height: 20,
    },
});

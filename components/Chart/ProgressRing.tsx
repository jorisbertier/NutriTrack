import { colorMode } from '@/constants/Colors';
import { calculatePercentage } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, Image } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ProgressBars: React.FC<any> = ({
    isLoading,
    progressProteins,
    proteinsGoal,
    progressCarbs,
    carbsGoal,
    progressFats,
    fatsGoal,
    goal,
    goalProteins,
    goalCarbs,
    goalFats,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const showGoalIconProteins = goalProteins > 0;
    const showGoalIconCarbs = goalCarbs > 0;
    const showGoalIconFats = goalFats > 0;

    const effectiveProteinGoal =
        proteinsGoal + (goalProteins && goalProteins > 0 ? goalProteins : 0);
    const effectiveCarbsGoal =
        carbsGoal + (goalCarbs && goalCarbs > 0 ? goalCarbs : 0);
    const effectiveFatsGoal =
        fatsGoal + (goalFats && goalFats > 0 ? goalFats : 0);

    let percentageProteins =
        typeof progressProteins === 'number' &&
        typeof effectiveProteinGoal === 'number' &&
        effectiveProteinGoal > 0
        ? calculatePercentage(progressProteins, effectiveProteinGoal)
        : 0;

    let percentageCarbs =
        typeof progressCarbs === 'number' &&
        typeof effectiveCarbsGoal === 'number' &&
        effectiveCarbsGoal > 0
        ? calculatePercentage(progressCarbs, effectiveCarbsGoal)
        : 0;

    let percentageFats =
        typeof progressFats === 'number' &&
        typeof effectiveFatsGoal === 'number' &&
        effectiveFatsGoal > 0
        ? calculatePercentage(progressFats, effectiveFatsGoal)
        : 0;

    // animated values
    const animProteins = useRef(new Animated.Value(0)).current;
    const animCarbs = useRef(new Animated.Value(0)).current;
    const animFats = useRef(new Animated.Value(0)).current;

    const normProteins = Math.min(percentageProteins, 100) / 100;
    const normCarbs = Math.min(percentageCarbs, 100) / 100;
    const normFats = Math.min(percentageFats, 100) / 100;


    useEffect(() => {
        Animated.timing(animProteins, {
            toValue: percentageProteins,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        Animated.timing(animCarbs, {
            toValue: percentageCarbs,
            easing: Easing.out(Easing.cubic),
            duration: 800,
            useNativeDriver: false,
        }).start();

        Animated.timing(animFats, {
            toValue: percentageFats,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [percentageProteins, percentageCarbs, percentageFats]);

    const formatNumber = (num: number) => {
        if (num === 0) return "0";
        return Number.isInteger(num) ? num.toString() : num.toFixed(1);
    };

    const renderBar = (
        label: string,
        progressValue: number,
        goal: number,
        anim: any,
        showGoal: boolean
    ) => {
        const ratio = goal > 0 ? progressValue / goal : 0;

        return (
            <View style={{ marginBottom: 15, width: '100%', gap: 5 }}>
                <Text style={[styles.percentageText, { color: colors.black }]}>
                    {label} {(ratio * 100).toFixed(0)} %
                </Text>
                <View style={styles.progressBarBackground}>
                    <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                        backgroundColor: colors.black,
                        width: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                        },
                    ]}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {showGoal && (
                        <Image
                        source={require('@/assets/images/icon/goal.png')}
                        style={{ width: 20, height: 20, marginRight: 5, tintColor: colors.black }}
                        />
                    )}
                    <Text style={[styles.percentageSubtext, { color: colors.black }]}>
                        {formatNumber(progressValue)} / {formatNumber(goal)} g
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.white }]}>
            <View style={styles.percentageContainer}>
                {isLoading ? (
                <>
                    {renderBar(t('proteins'), progressProteins, effectiveProteinGoal, animProteins, showGoalIconProteins)}
                    {renderBar(t('carbs'), progressCarbs, effectiveCarbsGoal, animCarbs, showGoalIconCarbs)}
                    {renderBar(t('fats'), progressFats, effectiveFatsGoal, animFats, showGoalIconFats)}
                </>
                ) : (
                <Skeleton colorMode={colorMode} width={screenWidth * 0.8} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: screenWidth,
        flexDirection: 'row',
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
    },
    percentageContainer: {
        flex: 0.9,
        justifyContent: 'center',
        gap: 10,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    percentageSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    progressBarBackground: {
        height: 10,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
});

export default ProgressBars;

import { colorMode } from '@/constants/Colors';
import { calculatePercentage } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

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

    useEffect(() => {
        Animated.timing(animProteins, {
        toValue: percentageProteins,
        duration: 800,
        useNativeDriver: false,
        }).start();

        Animated.timing(animCarbs, {
        toValue: percentageCarbs,
        duration: 800,
        useNativeDriver: false,
        }).start();

        Animated.timing(animFats, {
        toValue: percentageFats,
        duration: 800,
        useNativeDriver: false,
        }).start();
    }, [percentageProteins, percentageCarbs, percentageFats]);

    const formatNumber = (num: number) => {
        if (num === 0) return "0";
        return Number.isInteger(num) ? num.toString() : num.toFixed(1);
        };
    const renderBar = (label: string, value: number, goal: number, anim: any, showGoal: boolean) => {
        return (
        <View style={{ marginBottom: 15, width: '100%', gap: 5 }}>
            <Text style={[styles.percentageText, { color: colors.black }]}>
            {label} {(value * 100).toFixed(0)} %
            </Text>
            <View style={styles.progressBarBackground}>
            <Animated.View
                style={[
                styles.progressBarFill,
                {
                    backgroundColor: '#8592F2',
                    width: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                    }),
                },
                ]}
            />
            </View>
            <Text style={[styles.percentageSubtext, { color: colors.black }]}>
                {showGoal && '🎯'} {formatNumber(value * goal)} / {formatNumber(goal)} g
            </Text>
        </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.white }]}>
        <View style={styles.percentageContainer}>
            {isLoading ? (
            <>
                {renderBar(t('proteins'), percentageProteins, effectiveProteinGoal, animProteins, showGoalIconProteins)}
                {renderBar(t('carbs'), percentageCarbs, effectiveCarbsGoal, animCarbs, showGoalIconCarbs)}
                {renderBar(t('fats'), percentageFats, effectiveFatsGoal, animFats, showGoalIconFats)}
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


// import { colorMode } from '@/constants/Colors';
// import { calculatePercentage } from '@/functions/function';
// import { useTheme } from '@/hooks/ThemeProvider';
// import { Skeleton } from 'moti/skeleton';
// import React, { useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
// import { Svg, Circle } from 'react-native-svg';

// const screenWidth = Dimensions.get('window').width;
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const ProgressRing: React.FC<any> = ({isLoading, progressProteins, proteinsGoal, progressCarbs, carbsGoal, progressFats, fatsGoal,goal, goalProteins, goalCarbs, goalFats}) => {

//     const { colors } = useTheme();
//     const { t } = useTranslation();
//     const showGoalIconProteins = goalProteins > 0;
//     const showGoalIconCarbs = goalCarbs > 0;
//     const showGoalIconFats = goalFats > 0;
//     const effectiveProteinGoal = proteinsGoal + (goalProteins && goalProteins > 0 ? goalProteins : 0);
//     const effectiveCarbsGoal = carbsGoal + (goalCarbs && goalCarbs > 0 ? goalCarbs : 0);
//     const effectiveFatsGoal = fatsGoal + (goalFats && goalFats > 0 ? goalFats : 0);

//     let percentageProteins = (typeof progressProteins === 'number' && typeof effectiveProteinGoal === 'number' && effectiveProteinGoal > 0)
//         ? calculatePercentage(progressProteins, effectiveProteinGoal)
//     : 0;

//     let percentageCarbs = (typeof progressCarbs === 'number' && typeof effectiveCarbsGoal === 'number' && effectiveCarbsGoal > 0)
//         ? calculatePercentage(progressCarbs, effectiveCarbsGoal)
//     : 0;

//     let percentageFats = (typeof progressFats === 'number' && typeof effectiveFatsGoal === 'number' && effectiveFatsGoal > 0)
//         ? calculatePercentage(progressFats, effectiveFatsGoal)
//     : 0;

//     const radiusOuter = 70;   // Rayon pour le cercle des graisses
//     const radiusMiddle = 50;   // Rayon pour le cercle des glucides
//     const radiusInner = 30;     // Rayon pour le cercle des protéines

//     const circumferenceOuter = 2 * Math.PI * radiusOuter;
//     const circumferenceMiddle = 2 * Math.PI * radiusMiddle;
//     const circumferenceInner = 2 * Math.PI * radiusInner;
    
//     const offsetFats = useRef(new Animated.Value(circumferenceOuter)).current;
//     const offsetCarbs = useRef(new Animated.Value(circumferenceMiddle)).current;
//     const offsetProteins = useRef(new Animated.Value(circumferenceInner)).current;

//     useEffect(() => {
//         Animated.timing(offsetFats, {
//         toValue: circumferenceOuter * (1 - percentageFats),
//         duration: 800,
//         useNativeDriver: false,
//         }).start();

//         Animated.timing(offsetCarbs, {
//         toValue: circumferenceMiddle * (1 - percentageCarbs),
//         duration: 800,
//         useNativeDriver: false,
//         }).start();

//         Animated.timing(offsetProteins, {
//         toValue: circumferenceInner * (1 - percentageProteins),
//         duration: 800,
//         useNativeDriver: false,
//         }).start();
//     }, [percentageFats, percentageCarbs, percentageProteins]);

//     return (
//         <View style={[styles.container, {backgroundColor: colors.white}]}>
//             <View style={{width: '50%'}}>
//                 <Svg height={150} width={150}>
//                 {/* Cercle de fond */}
//                 <Circle cx="75" cy="75" r={radiusOuter} stroke="#E0E0E0" strokeWidth="7" fill="none" />
//                 <AnimatedCircle
//                     cx="75"
//                     cy="75"
//                     r={radiusOuter}
//                     stroke="#8592F2"
//                     strokeWidth="7"
//                     fill="none"
//                     strokeDasharray={`${circumferenceOuter} ${circumferenceOuter}`}
//                     strokeDashoffset={offsetFats}
//                     strokeLinecap="round"
//                 />

//                 <Circle cx="75" cy="75" r={radiusMiddle} stroke="#E0E0E0" strokeWidth="7" fill="none" />
//                 <AnimatedCircle
//                     cx="75"
//                     cy="75"
//                     r={radiusMiddle}
//                     stroke="#8592F2"
//                     strokeWidth="7"
//                     fill="none"
//                     strokeDasharray={`${circumferenceMiddle} ${circumferenceMiddle}`}
//                     strokeDashoffset={offsetCarbs}
//                     strokeLinecap="round"
//                 />

//                 <Circle cx="75" cy="75" r={radiusInner} stroke="#E0E0E0" strokeWidth="7" fill="none" />
//                 <AnimatedCircle
//                     cx="75"
//                     cy="75"
//                     r={radiusInner}
//                     stroke="#8592F2"
//                     strokeWidth="7"
//                     fill="none"
//                     strokeDasharray={`${circumferenceInner} ${circumferenceInner}`}
//                     strokeDashoffset={offsetProteins}
//                     strokeLinecap="round"
//                 />
//                 </Svg>
//             </View>
            
//             <View style={styles.percentageContainer}>
//                 {isLoading ?
//                     <View>
//                         <Text style={[styles.percentageText, {color: colors.black}]}>{t('proteins')} {(percentageProteins * 100).toFixed(0)} %</Text>
//                         <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconProteins && '🎯'} {progressProteins} / {effectiveProteinGoal} g</Text>
//                     </View>
//                 :
//                     <Skeleton colorMode={colorMode} width={150} />
//                 }
//                 {isLoading ?
//                 <View>
//                     <Text style={[styles.percentageText, {color: colors.black}]}>{t('carbs')} {(percentageCarbs * 100).toFixed(0)} %</Text>
//                     <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconCarbs && '🎯'} {progressCarbs} / {effectiveCarbsGoal} g</Text>
//                 </View>
//                 :
//                     <Skeleton colorMode={colorMode} width={150} />
//                 }
//                 {isLoading ?
//                 <View>
//                     <Text style={[styles.percentageText, {color: colors.black}]}>{t('fats')} {typeof percentageFats === 'number' ? Math.round(percentageFats * 100) : 0} %</Text>
//                     <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconFats && '🎯'} {progressFats} / {effectiveFatsGoal} g</Text>
//                 </View>
//                 :
//                     <Skeleton colorMode={colorMode} width={150} />
//                 }
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: screenWidth,
//         flexDirection: 'row',
//         padding: 10,
//         paddingRight: 10,
//         paddingLeft: 10,
//         borderRadius: 20,
//         maxWidth: '100%',
//         marginBottom: 20
//     },
//     title: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     percentageContainer: {
//         width: '50%',
//         alignItems: 'flex-start',
//         justifyContent: 'center',
//         gap: 10,
//         borderTopRightRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     percentageText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     percentageSubtext : {
//         fontSize: 10,
//     }
// });

// export default ProgressRing;
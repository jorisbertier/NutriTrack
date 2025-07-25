import { colorMode } from '@/constants/Colors';
import { calculatePercentage } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider';
import { Skeleton } from 'moti/skeleton';
import React, { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

    const screenWidth = Dimensions.get('window').width;

    const ProgressRing: React.FC<any> = ({isLoading, progressProteins, proteinsGoal, progressCarbs, carbsGoal, progressFats, fatsGoal,goal, goalProteins, goalCarbs, goalFats}) => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const showGoalIconProteins = goalProteins > 0;
    const showGoalIconCarbs = goalCarbs > 0;
    const showGoalIconFats = goalFats > 0;
    // const showGoalIcon = goal !== "maintain";
    const effectiveProteinGoal = proteinsGoal + (goalProteins && goalProteins > 0 ? goalProteins : 0);
    const effectiveCarbsGoal = carbsGoal + (goalCarbs && goalCarbs > 0 ? goalCarbs : 0);
    const effectiveFatsGoal = fatsGoal + (goalFats && goalFats > 0 ? goalFats : 0);

    let percentageProteins = (typeof progressProteins === 'number' && typeof effectiveProteinGoal === 'number' && effectiveProteinGoal > 0)
        ? calculatePercentage(progressProteins, effectiveProteinGoal)
    : 0;

    let percentageCarbs = (typeof progressCarbs === 'number' && typeof effectiveCarbsGoal === 'number' && effectiveCarbsGoal > 0)
        ? calculatePercentage(progressCarbs, effectiveCarbsGoal)
    : 0;

    let percentageFats = (typeof progressFats === 'number' && typeof effectiveFatsGoal === 'number' && effectiveFatsGoal > 0)
        ? calculatePercentage(progressFats, effectiveFatsGoal)
    : 0;

    const radiusOuter = 70;   // Rayon pour le cercle des graisses
    const radiusMiddle = 50;   // Rayon pour le cercle des glucides
    const radiusInner = 30;     // Rayon pour le cercle des protéines

    const circumferenceOuter = 2 * Math.PI * radiusOuter;
    const circumferenceMiddle = 2 * Math.PI * radiusMiddle;
    const circumferenceInner = 2 * Math.PI * radiusInner;

    return (
        <View style={[styles.container, {backgroundColor: colors.white, borderColor: colors.gray, borderWidth: 1, elevation: 2}]}>
            <View style={{width: '50%'}}>
            <Svg height={150} width={150}>
                {/* Cercle des graisses */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusOuter}
                    stroke="#E0E0E0"
                    strokeWidth="7"
                    fill="none"
                />
                {/* Cercle des graisses */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusOuter}
                    stroke="#8592F2"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${circumferenceOuter} ${circumferenceOuter}`}
                    strokeDashoffset={circumferenceOuter * (1 - percentageFats)} 
                    strokeLinecap="round"
                    // opacity={percentageFats}
                />
                {/* Cercle de fond pour les glucides */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusMiddle}
                    stroke="#E0E0E0"
                    strokeWidth="7"
                    fill="none"
                />
                {/* Cercle des glucides */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusMiddle}
                    stroke="#8592F2"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${circumferenceMiddle} ${circumferenceMiddle}`}
                    strokeDashoffset={circumferenceMiddle * (1 - percentageCarbs)}
                    strokeLinecap="round"
                    // opacity={percentageCarbs}
                />
                {/* Cercle de fond pour les protéines */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusInner}
                    stroke="#E0E0E0"
                    strokeWidth="7"
                    fill="none"
                />
                {/* Cercle des protéines */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusInner}
                    stroke="#8592F2"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${circumferenceInner} ${circumferenceInner}`}
                    strokeDashoffset={circumferenceInner * (1 - percentageProteins)}
                    strokeLinecap="round"
                    // opacity={percentageProteins}
                />
            </Svg>
            </View>
            
            <View style={styles.percentageContainer}>
                {isLoading ?
                    <View>
                        <Text style={[styles.percentageText, {color: colors.black}]}>{t('proteins')} {(percentageProteins * 100).toFixed(0)} %</Text>
                        <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconProteins && '🎯'} {progressProteins} / {effectiveProteinGoal} g</Text>
                    </View>
                :
                    <Skeleton colorMode={colorMode} width={150} />
                }
                {isLoading ?
                <View>
                    <Text style={[styles.percentageText, {color: colors.black}]}>{t('carbs')} {(percentageCarbs * 100).toFixed(0)} %</Text>
                    <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconCarbs && '🎯'} {progressCarbs} / {effectiveCarbsGoal} g</Text>
                </View>
                :
                    <Skeleton colorMode={colorMode} width={150} />
                }
                {isLoading ?
                <View>
                    <Text style={[styles.percentageText, {color: colors.black}]}>{t('fats')} {typeof percentageFats === 'number' ? Math.round(percentageFats * 100) : 0} %</Text>
                    <Text style={[styles.percentageSubtext, {color: colors.black}]}>{showGoalIconFats && '🎯'} {progressFats} / {effectiveFatsGoal} g</Text>
                </View>
                :
                    <Skeleton colorMode={colorMode} width={150} />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: screenWidth,
        flexDirection: 'row',
        padding: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 20,
        maxWidth: '100%',
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    percentageContainer: {
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    percentageText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    percentageSubtext : {
        fontSize: 10,
    }
});

export default ProgressRing;
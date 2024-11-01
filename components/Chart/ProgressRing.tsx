import { colorMode } from '@/constants/Colors';
import { calculatePercentage } from '@/functions/function';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const ProgressRing: React.FC<any> = ({isLoading, progressProteins, proteinsGoal, progressCarbs, carbsGoal, progressFats, fatsGoal}) => {

    let percentageProteins = (typeof progressProteins === 'number' && typeof proteinsGoal === 'number' && proteinsGoal > 0)
        ? calculatePercentage(progressProteins, proteinsGoal)
    : 0;

    let percentageCarbs = (typeof progressCarbs === 'number' && typeof carbsGoal === 'number' && carbsGoal > 0)
        ? calculatePercentage(progressCarbs, carbsGoal)
    : 0;

    let percentageFats = (typeof progressFats === 'number' && typeof fatsGoal === 'number' && fatsGoal > 0)
        ? calculatePercentage(progressFats, fatsGoal)
    : 0;

    const radiusOuter = 70;   // Rayon pour le cercle des graisses
    const radiusMiddle = 50;   // Rayon pour le cercle des glucides
    const radiusInner = 30;     // Rayon pour le cercle des protéines

    const circumferenceOuter = 2 * Math.PI * radiusOuter;
    const circumferenceMiddle = 2 * Math.PI * radiusMiddle;
    const circumferenceInner = 2 * Math.PI * radiusInner;

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Macronutrients goal</Text> */}
            <View style={{width: '50%'}}>
            <Svg height={150} width={150}>
                {/* Cercle des graisses */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusOuter}
                    stroke="#E0E0E0"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Cercle des graisses */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusOuter}
                    stroke="#8592F2"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${circumferenceOuter} ${circumferenceOuter}`}
                    strokeDashoffset={circumferenceOuter * (1 - percentageFats)} 
                    strokeLinecap="round"
                    opacity={percentageFats}
                />
                {/* Cercle de fond pour les glucides */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusMiddle}
                    stroke="#E0E0E0"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Cercle des glucides */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusMiddle}
                    stroke="#8592F2"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${circumferenceMiddle} ${circumferenceMiddle}`}
                    strokeDashoffset={circumferenceMiddle * (1 - percentageCarbs)}
                    strokeLinecap="round"
                    opacity={percentageCarbs}
                />
                {/* Cercle de fond pour les protéines */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusInner}
                    stroke="#E0E0E0"
                    strokeWidth="8"
                    fill="none"
                />
                {/* Cercle des protéines */}
                <Circle
                    cx="75"
                    cy="75"
                    r={radiusInner}
                    stroke="#8592F2"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${circumferenceInner} ${circumferenceInner}`}
                    strokeDashoffset={circumferenceInner * (1 - percentageProteins)}
                    strokeLinecap="round"
                    opacity={percentageProteins}
                />
            </Svg>
            </View>
            
            <View style={styles.percentageContainer}>
                {isLoading ?
                    <View>
                        <Text style={styles.percentageText}>Proteins {(percentageProteins * 100).toFixed(0)} %</Text>
                        <Text style={styles.percentageSubtext}>{progressProteins} / {proteinsGoal} g</Text>
                    </View>
                :
                    <Skeleton colorMode={colorMode} width={150} />
                }
                {isLoading ?
                <View>
                    <Text style={styles.percentageText}>Carbs {(percentageCarbs * 100).toFixed(0)} %</Text>
                    <Text style={styles.percentageSubtext}>{progressCarbs} / {carbsGoal} g</Text>
                </View>
                :
                    <Skeleton colorMode={colorMode} width={150} />
                }
                {isLoading ?
                <View>
                    <Text style={styles.percentageText}>Fats {(percentageFats * 100).toFixed(0)} %</Text>
                    <Text style={styles.percentageSubtext}>{progressFats} / {fatsGoal} g</Text>
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
        backgroundColor: '#F5F5F5',
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
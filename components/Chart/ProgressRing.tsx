// import { calculatePercentage } from '@/functions/function';
// import React from 'react';
// import { View, Text } from 'react-native';
// import { Dimensions } from 'react-native';
// import { ProgressChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// type Props = {
//     progessProteins: number;
//     progressCarbs: number;
//     progressFats: number;
//     proteinsGoal: number;
//     carbsGoal: number;
//     fatsGoal:  number;
// };


// const ProgressRing: React.FC<Props> = ({progessProteins, proteinsGoal, progressCarbs, carbsGoal, progressFats, fatsGoal}) => {

//     // let percentageProteins = +(progessProteins / proteinsGoal).toFixed(2);
//     // // let percentageCarbs = +(progressCarbs / carbsGoal).toFixed(2);
//     // let percentageFats = +(progressFats / fatsGoal).toFixed(2);
//     // // calculatePercentage(progessProteins, proteinsGoal)
//     // // calculatePercentage(progressCarbs, carbsGoal)
//     // // calculatePercentage(progressFats, fatsGoal)
//     // if(percentageProteins > 1) {
//     //     if(percentageProteins <= 0) return 0;
//     //     percentageProteins = 1;
//     // }
//     // if(percentageCarbs > 1) {
//     //     percentageCarbs = 1;
//     // }
//     // if(percentageFats > 1) {
//     //     percentageFats = 1;
//     // }
//     const data = {
//         labels: ["Proteins", "Carbs", "Fats"], // optional
//         data: [0.2, 0.6, 0.8],
//     };
//     const chartConfig = {
//         backgroundGradientFrom: "white",
//         backgroundGradientFromOpacity: 0,
//         backgroundGradientTo: "white",
//         backgroundGradientToOpacity: 0.5,
//         color: (opacity = 1) => `rgba(127, 17, 224, ${opacity})`,
//         strokeWidth: 2, // optional, default 3
//         barPercentage: 0.5,
//         useShadowColorFromDataset: false // optional
//       };

//     return (
//         <View style={{ alignItems: 'center' }}>
//             <Text style={{ fontSize: 18, marginBottom: 10 }}>Macronutrients goal</Text>
//             {/* <ProgressCircle
//                 values={[data1, data2, data3]} // Données pour chaque anneau
//                 radius={40}
//                 borderWidth={8}
//                 color={['#FF6384', '#36A2EB', '#FFCE56']} // Couleurs pour chaque anneau
//                 duration={2000}
//                 style={{ marginVertical: 10 }}
//                 // Ajoute d'autres propriétés ici si nécessaire
//             /> */}
//             <ProgressChart
//                 data={data}
//                 width={screenWidth}
//                 height={220}
//                 strokeWidth={16}
//                 radius={32}
//                 chartConfig={chartConfig}
//                 hideLegend={false}
//                 />
//             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: screenWidth }}>
//                 <Text>Data 1: {data1}%</Text>
//                 <Text>Data 2: {data2}%</Text>
//                 <Text>Data 3: {data3}%</Text>
//             </View> */}
//         </View>
//     );
// };

// export default ProgressRing;
import { calculatePercentage } from '@/functions/function';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const ProgressRing: React.FC<any> = ({progressProteins, proteinsGoal, progressCarbs, carbsGoal, progressFats, fatsGoal}) => {

    let percentageProteins  = calculatePercentage(progressProteins, proteinsGoal)
    let percentageCarbs  = calculatePercentage(progressCarbs, carbsGoal)
    let percentageFats  = calculatePercentage(progressFats, fatsGoal)
   
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
                <View>
                    <Text style={styles.percentageText}>Proteins {(percentageProteins * 100).toFixed(0)} %</Text>
                    <Text style={styles.percentageSubtext}>{progressProteins} / {proteinsGoal} g</Text>

                </View>
                <View>
                <Text style={styles.percentageText}>Carbs {(percentageCarbs * 100).toFixed(0)} %</Text>
                <Text style={styles.percentageSubtext}>{progressCarbs} / {carbsGoal} g</Text>
                </View>
                <View>
                    <Text style={styles.percentageText}>Fats {(percentageFats * 100).toFixed(0)} %</Text>
                    <Text style={styles.percentageSubtext}>{progressFats} / {fatsGoal} g</Text>
                </View>
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
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    percentageContainer: {
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10
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
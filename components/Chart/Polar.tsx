
import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const data = [
    { date: 'M', calories: 2200 },
    { date: 'T', calories: 1700 },
    { date: 'W', calories: 3000 },
    { date: 'T', calories: 1500 },
    { date: 'F', calories: 2400 },
    { date: 'S', calories: 3000 },
    { date: 'S', calories: 2100 },
  ];
  
  const { width } = Dimensions.get('window');
  
  const CalorieBarChart = () => {
      // Trouver la valeur maximale pour ajuster la hauteur des barres
    const { colors } = useTheme()
    const maxCalories = Math.max(...data.map(item => item.calories));
    const steps = 3; // Diviser l'axe Y en 5 étapes
    const stepValue = Math.ceil(maxCalories / steps);

    const max = Math.max(...data.map(item => item.calories));
    console.log(max)
    // data.sort((a, b) => a.calories - b.calories)
    // console.log(data.calories[0])
    // const associations = { [data.calories[0]] : 100, }

    return (
    <View style={styles.container}>
        <Text style={styles.title}>calories / 7 days</Text>
        <View style={styles.chartContainer}>
        {/* Affichage de l'axe Y avec les valeurs */}
        <View style={styles.yAxis}>
            {Array.from({ length:  steps + 1 }).map((_, index) => {
            const yValue = stepValue * index; // Calcul des valeurs sur l'axe Y
            return (
                <Text key={index} style={styles.yAxisText}>
                {yValue}
                </Text>
            );
            })}
        </View>

        {/* Affichage des barres */}
        <View style={styles.barsContainer}>
            {data.map((item, index) => {
            const barHeight = (item.calories / maxCalories) * 140; // Normalisation de la hauteur des barres
            const isMax = item.calories === max
            return (
                <View key={index} style={styles.barContainer}>
                <View
                    style={[
                    styles.bar,
                    { height: barHeight, width: ( 100 ) / 7 },
                    {backgroundColor: isMax ? colors.primary : colors.blueLight}]}
                />
                <Text style={styles.dateText}>{item.date}</Text>
                </View>
            );
            })}
        </View>
        </View>
        {/* <View style={styles.axisContainer}>
        <Text style={styles.axisText}>Calories</Text>
        </View> */}
    </View>
    );
};
  
  const styles = StyleSheet.create({
    container: {
        height: 230,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 20,
        paddingLeft: '5%',
        paddingRight:'5%',
        maxWidth: '90%',
        backgroundColor: 'white',
        borderRadius: 20
    },
    title: {
      fontSize: 18,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      height: 200,
      marginBottom: 10,
    },
    yAxis: {
      justifyContent: 'space-between',
      height: 170,
      marginRight: 10,
      alignItems: 'center',
      width: '10%',
      flexDirection: 'column-reverse'
    },
    yAxisText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#555',
    },
    barsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '90%',
    },
    barContainer: {
      alignItems: 'center',
    },
    bar: {
      borderRadius: 10,
    },
    dateText: {
      fontSize: 12,
      marginTop: 5,
    },
    axisContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignItems: 'center',
    },
    axisText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
export default CalorieBarChart;
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const data = [
  { date: 'M', calories: 2200 },
  { date: 'T', calories: 1700 },
  { date: 'W', calories: 3000 },
  { date: 'T', calories: 1500 },
  { date: 'F', calories: 2400 },
  { date: 'S', calories: 3000 },
  { date: 'S', calories: 2100 },
];

const monthlyData = [
  { week: 'Week 1', calories: 15000 },
  { week: 'Week 2', calories: 14000 },
  { week: 'Week 3', calories: 16000 },
  { week: 'Week 4', calories: 15500 },
];

const yearlyData = [
  { month: 'J', calories: 60000 },
  { month: 'F', calories: 58000 },
  { month: 'M', calories: 61000 },
  { month: 'A', calories: 59000 },
  { month: 'M', calories: 62000 },
  { month: 'J', calories: 60000 },
  { month: 'J', calories: 63000 },
  { month: 'A', calories: 61000 },
  { month: 'S', calories: 62000 },
  { month: 'O', calories: 59000 },
  { month: 'N', calories: 61000 },
  { month: 'D', calories: 60000 },
];

const periods = [
  { label: '7 days', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '1 Year', value: 'year' },
];

const { width } = Dimensions.get('window');

const CalorieBarChart = () => {
  const { colors } = useTheme();
  const [period, setPeriod] = useState('week'); // Période sélectionnée
  const [indicatorPosition] = useState(new Animated.Value(0)); // Position de l'indicateur
  
  const getDataByPeriod = () => {
    switch (period) {
      case 'week':
        return data;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return data;
    }
  };
  const getWidthByPeriod = () => {
    switch (period) {
      case 'week':
        return 10;
      case 'month':
        return 20;
      case 'year':
        return 10;
      default:
        return '80%'; // Valeur par défaut
    }
  };

  const handlePress = (index, value) => {
    setPeriod(value);
    Animated.spring(indicatorPosition, {
      toValue: index * (width / periods.length),
      useNativeDriver: false,
    }).start();
  };

  const displayedData = getDataByPeriod();

  const maxData = Math.max(...displayedData.map((item) => item.calories))
  console.log('value max', maxData)


  const maxCalories = Math.max(...displayedData.map(item => item.calories));
  const steps = 3; // Diviser l'axe Y en étapes
  const stepValue = Math.ceil(maxCalories / steps);

  const [animatedHeights, setAnimatedHeights] = useState([]);
  useEffect(() => {
    // Initialise les animations pour chaque barre
    setAnimatedHeights(
      displayedData.map((item) => new Animated.Value(0))
    );

    // Lance l'animation des hauteurs
    displayedData.forEach((item, index) => {
      Animated.timing(animatedHeights[index], {
        toValue: (item.calories / maxCalories) * 140,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
  }, [period]);


  return (
    <View style={styles.container}>
      {/* Boutons pour changer la période */}
      <View style={styles.buttonContainer}>
        {periods.map((item, index) => (
          <TouchableOpacity
            key={item.value}
            style={styles.button}
            onPress={() => handlePress(index, item.value)}
          >
            <Text
              style={[
                styles.text,
                period === item.value && styles.textSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <Text style={styles.title}>
        Calories / {period === 'week' ? '7 Days' : period === 'month' ? '4 Weeks' : '12 Months'}
      </Text>

      <View style={styles.chartContainer}>
        {/* Axe Y */}
        <View style={styles.yAxis}>
          {Array.from({ length: steps + 1 }).map((_, index) => {
            const yValue = stepValue * index;
            return (
              <Text key={index} style={styles.yAxisText}>
                {yValue}
              </Text>
            );
          })}
        </View>

        {/* Barres */}
        <View style={styles.barsContainer}>
          {displayedData.map((item, index) => {
            const barHeight = (item.calories / maxCalories) * 140;
            return (
              <View key={index} style={styles.barContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: animatedHeights[index],
                      width: getWidthByPeriod(),
                      backgroundColor: item.calories == maxData ? colors.primary : colors.blueLight,
                    },
                  ]}
                />
                <Text style={styles.dateText}>{item.date || item.week || item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingLeft: '4%',
    paddingRight: '4%',
    maxWidth: '92%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 3,
    },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '80%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#888',
  },
  textSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '90%',
    height: 200,
    marginBottom: 10,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 170,
    marginRight: 10,
    alignItems: 'center',
    width: '10%',
    flexDirection: 'column-reverse',
  },
  yAxisText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    borderRadius: 10,
  },
  dateText: {
    fontSize: 9,
    marginTop: 5,
  },
});

export default CalorieBarChart;

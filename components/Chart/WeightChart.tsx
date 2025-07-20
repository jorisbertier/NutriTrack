import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type Period = 'Days' | 'Weeks' | 'Months' | 'Years';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 180;

type WeightEntry = {
  date: string; // format: dd/mm/yyyy
  weight: number;
};

// const generateDates = (count: number) => {
//   const today = new Date();
//   return Array.from({ length: count }, (_, i) => {
//     const date = new Date(today);
//     date.setDate(date.getDate() - (count - i - 1));
//     return date.toLocaleDateString('fr-FR');
//   });
// };
const generateDates = (count: number) => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (count - i - 1));
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date); // Résultat : 20/07
  });
};

const fakeData: Record<Period, WeightEntry[]> = {
  Days: generateDates(8).map((date, i) => ({ date, weight: [60, 70, 65, 80, 75, 90, 100, 116][i] })),
  Weeks: generateDates(7).map((date, i) => ({ date, weight: [70, 75, 80, 85, 95, 100, 110][i] })),
  Months: generateDates(6).map((date, i) => ({ date, weight: [65, 72, 78, 85, 93, 105][i] })),
  Years: generateDates(4).map((date, i) => ({ date, weight: [50, 80, 100, 116][i] })),
};

const MAX_Y = 120;
const MIN_Y = 50;
const WeightChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Days');
  const entries = fakeData[selectedPeriod];
  const pointCount = entries.length;

  const stepX = chartWidth / (pointCount - 1);
  const scaleY = (value: number) => {
    return chartHeight - ((value - MIN_Y) / (MAX_Y - MIN_Y)) * chartHeight;
  };

  const generateSmoothPath = () => {
    if (entries.length < 2) return '';

    let d = '';
    for (let i = 0; i < entries.length; i++) {
      const x = i * stepX;
      const y = scaleY(entries[i].weight);

      if (i === 0) {
        d += `M${x},${y}`;
      } else {
        const prevX = (i - 1) * stepX;
        const prevY = scaleY(entries[i - 1].weight);

        const cx = (prevX + x) / 2;
        d += ` C${cx},${prevY} ${cx},${y} ${x},${y}`;
      }
    }
    return d;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Chart</Text>

      <View style={styles.svgWrapper}>
        <Svg height={chartHeight + 40} width={chartWidth}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines + Y axis labels */}
          {[50, 100, 116].map((yVal) => {
            const y = scaleY(yVal);
            return (
              <React.Fragment key={yVal}>
                <Line
                  x1="0"
                  x2={chartWidth}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <SvgText
                  x={0}
                  y={y + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="start"
                >
                  {yVal} kg
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Gradient under the curve */}
          <Path
            d={`${generateSmoothPath()} L${(pointCount - 1) * stepX},${chartHeight} L0,${chartHeight} Z`}
            fill="url(#gradient)"
          />

          {/* Main line path */}
          <Path
            d={generateSmoothPath()}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
          />

          {/* Points */}
          {entries.map((entry, index) => {
            const x = index * stepX;
            const y = scaleY(entry.weight);
            return (
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="#fff"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            );
          })}

          {/* Dates below each point */}
          {entries.map((entry, index) => {
            const x = index * stepX;
            return (
              <SvgText
                key={`label-${index}`}
                x={x}
                y={chartHeight + 16}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {entry.date}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Boutons période */}
      <View style={styles.buttonsContainer}>
        {(['Days', 'Weeks', 'Months', 'Years'] as Period[]).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[
              styles.button,
              selectedPeriod === period && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === period && styles.selectedButtonText,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default WeightChart;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    elevation: 2,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  svgWrapper: {
    height: chartHeight + 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 6,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 13,
    color: '#6b7280',
  },
  selectedButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
});

import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type Period = 'Weeks';

const { width } = Dimensions.get('window');
const chartWidth = width - 100;
const chartHeight = 180;

type WeightEntry = {
  date: string;
  label: string;
  weight: number;
};

const MAX_Y = 120;
const MIN_Y = 30;

const WeightChart = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Weeks');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUserDataConnected(user, setUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

const entries: WeightEntry[] = useMemo(() => {
  const log = userData?.[0]?.weightLog;

  if (!Array.isArray(log) || log.length === 0) return [];

  const processedEntries = log
    .map((entry: any) => {
      if (!entry?.date || typeof entry.date !== 'string') return null;

      const parts = entry.date.split('/');
      if (parts.length !== 3) return null;

      const [day, month, year] = parts;
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const jsDate = new Date(isoDate);

      if (isNaN(jsDate.getTime())) return null;

      return {
        date: isoDate,
        label: new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
        }).format(jsDate),
        weight: entry.weight,
      };
    })
    .filter((entry): entry is WeightEntry => entry !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // On ne garde que les 7 derniers éléments (les plus récents)
  return processedEntries.slice(-7);
}, [userData]);

  const pointCount = entries.length;
  const paddingHorizontal = 20;
  const effectiveChartWidth = chartWidth - 2 * paddingHorizontal;
  const stepX = pointCount > 1 ? effectiveChartWidth / (pointCount - 1) : effectiveChartWidth;

  const maxWeight = Math.max(...entries.map(entry => entry.weight));
  const topYValue = Math.ceil((maxWeight + 10) / 10) * 10; // arrondi supérieur

  // Génère les ticks dynamiques pour l'axe Y
  const yTicks = [];
  console.log('maw wieght', maxWeight)
let tickStep = 10;

if (maxWeight > 100) {
  tickStep = 30;
} else if (maxWeight > 200) {
  tickStep = 40;
} else if (maxWeight > 300) {
  tickStep = 50;
}
  for (let y = MIN_Y; y <= topYValue; y += tickStep) {
    yTicks.push(y);
  }

  const scaleY = (value: number) => {
    return chartHeight - ((value - MIN_Y) / (topYValue - MIN_Y)) * chartHeight;
  };

  const generateSmoothPath = () => {
    // if (entries.length === 1) {
    //   const x = paddingHorizontal;
    //   const y = scaleY(entries[0].weight);
    //   return `M${x},${y}`;
    // }
    // if (entries.length < 2) return '';
    if (entries.length < 2) return '';

    let d = '';
    for (let i = 0; i < entries.length; i++) {
      const x = paddingHorizontal + i * stepX;
      const y = scaleY(entries[i].weight);

      if (i === 0) {
        d += `M${x},${y}`;
      } else {
        const prevX = paddingHorizontal + (i - 1) * stepX;
        const prevY = scaleY(entries[i - 1].weight);
        const cx = (prevX + x) / 2;
        d += ` C${cx},${prevY} ${cx},${y} ${x},${y}`;
      }
    }
    return d;
  };

  if (!entries.length || entries.length < 2) {
    return <Text style={{ textAlign: 'center' }}>Aucune donnée disponible</Text>;
  }

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

          {yTicks.map((yVal) => {
            const y = scaleY(yVal);
            return (
              <React.Fragment key={yVal}>
                <Line x1={paddingHorizontal} x2={chartWidth - paddingHorizontal} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <SvgText x={0} y={y - 3} fontSize="12" fill="#6b7280" textAnchor="start">
                  {yVal} kg
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Gradient under the curve */}
          <Path
            d={`${generateSmoothPath()} L${paddingHorizontal + (pointCount - 1) * stepX},${chartHeight} L${paddingHorizontal},${chartHeight} Z`}
            fill="url(#gradient)"
          />

          {/* Main line path */}
          <Path d={generateSmoothPath()} stroke="#3b82f6" strokeWidth="3" fill="none" />

          {/* Points */}
          {entries.map((entry, index) => {
            const x = paddingHorizontal + index * stepX;
            const y = scaleY(entry.weight);
            return (
              <Circle key={index} cx={x} cy={y} r="3" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" />
            );
          })}

          {/* Dates */}
          {entries.map((entry, index) => {
            const x = paddingHorizontal + index * stepX;
            return (
              <SvgText
                key={`label-${index}`}
                x={x}
                y={chartHeight + 23}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {entry.label}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Boutons de période (optionnel pour plus tard) */}
      <View style={styles.buttonsContainer}>
        {(['Weeks'] as Period[]).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[styles.button, selectedPeriod === period && styles.selectedButton]}
          >
            <Text style={[styles.buttonText, selectedPeriod === period && styles.selectedButtonText]}>
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
    elevation: 2,
    margin: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center'
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
    width: '90%'
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

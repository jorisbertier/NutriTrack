import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

type Goal = 'lose' | 'maintain' | 'gain';

const EditGoalScreen = () => {

    const {colors} = useTheme();

    const { t} = useTranslation();
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleSelect = (goal: Goal) => {
    setSelected(goal);
  };
    return (
        <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Goal</Text>

      <View style={styles.svgContainer}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          {/* Lose - Red */}
          <TouchableWithoutFeedback onPress={() => handleSelect('lose')}>
            <Path
              d="M150,150 L150,0 A150,150 0 0,1 18.37,75 Z"
              fill={selected === 'lose' ? '#c0392b' : '#e74c3c'}
            />
          </TouchableWithoutFeedback>

          {/* Maintain - Green */}
          <TouchableWithoutFeedback onPress={() => handleSelect('maintain')}>
            <Path
              d="M150,150 L18.37,75 A150,150 0 0,1 281.63,75 Z"
              fill={selected === 'maintain' ? '#27ae60' : '#2ecc71'}
            />
          </TouchableWithoutFeedback>

          {/* Gain - Blue */}
          <TouchableWithoutFeedback onPress={() => handleSelect('gain')}>
            <Path
              d="M150,150 L281.63,75 A150,150 0 0,1 150,0 Z"
              fill={selected === 'gain' ? '#2980b9' : '#3498db'}
            />
          </TouchableWithoutFeedback>
        </Svg>

        <View style={styles.centerCircle}>
          <Text style={styles.selectionText}>
            {selected ? selected.toUpperCase() : 'No selection'}
          </Text>
        </View>
      </View>
    </View>
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  svgContainer: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  centerCircle: {
    position: 'absolute',
    top: 90,
    left: 90,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#333',
  },
});


export default EditGoalScreen;

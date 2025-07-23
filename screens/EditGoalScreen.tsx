import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import ProgressBarSlider from '@/components/ProgressBar/ProgressBarSlider';

type Goal = 'lose' | 'maintain' | 'gain';

const EditGoalScreen = () => {

  const {colors} = useTheme();

  const [ calories, setCalories] = useState('');
  const [ proteins, setProteins] = useState('');
  const [ fats, setFats] = useState('');
  const [ carbs, setCarbs] = useState('');

  const { t} = useTranslation();
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleSelect = (goal: Goal) => {
    setSelected(goal);
  };
const numericCalories = parseInt(calories, 10);
  console.log("calories", calories)
    return (
        <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
          <ProgressBarSlider/>
      <View style={{width: '100%', marginTop: 50}}>
        <View style={{width: '30%', height: 80, borderRadius: 20, backgroundColor: 'green', display: 'flex', flexDirection: "column"}}>
          <View style={{flexDirection: 'row'}}>
            <View><Text>Logo</Text></View>
            <View><Text>Logo</Text></View>
          </View>
          <View><Text>-------</Text></View>
          <View></View>
        </View>
      </View>
          <Text>Calories</Text>
          <TextInput
            value={calories}
            onChangeText={(value) => setCalories(value)}
            placeholder="CAlories"
            placeholderTextColor={'grey'}
            keyboardType='numeric'
          ></TextInput>
          <Text>proetins</Text>
          <TextInput
            value={proteins}
            onChangeText={(value) => setProteins(value)}
            placeholder="Proteibns"
            placeholderTextColor={'grey'}
            keyboardType='numeric'
          ></TextInput>
          <Text>Carbs</Text>
          <TextInput
            value={carbs}
            onChangeText={(value) => setCarbs(value)}
            placeholder="carbs"
            placeholderTextColor={'grey'}
            keyboardType='numeric'
          />
          <Text>Fats</Text>
          <TextInput
            value={fats}
            onChangeText={(value) => setFats(value)}
            placeholder="Fats"
            placeholderTextColor={'grey'}
            keyboardType='numeric'
          ></TextInput>
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});


export default EditGoalScreen;

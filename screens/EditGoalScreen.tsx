import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import ProgressBarSlider from '@/components/ProgressBar/ProgressBarSlider';
import CustomSlider from '@/components/ProgressBar/ProgressBarSlider';
import CursorSlider from '@/components/ProgressBar/ProgressBarSlider';
import Slider from '@/components/ProgressBar/ProgressBarSlider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
// +10 à +50 g max en surplus (prise de muscle)

// Pour une personne sportive : 1,6 à 2,2 g/kg de poids corporel (ne pas dépasser 2,5 g/kg)

// 2. Glucides :

// +30 à +100 g max, selon l'activité physique

// Peut monter plus si entraînement intensif (sport d'endurance)

// 3. Lipides :

// +10 à +30 g max

// Toujours garder au moins 0,8 g/kg de poids corporel

// Ne pas dépasser 1,2 g/kg en surplus


  console.log("calories", calories)
    return (
        <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
          <GestureHandlerRootView>
          <Slider/>

          </GestureHandlerRootView>
      <View style={{justifyContent: 'space-between', flexDirection: 'row', width: '90%', flexWrap: "wrap"}}>
        <View style={{width: '30%', height: 100, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.gray, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: "column"}}>
          <View><TextInput style={{fontWeight: 600, fontSize:18, color: colors.black}} value={'120'}/></View>
          <View><Text style={{fontSize: 12}}>Proteins</Text></View>
        </View>
        <View style={{width: '30%', height: 100, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.gray, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: "column"}}>
          <View><TextInput value={'120'}/></View>
          <View><Text>carbs</Text></View>
        </View>
        <View style={{width: '30%', height: 100, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.gray, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: "column"}}>
          <View><TextInput value={'120g'}/></View>
          <View><Text>Fats</Text></View>
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

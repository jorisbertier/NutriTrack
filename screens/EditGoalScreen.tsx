import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import ProgressBarSlider from '@/components/ProgressBar/Slider';
import CustomSlider from '@/components/ProgressBar/Slider';
import CursorSlider from '@/components/ProgressBar/Slider';
import Slider from '@/components/ProgressBar/Slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '@/components/button/CustomButton';

type Goal = 'lose' | 'maintain' | 'gain';

const EditGoalScreen = () => {

  const {colors} = useTheme();

  const [ calories, setCalories] = useState<number>(0);
  const [ proteins, setProteins] = useState<number>(0);
  const [ fats, setFats] = useState<number>(0);
  const [ carbs, setCarbs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('')

  const { t} = useTranslation();
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleSelect = (goal: Goal) => {
    setSelected(goal);
  };
// const numericCalories = parseInt(calories, 10);
// +10 à +50 g max en surplus (prise de muscle)

// Pour une personne sportive : 1,6 à 2,2 g/kg de poids corporel (ne pas dépasser 2,5 g/kg)

// 2. Glucides :

// +30 à +100 g max, selon l'activité physique

// Peut monter plus si entraînement intensif (sport d'endurance)

// 3. Lipides :

// +10 à +30 g max

// Toujours garder au moins 0,8 g/kg de poids corporel

// Ne pas dépasser 1,2 g/kg en surplus
    const handleEditGoal = () => {
      const proteinVal = parseFloat(proteins as any);
      const carbVal = parseFloat(carbs as any);
      const fatVal = parseFloat(fats as any);

      const isValidNumber = (val: number) => !isNaN(val) && val > 0 && val <= 100;

      if (!isValidNumber(proteinVal) || !isValidNumber(carbVal) || !isValidNumber(fatVal)) {
        setErrorMessage(t('errorEditGoal'))
        return;
      }
      setErrorMessage('')
      setProteins(proteinVal);
      setCarbs(carbVal);
      setFats(fatVal);

      console.log('calories', calories);
      console.log('proteins', proteinVal);
      console.log('carbs', carbVal);
      console.log('fats', fatVal);
      console.log('data sent');
    };

    return (
          <GestureHandlerRootView>
            <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
              <Slider onValueChange={(val) => setCalories(val * 5)}/>

              <View style={{height: 120,elevation: 1, justifyContent: 'center', flexDirection: 'row',alignItems: 'center', width: '90%', backgroundColor: colors.gray, borderRadius: 30, marginTop: 20}}>
                <View style={{borderRightColor: colors.grayDark,borderRightWidth: 1,width: '30%', height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.black}}
                      value={proteins}
                      onChangeText={(value) => setProteins(value)}
                      placeholder="0"
                      placeholderTextColor={colors.black}
                      keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDark, fontWeight: 500}}>{t('proteins')}</Text></View>
                </View>
                <View style={{borderRightColor: colors.grayDark,borderRightWidth: 1,width: '30%', height: 80, backgroundColor: colors.gray, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.black}}
                      value={carbs}
                      onChangeText={(value) => setCarbs(value)}
                      placeholder="0"
                      placeholderTextColor={colors.black}
                      keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDark, fontWeight: 500}}>{t('carbs')}</Text></View>
                </View>
                <View style={{width: '30%', height: 80, backgroundColor: colors.gray, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.black}}
                  value={fats}
                  onChangeText={(value) => setFats(value)}
                  placeholder="0"
                  placeholderTextColor={colors.black}
                  keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDark, fontWeight: 500}}>{t('fats')}</Text></View>
                </View>
              </View>
              <Text style={{textAlign: 'center', width: '90%', marginVertical: 10}}>* {t('informEdit')}</Text>
              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            <CustomButton titleButton={t('editGoal')} handlePersistData={handleEditGoal}/>
            </View>
        </GestureHandlerRootView>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorMessage: {
    color: "red",
    textAlign: 'center',
    width: '90%'
  }
});


export default EditGoalScreen;

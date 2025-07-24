import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Slider from '@/components/ProgressBar/Slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '@/components/button/CustomButton';
import GoalToggle from '@/components/GoalToggle';

type Goal = 'lose' | 'maintain' | 'gain';

const EditGoalScreen = () => {

  const {colors} = useTheme();

  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser?.uid;


  const [ calories, setCalories] = useState<number>(0);
const [proteins, setProteins] = useState<string>('');
const [carbs, setCarbs] = useState<string>('');
const [fats, setFats] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const { t} = useTranslation();

const handleEditGoal = async () => {
  if (!uid || !selectedGoal) {
    Alert.alert("Erreur", "Utilisateur ou objectif non défini.");
    return;
  }

  const userRef = doc(db, 'User', uid);

  // Cas objectif = maintenir → tout à 0
  if (selectedGoal === "maintain") {
    try {
      await updateDoc(userRef, {
        goal: selectedGoal,
        goalLogs: { calories: 0, proteins: 0, carbs: 0, fats: 0 }
      });
      Alert.alert("Succès", "Objectif mis à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour l'objectif.");
    }
    return;
  }

  // Sinon, valider macros :
  const proteinVal = Number(proteins);
  const carbVal = Number(carbs);
  const fatVal = Number(fats);

  const isValidNumber = (val: number) => !isNaN(val) && val >= 0 && val <= 100;

  if (
    proteins.trim() === '' ||
    carbs.trim() === '' ||
    fats.trim() === '' ||
    !isValidNumber(proteinVal) ||
    !isValidNumber(carbVal) ||
    !isValidNumber(fatVal)
  ) {
    setErrorMessage(t('errorEditGoal'));
    return;
  }

  setErrorMessage('');

  try {
    await updateDoc(userRef, {
      goal: selectedGoal,
      goalLogs: {
        calories,
        proteins: proteinVal,
        carbs: carbVal,
        fats: fatVal
      }
    });

    Alert.alert("Succès", "Objectif mis à jour !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    Alert.alert("Erreur", "Impossible de mettre à jour l'objectif.");
  }
};

  return (
        <GestureHandlerRootView>
          <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
          <GoalToggle selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
{!selectedGoal || selectedGoal !== "maintain" && (
  <>
            <Slider onValueChange={(val) => setCalories(val * 5)}/>

            <View style={{height: 120,elevation: 1, justifyContent: 'center', flexDirection: 'row',alignItems: 'center', width: '90%', backgroundColor: colors.gray, borderRadius: 30, marginTop: 20}}>
              <View style={{borderRightColor: colors.grayDark,borderRightWidth: 1,width: '30%', height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                <View>
                  <TextInput style={{fontWeight: 600, fontSize:18, color: colors.black}}
                    value={proteins} 
                    onChangeText={setProteins}
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
                    onChangeText={setCarbs}
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
                onChangeText={setFats}
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
            </>)}
            {selectedGoal && (
              <CustomButton titleButton={t('editGoal')} handlePersistData={handleEditGoal}/>
            )}
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

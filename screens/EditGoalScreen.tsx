import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Slider from '@/components/ProgressBar/Slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '@/components/button/CustomButton';
import GoalToggle from '@/components/GoalToggle';
import AnimatedToast from '@/components/AnimatedToastProps';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '@/redux/userSlice';

type Goal = 'lose' | 'maintain' | 'gain';

const EditGoalScreen = () => {

  const {colors} = useTheme();

  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser?.uid;

  const dispatch = useDispatch();

  const [ calories, setCalories] = useState<number>(0);
  const [proteins, setProteins] = useState<string>('0');
  const [carbs, setCarbs] = useState<string>('0');
  const [fats, setFats] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigation = useNavigation();

  const { t } = useTranslation();

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
  };

  const handleEditGoal = async () => {
    if (!uid || !selectedGoal) {
      showFeedback('error', t('unauthenticated_or_not_defined'));
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
          showFeedback('success', t('updated'));
          //@ts-ignore
          dispatch(fetchUserData(auth.currentUser?.email));
          setTimeout(() => navigation.goBack(), 1000);
      } catch (error) {
        console.error("Error durantly update edit goal :", error);
        showFeedback('error', t('update_error'));
      }
      return;
    }

    // Sinon, valider macros :
    const proteinVal = Number(proteins || 0);
    const carbVal = Number(carbs || 0);
    const fatVal = Number(fats || 0);

    const isValidNumber = (val: number) => !isNaN(val) && val >= 0 && val <= 100;

    if (
      proteins.trim() === '' ||
      carbs.trim() === '' ||
      fats.trim() === '' ||
      !isValidNumber(proteinVal) ||
      !isValidNumber(carbVal) ||
      !isValidNumber(fatVal)
    ) {
      setErrorMessage(t('errorEditgoal'));
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
      showFeedback('success', t('updated'));
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      showFeedback('error', t('update_error'));
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
                <View style={{borderRightColor: colors.grayDarkFix ,borderRightWidth: 1,width: '30%', height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.blackFix}}
                      value={proteins} 
                      onChangeText={setProteins}
                      placeholder="0"
                      placeholderTextColor={colors.blackFix}
                      keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDarkFix, fontWeight: 500}}>{t('proteins')}</Text></View>
                </View>
                <View style={{borderRightColor: colors.grayDarkFix ,borderRightWidth: 1,width: '30%', height: 80, backgroundColor: colors.gray, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.blackFix}}
                      value={carbs}
                      onChangeText={setCarbs}
                      placeholder="0"
                      placeholderTextColor={colors.blackFix}
                      keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDarkFix, fontWeight: 500}}>{t('carbs')}</Text></View>
                </View>
                <View style={{width: '30%', height: 80, backgroundColor: colors.gray, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                  <View>
                    <TextInput style={{fontWeight: 600, fontSize:18, color: colors.blackFix}}
                      value={fats}
                      onChangeText={setFats}
                      placeholder="0"
                      placeholderTextColor={colors.blackFix}
                      keyboardType='numeric'
                    />
                  </View>
                  <View><Text style={{fontSize: 14, color: colors.grayDarkFix, fontWeight: 500}}>{t('fats')}</Text></View>
                </View>
              </View>
              <Text style={{textAlign: 'center', width: '90%', marginVertical: 10, color: colors.black}}>* {t('informEdit')}</Text>
              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            </>
          )}
          {selectedGoal === "maintain" &&
            <Text style={{textAlign: 'center', width: '90%', color: colors.black}}>* {t('textEditMaintain')}</Text>
          }
          {selectedGoal && (
            <CustomButton titleButton={t('editGoal')} handlePersistData={handleEditGoal}/>
          )}
        </View>
            {feedback && (
                <AnimatedToast
                    message={feedback.message}
                    type={feedback.type}
                    onHide={() => setFeedback(null)}
                    height={100}
                />
            )}
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

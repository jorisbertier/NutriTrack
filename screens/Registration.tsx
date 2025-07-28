import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/ThemeProvider';
import { firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import CredentialsStep from './Registration/CredentialsStep';
import PersonalInfoStep from './Registration/PersonalInfoStep';
import BodyInfoStep from './Registration/BodyInfosStep';
import PreferencesStep from './Registration/PreferencesStep';
import StepProgressBar from './Registration/ProgressBarStep';
import { Image } from 'react-native';
import AvatarStep from './Registration/AvatarStep';
import SuccessStep from './Registration/SuccessStep';
import GoalStep from './Registration/GoalStep';
import { current } from '@reduxjs/toolkit';
import { getTodayDate } from '@/functions/function';
import { useTranslation } from 'react-i18next';

const Registration = () => {

  const { colors } = useTheme();
  const  { t } = useTranslation();
  const Auth = getAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Credentials', 'Personal', 'Body', 'Preferences', 'Goal', 'Avatar', 'Success'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [goal, setGoal] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateOfBirthFormatted, setDateOfBirthFormatted] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [activityLevel, setActivityLevel] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [isDateSelected, setIsDateSelected] = useState(false);
  const date = getTodayDate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [firstnameError, setFirstnameError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [profileImageError, setProfileImageError] = useState('');
  const [goalError, setGoalError] = useState('');

  const avatars = [
    { id: 1, uri: require('@/assets/images/avatar/pinguin.png') },
    { id: 2, uri: require('@/assets/images/avatar/bubble.png') },
    { id: 3, uri: require('@/assets/images/avatar/watermelon.png') },
    { id: 4, uri: require('@/assets/images/avatar/avatar.png') },
    { id: 5, uri: require('@/assets/images/avatar/banana.webp') },
  ];

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(new Date().getFullYear() - 5);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
    setIsDateSelected(true);

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    setDateOfBirthFormatted(`${day}/${month}/${year}`);
  };

  const validateStep = async () => {
    let isValid = true;
    if (currentStep === 0) {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailError(t('error_email'));
        isValid = false;
      } else {
        try {
          const methods = await fetchSignInMethodsForEmail(Auth, email);
          if (methods.length > 0) {
            setEmailError(t('error_email2'));
            isValid = false;
          } else {
            setEmailError('');
          }
        } catch (error) {
          setEmailError(t('error_email3'));
          isValid = false;
        }
      }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!password || password.length < 6) {
            setPasswordError(t('passwordError2'));
            isValid = false;
        }
        else if(!passwordRegex.test(password)) {
            setPasswordError(t("passwordError3"));
            isValid = false;
        }
        else {
            setPasswordError('');
        }
    }
        

    if (currentStep === 1) {
        if (!name.trim()) {
            setNameError(t('error_name_required'));
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            setNameError(t('error_name_invalid'));
            isValid = false;
        } else if(name.length > 15) {
            setNameError(t('error_name_length'));
            isValid = false;
        }
        else {
            setNameError('');
        }
        
        if (!firstname.trim()) {
            setFirstnameError(t('error_firstname_required'));
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(firstname)) {
            setFirstnameError(t('error_firstname_invalid'));
            isValid = false;
        }else if(firstname.length > 15) {
            setNameError(t('error_firstname_length'));
            isValid = false;
        }
        else {
            setFirstnameError('');
        }
        if(!isDateSelected) {
            setDateOfBirthError(t('error_date_required'));
            isValid = false;
        }else {
            setDateOfBirthError('')
        }console.log(isDateSelected)
    }

    if (currentStep === 2) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      if (!w || isNaN(w) || w < 15 || w > 250) {
        setWeightError(t('error_weight_invalid'));
        isValid = false;
      } else setWeightError('');

      if (!h || isNaN(h) || h < 49 || h > 250) {
        setHeightError(t('error_height_invalid'));
        isValid = false;
      } else setHeightError('');
    }

    if (currentStep === 3) {
      if (!activityLevel) {
        setActivityError(t('error_activity_required'));
        isValid = false;
      } else setActivityError('');

      if (!gender) {
        setGenderError(t('error_gender_required'));
        isValid = false;
      } else setGenderError('');
    }

    if(currentStep === 4) {
      if (!profileImage) {
        setProfileImageError(t('error_avatar_required'));
        isValid = false;
      } else setProfileImageError('');
    }

    if (currentStep === 5) {
      if (!goal) {
        setGoalError(t('error_goal_required'));
        isValid = false;
      } else setGoalError('');
    }

    return isValid;
  };

  // const handleNext = () => {
  //   if (validateStep()) {
  //     if (currentStep < steps.length - 1) {
  //       setCurrentStep(currentStep + 1);
  //     } else {
  //       handleSubmit();
  //     }
  //   }
  // };
  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
};

  const handleSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'User', user.uid), {
        name,
        firstName: firstname,
        dateOfBirth: dateOfBirthFormatted,
        weight,
        height,
        email,
        activityLevel,
        profilPicture: profileImage,
        gender,
        xp: 0,
        level: 1,
        goal: goal,
        xpLogs: {},
        weightLog: [
          {
            date: `${date}`,
            weight: weight,
          }
        ],
        goalLogs : {
            calories: 0,
            proteins: 0,
            fats: 0,
            carbs: 0
        },
        consumeByDays: {},
        proteinsTotal: {},
        carbsTotal: {},
        fatsTotal: {},
      });
      // setCurrentStep(5);
    } catch (err) {
      console.log('Error', err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.whiteMode }]}>
      <View>
        <StepProgressBar steps={steps} currentStep={currentStep} colors={colors} />

        {currentStep === 0 && (
            <CredentialsStep {...{ email, setEmail, password, setPassword, emailError, passwordError }} />
        )}
        {currentStep === 1 && (
          <PersonalInfoStep {...{
            name,
            setName,
            firstname,
            setFirstname,
            dateOfBirthFormatted,
            showDatePicker,
            setShowDatePicker,
            onChangeDate,
            nameError,
            firstnameError,
            dateOfBirthError ,
            dateOfBirth,
            // DateTimePicker,
            fiveYearsAgo,
          }} />
        )}
        {currentStep === 2 && (
          <BodyInfoStep {...{ weight, setWeight, height, setHeight, weightError, heightError }} />
        )}
        {currentStep === 3 && (
          <PreferencesStep {...{
            activityLevel,
            setActivityLevel,
            activityError,
            gender,
            setGender,
            genderError,
          }} />
        )}
        {currentStep === 4  && (
          <AvatarStep {...{ profileImage, setProfileImage, profileImageError, avatars }}/>
        )}
        {currentStep === 5  && (
          <GoalStep {...{ goal, setGoal, goalError }}/>
        )}
        {currentStep === 6  && (
          <SuccessStep/>
        )}
      </View>
      {currentStep !== 6 ? (
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={{ color: 'white', fontSize: 18 }}>
          <Image source={require('@/assets/images/arrow-right.png')} style={{ alignSelf: 'center', height: 18, width: 18 }} />
        </Text>
      </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.button}>Accéder à votre tableau de bord</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    nextButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: 'black',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
      marginTop: 30,
      backgroundColor: 'black',
      color: 'white',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      fontSize: 16,
      textAlign: 'center',
    },
});

export default Registration;

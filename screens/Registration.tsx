import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/ThemeProvider';
import { firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
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

const Registration = () => {
  const { colors } = useTheme();
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

  const validateStep = () => {
    let isValid = true;
    if (currentStep === 0) {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email.');
            isValid = false;
        } else setEmailError('');

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!password || password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            isValid = false;
        }
        else if(!passwordRegex.test(password)) {
            setPasswordError("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
            isValid = false;
        }
        else {
            setPasswordError('');
        }
    }
        

    if (currentStep === 1) {
        if (!name.trim()) {
            setNameError('Name is required.');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            setNameError('Name must contain only letters.');
            isValid = false;
        } else if(name.length > 15) {
            setNameError('Name must contain 15 caracters maximum.');
            isValid = false;
        }
        else {
            setNameError('');
        }
        
        if (!firstname.trim()) {
            setFirstnameError('First name is required.');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(firstname)) {
            setFirstnameError('First name must contain only letters.');
            isValid = false;
        }else if(firstname.length > 15) {
            setNameError('First name must contain 15 caracters maximum.');
            isValid = false;
        }
        else {
            setFirstnameError('');
        }
        if(!isDateSelected) {
            setDateOfBirthError(`Please select a date of birth`);
            isValid = false;
        }else {
            setDateOfBirthError('')
        }console.log(isDateSelected)
    }

    if (currentStep === 2) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      if (!w || isNaN(w) || w < 15 || w > 250) {
        setWeightError('Weight must be between 15 and 250kg');
        isValid = false;
      } else setWeightError('');

      if (!h || isNaN(h) || h < 50 || h > 250) {
        setHeightError('Height must be between 50 and 250cm');
        isValid = false;
      } else setHeightError('');
    }

    if (currentStep === 3) {
      if (!activityLevel) {
        setActivityError('Please select an activity level.');
        isValid = false;
      } else setActivityError('');

      if (!gender) {
        setGenderError('Please select a gender.');
        isValid = false;
      } else setGenderError('');
    }

    if(currentStep === 4) {
      if (!profileImage) {
        setProfileImageError('Please select an avatar.');
        isValid = false;
      } else setProfileImageError('');
    }

    if (currentStep === 5) {
      if (!goal) {
        setGoalError('Please select a goal.');
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
  const handleNext = () => {
  if (validateStep()) {
    // if (currentStep === 6) {
    //   handleSubmit(); // On crée le compte ici
    // } else {
      setCurrentStep(currentStep + 1);
    // }
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
        consumeByDays: {},
        proteinsTotal: {},
        carbsTotal: {},
        fatsTotal: {},
      });
      // Alert.alert('Success', 'Account created successfully!');
      // setCurrentStep(5);
    } catch (err) {
      Alert.alert('Error', err.message);
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

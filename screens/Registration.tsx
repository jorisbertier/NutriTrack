import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { useTheme } from '@/hooks/ThemeProvider';
import * as FileSystem from 'expo-file-system';

const cloudName = 'dawgdxmbo';  // Remplacez par le nom de votre cloud
const uploadPreset = 'ml_default';  // Remplacez par le nom de votre preset d'upload
const apiKey = '475469985882125';  // Remplacez par votre API Key
const apiSecret = 'w4onDPi_w5C8nwTC7NG5zMzT_bM';  
const Registration = () => {

    const Auth = getAuth();
    const {colors} = useTheme();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [dateOfBirthFormatted, setDateOfBirthFormatted] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    // const [profilPicture, setProfilPicture] = useState(null);
    const [gender, setGender] = useState('');
    const storage = getStorage();  
    
    /**ERROR MESSAGE */
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [heightError, setHeightError] = useState('');
    const [activityError, setActivityError] = useState('');
    const [genderError, setGenderError] = useState('');
    /**ERROR MESSAGE */

    // const [profileImage, setProfileImage] = useState(null);
    // const pickImage = async () => {
    //     // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     //     console.log(status)
    //     // if (status !== 'granted') {
    //     //     console.log("Camera permission status:", status);
    //     //     Alert.alert("Permission to access camera roll is required!");
    //     //     return;
    //     // }
    
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    
    //     if (!result.canceled && result.assets.length > 0) {
    //         setProfileImage(result.assets[0].uri);
    //     }
    // };
    // console.log('first', )

    // const uploadImageToFirebase = async (uri) => {
    //     try {
    //         const response = await fetch(uri);
    //         const blob = await response.blob();
    
    //         const imageRef = ref(storage, `images/${email}.jpg`);
    //         await uploadBytes(imageRef, blob);
    
    //         const downloadURL = await getDownloadURL(imageRef);
    //         console.log('Uploaded image URL:', downloadURL);
    //         return downloadURL;
    //     } catch (error) {
    //         console.error('Error uploading image:', error);
    //         throw error; // Throw the error so it can be handled in signUp
    //     }
    // };
    // const uploadImageToCloudinary = async (uri) => {
    //     try {
    //       const data = new FormData();
    //       data.append('file', {
    //         uri: uri,
    //         type: 'image/jpeg',
    //         name: 'image.jpg',
    //       });
    //       data.append('upload_preset', uploadPreset);
    //       data.append('cloud_name', cloudName); 
    //       data.append('api_key', apiKey);   
      
    //       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    //         method: 'POST',
    //         body: data,
    //       });
      
    //       const result = await response.json();
    //       console.log(result)
    //       if (result.secure_url) {
    //           return result.secure_url; // Retourne l'URL si l'upload est réussi
    //       } else {
    //           console.error('No secure URL returned from Cloudinary');
    //           return '';  // Retourne une chaîne vide si l'URL n'est pas présente
    //       }
    //   } catch (error) {
    //       console.error('Erreur lors de l\'upload de l\'image :', error);
    //       return '';  // Retourne une chaîne vide en cas d'erreur
    //   }
    //   };
    const validateFields = () => {
        let isValid = true;
    
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email.');
            isValid = false;
        } else {
            setEmailError('');
        }
    
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
    
        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            isValid = false;
        } else {
            setPasswordError('');
        }
    
        const weightNumber = parseFloat(weight);
        if (!weightNumber || isNaN(weightNumber) || weightNumber > 500) {
            setWeightError('Please enter a valid weight in kilos. Max 500 kg');
            isValid = false;
        } else {
            setWeightError('');
        }
    
        const heightNumber = parseFloat(height);
        if (!heightNumber || isNaN(heightNumber) || heightNumber > 300) {
            setHeightError('Please enter in centimeters a valid height. Max 300 cm');
            isValid = false;
        } else {
            setHeightError('');
        }
    
        if (!activityLevel) {
            setActivityError('Please select an activity level.');
            isValid = false;
        } else {
            setActivityError('');
        }

        if (!gender) {
            setGenderError('Please select an gender.');
            isValid = false;
        } else {
            setGenderError('');
        }
    
        return isValid;
    };
    
    
    
    const signUp = async () => {

        if(!validateFields()) {
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
            const user = userCredential.user;

            const weightNumber = parseFloat(weight);
            const heightNumber = parseFloat(height);
            // console.log(storage)
            // console.log(profileImage)

            // let imageUrl = '';
            // if (profileImage) {
            //     imageUrl = await uploadImageToFirebase(profileImage);
            // }
            // let imageUrl = '';
            // if (profileImage) {
            //     imageUrl = await uploadImageToCloudinary(profileImage); // Télécharge l'image et récupère l'URL
            // }
            // console.log(imageUrl)
            if (isNaN(weightNumber) || isNaN(heightNumber)) {
                Alert.alert('Error', 'Please enter valid numerical values for weight and height.');
                return;
            }

            await setDoc(doc(firestore, 'User', user.uid), {
                name: name,
                firstName: firstname,
                dateOfBirth: dateOfBirthFormatted,
                weight: weight,
                height: height,
                email: user.email,
                activityLevel: activityLevel,
                profilPicture: '',
                gender: gender
            });
            Alert.alert('Registration successful!');
            // resetForm();
        } catch (error: any) {
            Alert.alert('Registration Error', error.message);
        }
    };

    const resetForm = () => {
        setName('');
        setFirstname('');
        // setDateOfBirth('');
        setEmail('');
        setWeight('');
        setHeight('');
        setPassword('');
        setActivityLevel('');
        setProfilPicture('');
        setGender('');
    };
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);

        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        setDateOfBirthFormatted(`${day}/${month}/${year}`);
    };
    // console.log(profileImage)

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.whiteMode}]}>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                autoCapitalize='words'
            />
             {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="First Name"
                autoCapitalize='words'
            />
            {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateInput, {backgroundColor: colors.grayPress}]}>{dateOfBirthFormatted || 'Select a date of birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={fiveYearsAgo}
                />
            )}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Select your activity Level</Text>
            <Picker
                selectedValue={activityLevel}
                style={[styles.picker, { backgroundColor : colors.grayPress}]}
                onValueChange={(itemValue) => setActivityLevel(itemValue)}
            >
                <Picker.Item label="Sedentary" value="sedentary" />
                <Picker.Item label="Low Active" value="lowactive" />
                <Picker.Item label="Moderate" value="moderate" />
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Super Active" value="superactive" />
            </Picker>
            {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}
            {/* <TextInput
                placeholder="Profile Picture URL"
                style={styles.input}
                value={profilPicture}
                onChangeText={setProfilPicture}
            /> */}
            {/* <View>
                <TouchableOpacity onPress={pickImage}>
                    <Text style={[styles.imagePicker, { color: colors.blackFix}]}>{profileImage ? 'Image Selected' : 'Select Profile Picture'}</Text>
                    {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
                </TouchableOpacity>
            </View> */}
        
            <View style={styles.genderContainer}>
                <TouchableOpacity
                    style={[styles.genderButton, gender === 'male' && styles.selectedButton]}
                    onPress={() => setGender('male')}
                >
                    <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.genderButton, gender === 'female' && styles.selectedButton]}
                    onPress={() => setGender('female')}
                >
                    <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
            </View>
            {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            {/* <Button title="Register" color={colors.blackFix} onPress={signUp} /> */}
            <TouchableOpacity
                onPress={signUp}
                style={{
                backgroundColor: colors.black,
                padding: 10,
                marginBottom: 15,
                borderRadius: 3,
                alignItems: 'center',
                }}
            >
                <Text style={{ color: colors.white }}>Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    label: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
        borderColor: 'gray',
        borderWidth: 1,
    },
    dateInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 10,
        textAlign: 'center',
        lineHeight: 50,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    genderButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 4,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
    },
    selectedButton: {
        backgroundColor: '#8592F2',
    },
    genderText: {
        color: '#000',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
    imagePicker: {
        color: '#007BFF',
        marginBottom: 12,
        textAlign: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginBottom: 8
    },
});

export default Registration;

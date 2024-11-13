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
    const [email, setEmail] = useState('test5@gmail.com');
    const [name, setName] = useState('test');
    const [firstname, setFirstname] = useState('test');
    const [password, setPassword] = useState('rootroot');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [dateOfBirthFormatted, setDateOfBirthFormatted] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [weight, setWeight] = useState('60');
    const [height, setHeight] = useState('180');
    const [activityLevel, setActivityLevel] = useState('active');
    // const [profilPicture, setProfilPicture] = useState(null);
    const [gender, setGender] = useState('male');
    const storage = getStorage();  
    

    const [profileImage, setProfileImage] = useState(null);
    const pickImage = async () => {
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //     console.log(status)
        // if (status !== 'granted') {
        //     console.log("Camera permission status:", status);
        //     Alert.alert("Permission to access camera roll is required!");
        //     return;
        // }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri);
        }
    };
    console.log('first', )

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
    const uploadImageToCloudinary = async (uri) => {
        try {
          const data = new FormData();
          data.append('file', {
            uri: uri,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
          data.append('upload_preset', uploadPreset);
          data.append('cloud_name', cloudName); 
          data.append('api_key', apiKey);   
      
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: data,
          });
      
          const result = await response.json();
          console.log(result)
          if (result.secure_url) {
              return result.secure_url; // Retourne l'URL si l'upload est réussi
          } else {
              console.error('No secure URL returned from Cloudinary');
              return '';  // Retourne une chaîne vide si l'URL n'est pas présente
          }
      } catch (error) {
          console.error('Erreur lors de l\'upload de l\'image :', error);
          return '';  // Retourne une chaîne vide en cas d'erreur
      }
      };
    
    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
            const user = userCredential.user;

            const weightNumber = parseFloat(weight);
            const heightNumber = parseFloat(height);
            // console.log(storage)
            console.log(profileImage)

            // let imageUrl = '';
            // if (profileImage) {
            //     imageUrl = await uploadImageToFirebase(profileImage);
            // }
            let imageUrl = '';
            if (profileImage) {
                imageUrl = await uploadImageToCloudinary(profileImage); // Télécharge l'image et récupère l'URL
            }
            console.log(imageUrl)
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

    // const resetForm = () => {
    //     setName('');
    //     setFirstname('');
    //     // setDateOfBirth('');
    //     setEmail('');
    //     setWeight('');
    //     setHeight('');
    //     setPassword('');
    //     setActivityLevel('');
    //     setProfilPicture('');
    //     setGender('');
    // };

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
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={name}
                onChangeText={setName}
                placeholder="Name"
            />
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="First Name"
            />
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateInput, {backgroundColor: colors.grayPress}]}>{dateOfBirthFormatted || 'Select a date of birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
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
            {/* <TextInput
                placeholder="Profile Picture URL"
                style={styles.input}
                value={profilPicture}
                onChangeText={setProfilPicture}
            /> */}
            <View>
            <TouchableOpacity onPress={pickImage}>
                <Text style={[styles.imagePicker, { color: colors.blackFix}]}>{profileImage ? 'Image Selected' : 'Select Profile Picture'}</Text>
                {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
            </TouchableOpacity>
        </View>
        <View></View>
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
});

export default Registration;

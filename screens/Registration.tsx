import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/hooks/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';

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
    const [gender, setGender] = useState('');
    const [profileImage, setProfileImage] = useState<number | null>(null);
    
    /**ERROR MESSAGE */
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [heightError, setHeightError] = useState('');
    const [activityError, setActivityError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [profileImageError, setProfileImageError] = useState('');
    /**ERROR MESSAGE */

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
    
        const weightNumber = parseFloat(weight);
        if (!weightNumber || isNaN(weightNumber) || weightNumber > 250 || weightNumber < 15) {
            setWeightError('Please enter a valid weight in kilos.Min 15 Max 250 kg');
            isValid = false;
        } else { 
            setWeightError('');
        }
    
        const heightNumber = parseFloat(height);
        if (!heightNumber || isNaN(heightNumber) || heightNumber > 250 || heightNumber < 50) {
            setHeightError('Please enter in centimeters a valid height. Min 50 Max 250 cm');
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

        if(profileImage === null) {
            setProfileImageError('Please select an avatar.');
            isValid = false;
        } else {
            setActivityError('')
        }

        if (!gender) {
            setGenderError('Please select an gender.');
            isValid = false;
        } else {
            setGenderError('');
        }
    
        return isValid;
    };
    
    const avatars = [
        { id: 1, uri: require('@/assets/images/avatar/pinguin.png') },
        { id: 2, uri: require('@/assets/images/avatar/bubble.png') },
        { id: 3, uri: require('@/assets/images/avatar/watermelon.png') },
        { id: 4, uri: require('@/assets/images/avatar/avatar.png') },
        { id: 5, uri: require('@/assets/images/avatar/banana.webp') },
    ];
    
    const handleSelectAvatar = (id: number) => {
        setProfileImage(id);
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
                profilPicture: profileImage,
                gender: gender,
                xp: 0,
                level: 1
            });
            Alert.alert('Registration successful!');
            resetForm();
        } catch (error: any) {
            Alert.alert('Registration Error', error.message);
        }
    };

    const resetForm = () => {
        setName('');
        setFirstname('');
        setDateOfBirth(new Date());
        setEmail('');
        setWeight('');
        setHeight('');
        setPassword('');
        setActivityLevel('');
        setProfileImage(0);
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

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.whiteMode}]}>
            <Text style={[styles.label, {color : colors.black}]}>Email -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Name -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                autoCapitalize='words'
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Firstname -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="First Name"
                autoCapitalize='words'
            />
            {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Password -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Date of birth -</Text>
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
            <ThemedText style={[{color : colors.black, marginBottom: 10}]}>* Registration reserved for those over 5 years old</ThemedText>
            <Text style={[styles.label, {color : colors.black}]}>Weight -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Height -</Text>
            <TextInput
                style={[styles.input, { backgroundColor : colors.grayPress}]}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Select your activity level -</Text>
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
            <Text style={[styles.label, {color : colors.black}]}>Select an avatar -</Text>
            <FlatList
                data={avatars}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={styles.avatarList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={[
                        styles.avatarContainer,
                        profileImage === item.id && {borderColor: colors.black},
                    ]}
                    onPress={() => handleSelectAvatar(item.id)}
                    >
                    <Image source={item.uri} style={styles.avatarImage} />
                    </TouchableOpacity>
                )}
            />
            {profileImageError ? <Text style={styles.errorText}>{profileImageError}</Text> : null}
            <Text style={[styles.label, {color : colors.black}]}>Select your gender -</Text>
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
                marginBottom: 50,
                borderRadius: 3,
                alignItems: 'center',
                }}
            >
                <Text style={{ color: colors.white}}>Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginTop: 5,
        marginBottom: 20
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginBottom: 8
    },
    avatarList: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    avatarContainer: {
        marginHorizontal: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
});

export default Registration;

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const Registration = () => {
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
    const [profilPicture, setProfilPicture] = useState('');
    const [gender, setGender] = useState('')

    const signUp = async () => {
        try {
        // Créer un utilisateur avec email et mot de passe
        const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
        const user = userCredential.user;

        const weightNumber = parseFloat(weight);
        const heightNumber = parseFloat(height);

        // Verify is Number
        if (isNaN(weightNumber) || isNaN(heightNumber)) {
            Alert.alert('Erreur', 'Veuillez entrer des valeurs numériques valides pour le poids et la taille.');
            return;
        }

        // Créer un document utilisateur dans Firestore avec les informations supplémentaires
        await setDoc(doc(firestore, 'User', user.uid), {
            name: name,
            firstName: firstname,
            dateOfBirth: dateOfBirthFormatted,
            weight: weight,
            height: height,
            email: user.email,
            activityLevel: activityLevel,
            profilPicture: profilPicture,
            gender: gender
        });
        Alert.alert('Inscription réussie!');
        resetForm()
        } catch (error) {
        Alert.alert('Erreur d\'inscription', error.message);
        }
    };

    const resetForm = () => {
        setName('');
        setFirstname('');
        setDateOfBirth('');
        setEmail('');
        setWeight('');
        setHeight('');
        setPassword('');
        setActivityLevel('');
        setProfilPicture('');
        setGender('');
    };
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
        
        // Formater la date en DD/MM/YYYY
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11
        const year = currentDate.getFullYear();
        setDateOfBirthFormatted(`${day}/${month}/${year}`);
    };

  return (
    <View style={styles.container}>
        <Text>Page Inscription</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
        />
        <TextInput
            style={styles.input}
            value={firstname}
            onChangeText={setFirstname}
            placeholder="firstName"
        />
        <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        {/* <TextInput
            style={styles.input}
            placeholder="Date de naissance (JJ/MM/AAAA)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
        /> */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateInput}>{dateOfBirthFormatted || 'Sélectionner une date'}</Text>
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
            style={styles.input}
            placeholder="Poids (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Taille (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
        />
        <TextInput
        placeholder="Activity level"
            style={styles.input}
            value={activityLevel}
            onChangeText={setActivityLevel}
        />
        
        <TextInput
            placeholder="Profil picture"
            style={styles.input}
            value={profilPicture}
            onChangeText={setProfilPicture}
        />
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
        <Button title="S'inscrire" onPress={signUp} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    dateLabel: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    dateInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderLabel: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 4,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#8592F2',
    },
    genderText: {
        color: '#000',
    },
});

export default Registration;

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { Auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [profilPicture, setProfilPicture] = useState('');

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
            dateOfBirth: dateOfBirth,
            weight: weight,
            height: height,
            email: user.email,
            activityLevel: activityLevel,
            profilPicture: profilPicture
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
        <TextInput
            style={styles.input}
            placeholder="Date de naissance (JJ/MM/AAAA)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
        />
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
});

export default Registration;

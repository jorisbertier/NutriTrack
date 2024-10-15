// AuthScreen.js
import { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      Alert.alert('Connexion réussie!');
      navigation.navigate('home');
    } catch (error) {
      Alert.alert('Erreur de connexion', error.message);
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(Auth, email, password);
      Alert.alert('Inscription réussie!');
    } catch (error) {
      Alert.alert('Erreur d\'inscription', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.wrapperButton}>
        <Button title="Se connecter" onPress={signIn} />
        {/* <Button title="S'inscrire" onPress={signUp} /> */}
        <Button title="Créer un compte" onPress={() => navigation.navigate('registration')} />
      </View>
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
  wrapperButton : {
    flexDirection: 'column',
    gap: 20
  }
});

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /User/{userId} {
//       allow read, write: if request.auth != null; // Autorise la lecture et l'écriture si l'utilisateur est authentifié
//     }
//   }
// }
export default AuthScreen;

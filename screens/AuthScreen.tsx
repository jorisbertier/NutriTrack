import { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';
import { Auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Row from '@/components/Row';
import { Path, Svg } from 'react-native-svg';

const AuthScreen = () => {
  const [email, setEmail] = useState('test2@gmail.com');
  const [password, setPassword] = useState('rootroot');
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
      <Row style={{justifyContent: 'center'}}>
        <Image source={require('@/assets/images/realmLogo.png')} style={styles.logo}/>
      </Row>
      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.wrapperButton}>
        <Button title="Se connecter" onPress={signIn} color="#8592F2" />
        {/* <Button title="Créer un compte" onPress={() => navigation.navigate('registration')} color="#2196F3" /> */}
      </View>
      <Text style={styles.footerText}>
        Vous n'avez pas de compte? <Text style={styles.link} onPress={() => navigation.navigate('registration')}>Inscrivez-vous ici</Text>
      </Text>
      <Svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><Path fill="#8592F2" fill-opacity="1" d="M0,224L48,197.3C96,171,192,117,288,96C384,75,480,85,576,106.7C672,128,768,160,864,149.3C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></Path></Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFF',
    position: 'relative'
  },
  logo : {
    height: 75,
    width: 75
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 8, // Coins arrondis
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', // Couleur de fond blanche pour les champs
  },
  wrapperButton: {
    marginVertical: 12,
    flexDirection: 'column',
    gap: 12,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  link: {
    color: '#8592F2', // Couleur du lien
    fontWeight: 'bold',
  },
  svg: {
    position: 'absolute', // Position absolue pour le SVG
    bottom: 0, // Positionnez-le en bas, par exemple
    left: 0, // Ou toute autre position souhaitée
    right: 0,
    height: 100, // Ajustez la hauteur selon vos besoins
  },
});
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /User/{userId} {
//       allow read, write: if request.auth != null; // Autorise la lecture et l'écriture si l'utilisateur est authentifié
//     }
//   }
// }
export default AuthScreen;

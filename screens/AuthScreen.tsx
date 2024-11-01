import { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';
import { Auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Row from '@/components/Row';
import { Path, Svg } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import useThemeColors from '@/hooks/useThemeColor';

const AuthScreen = () => {
  const [email, setEmail] = useState('test2@gmail.com');
  const [password, setPassword] = useState('rootroot');
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [errorMessage, setErrorMessage] = useState('');

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      setErrorMessage('')
      // Alert.alert('Connexion réussie!');
      navigation.navigate('home');
    } catch (error) {
      // Alert.alert('Erreur de connexion', error.message);
      setErrorMessage('Incorrect email or password. Please try again.');
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
      <Row style={{justifyContent: 'center', flexDirection: 'column', gap: 10, marginBottom: 50}}>
          <Image source={require('@/assets/images/realmLogo.png')} style={styles.logo}/>
        <ThemedText variant="title">SIGN IN</ThemedText>
        <ThemedText variant="subtitle" color={colors.grayDark}>Please enter your details.</ThemedText>
      </Row>
      <View style={styles.formContainer}>
        <Image source={require('@/assets/images/profil/user.png')} style={styles.logoForm} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      <View style={styles.underline} />
    </View>
    <View style={styles.formContainer}>
      <Image source={require('@/assets/images/profil/key.png')} style={styles.logoForm} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      <View style={styles.underline} />
    </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <View style={styles.wrapperButton}>
        <Button title="Login" onPress={signIn} color={colors.black}/>
        {/* <Button title="Créer un compte" onPress={() => navigation.navigate('registration')} color="#2196F3" /> */}
      </View>
      <Text style={styles.footerText}>
        Don't have an account? <Text style={[styles.link, {color: colors.primary}]} onPress={() => navigation.navigate('registration')}>Register here</Text>
      </Text>
      <Image source={require('@/assets/images/svg/wave.png')} style={styles.svg}/>
      {/* <Svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><Path fill="#8592F2" fill-opacity="1" d="M0,224L48,197.3C96,171,192,117,288,96C384,75,480,85,576,106.7C672,128,768,160,864,149.3C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></Path></Svg> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
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
    fontSize: 50,
    textAlign: 'center',
    color: '#0000',
    marginBottom: 24,
  },
  wrapperButton: {
    marginVertical: 12,
    flexDirection: 'column',
    gap: 12,
    width: '30%',
    alignSelf: 'center',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  link: {
    fontWeight: 'bold',
  },
  svg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 500,
    width: 'auto',
    maxWidth: 500,
    objectFit: 'fill',
    zIndex: -1
  },
  errorText: { 
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  formContainer: {
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoForm: {
    width: 24, 
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 16,
  },
  underline: {
    height: 2,
    backgroundColor: 'black',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default AuthScreen;

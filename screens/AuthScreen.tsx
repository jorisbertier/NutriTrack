import { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Row from '@/components/Row';
import { Path, Svg } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';
import { StatusBar } from 'expo-status-bar'; 
import { fetchUserData } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AuthScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {theme, colors} = useTheme();
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, isLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'home' }],
        });
      } else {
        setTimeout(() => {

          isLoading(false);
        }, 1700)
      }
    });
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   StatusBar.setBackgroundColor(theme === "light" ? "#000" : '#FFFF');
  //   StatusBar.setBarStyle(theme === "light" ? "light-content" : "dark-content");
  // }, [theme])

  const dispatch = useDispatch();
  const signIn = async () => {
    try {

      await signInWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;

      setErrorMessage('')
      dispatch(fetchUserData(currentUser.email));

      navigation.navigate('home');
    } catch (error) {
      setErrorMessage('Incorrect email or password. Please try again.');
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(Auth, email, password);
      Alert.alert('Inscription réussie!');
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message);
    }
  };

  const sentences = [
    t('sentence1'),
    t('sentence2'),
    t('sentence3'),
    t('sentence4'),
    t('sentence5'),
    t('sentence6'),
    t('sentence7'),
    t('sentence8'),
    t('sentence9'),
    t('sentence10'),
    t('sentence11'),
  ]

  const randomSentenceIndex = Math.floor(Math.random() * sentences.length);
    if (loading) {
      // Display a full-screen loading indicator while checking the authentication state
      return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.blueLight, gap: 40}]}>
          {theme === "light" ? <StatusBar style="dark" /> : <StatusBar style="light" /> }
          <Image source={require('@/assets/images/logo/nutritrackLogoWhitoutBg.png')} style={styles.logo}/>
          <ActivityIndicator size="large" color={colors.black} />
          <ThemedText style={{width: '90%', flexWrap: 'wrap', flexShrink: 1, textAlign: 'center'}} variant={"title1"} color={colors.black}>{sentences[randomSentenceIndex]}</ThemedText>
        </View>
      );
    }

  return (
    <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>
      {theme === "light" ? <StatusBar style="dark" /> : <StatusBar style="light" /> }
       {/* <StatusBar style="dark" /> */}
      {/* <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} backgroundColor={(theme === "light" ? "#ffff" : '#000')}/> */}
      <Row style={{justifyContent: 'center', flexDirection: 'column', gap: 10, marginBottom: 50}}>
          <Image source={require('@/assets/images/logo/nutritrackLogoWhitoutBg.png')} style={styles.logo}/>
        <ThemedText variant="title" color={colors.black}>SIGN IN</ThemedText>
        <ThemedText variant="subtitle" color={colors.grayDark}>Please enter your details.</ThemedText>
      </Row>
      <View style={styles.formContainer}>
        {theme === "light" ?
          <Image source={require('@/assets/images/profil/user.png')} style={styles.logoForm} />
        :
          <Image source={require('@/assets/images/profil/userWhite.png')} style={styles.logoForm} />
        }
        <TextInput
          style={[styles.input, { color: colors.black}]}
          placeholderTextColor={colors.black}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      <View style={[styles.underline, {backgroundColor: colors.black}]} />
    </View>
    <View style={styles.formContainer}>
      {theme === "light" ?
        <Image source={require('@/assets/images/profil/key.png')} style={styles.logoForm} />
      :
        <Image source={require('@/assets/images/profil/keyWhite.png')} style={styles.logoForm} />
      }
        <TextInput
          style={[styles.input, { color: colors.black}]}
          placeholderTextColor={colors.black}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      <View style={[styles.underline, {backgroundColor: colors.black}]} />
    </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <View style={styles.wrapperButton}>
        <TouchableOpacity
          onPress={signIn}
          style={{
            backgroundColor: colors.black,
            padding: 10,
            borderRadius: 3,
            alignItems: 'center',
          }}
        >
        <Text style={{ color: colors.white }}>Login</Text>
      </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Don't have an account? <Text style={[styles.link, {color: colors.primary}]} onPress={() => navigation.navigate('registration')}>Register here</Text>
      </Text>
      <Image source={require('@/assets/images/svg/wave2.png')} style={styles.svg}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
    zIndex: 3
  },
  logo : {
    height: 130,
    width: 130
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
    marginBottom: 24,
  },
  wrapperButton: {
    marginVertical: 12,
    flexDirection: 'column',
    gap: 12,
    width: '30%',
    alignSelf: 'center',
    zIndex: 3
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
    height: 180,
    width: 'auto',
    maxWidth: 500,
    objectFit: 'fill',
    zIndex: 1
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
    zIndex: 3
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
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;

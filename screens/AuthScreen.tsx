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
  const [showPassword, setShowPassword] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

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
      setErrorMessage(t('errorAuthscreen'));
    }
  };

  // const signUp = async () => {
  //   try {
  //     await createUserWithEmailAndPassword(Auth, email, password);
  //     Alert.alert('Inscription réussie!');
  //   } catch (error: any) {
  //     Alert.alert('Erreur d\'inscription', error.message);
  //   }
  // };

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
    <View style={[styles.container, { backgroundColor: colors.whiteMode }]}>
      {theme === "light" ? <StatusBar style="dark" /> : <StatusBar style="light" />}

      <View style={styles.header}>
        <Image source={require('@/assets/images/logo/nutritrackLogoWhitoutBg.png')} style={styles.logo} />
        <ThemedText variant="title" color={colors.black}>Nutri Track</ThemedText>
        <ThemedText variant="subtitle" color={colors.grayDark}>{t('textInformAuthscreen')}</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.wrapper}>
          <TextInput
            style={[styles.inputField, { color: colors.black, borderColor: isEmailFocused ? colors.black : colors.grayDark }]}
            placeholder={t('email')}
            placeholderTextColor={colors.grayDark}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
          <Image source={require('@/assets/images/profil/user.png')} style={[styles.logoForm, { tintColor: isEmailFocused ? colors.black : colors.grayDark}]} />
        </View>
        <View style={styles.wrapper}>
          <TextInput
            style={[styles.inputField, { flex: 1, color: colors.black, borderColor: isPasswordFocused ? colors.black : colors.grayDark }]}
            placeholder={t('password')}
            placeholderTextColor={colors.grayDark}
            secureTextEntry={showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
            <Image source={require('@/assets/images/profil/key.png')} style={[styles.logoForm, { tintColor: isPasswordFocused ? colors.black : colors.grayDark}]} />
          {showPassword ? (
            <TouchableOpacity style={styles.wrapperLogo} onPress={() => setShowPassword(false)}>
              <Image source={require('@/assets/images/eye-show.png')} style={[styles.logoPassword, { tintColor: isPasswordFocused ? colors.black : colors.grayDark}]} />

            </TouchableOpacity>
          ):  (
            <TouchableOpacity style={styles.wrapperLogo} onPress={() => setShowPassword(true)}>
              <Image source={require('@/assets/images/eye-off.png')} style={[styles.logoPassword, { tintColor: theme === "light" ? colors.grayDarkFix : colors.grayDarkFix}]} />
            </TouchableOpacity>
              
          )}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          onPress={signIn}
          style={[styles.signInButton, { backgroundColor: colors.black }]}
        >
          <Text style={styles.signInText}>{t('login')}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {t('textAuthscreen')}{' '}
          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => navigation.navigate('registration')}
          >
            {t('registerHere')}
          </Text>
        </Text>
        <Text style={{marginTop: 20, color: colors.black}} onPress={() => navigation.navigate('forgotpassword')}>{t('forgot')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 50,
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  logoForm : {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -17 }],
    width: 20,
    height: 20
  },
  wrapperLogo : {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -17 }],
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoPassword : {
    width: 20,
    height: 20
  },
  signInButton: {
    height: 50,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;

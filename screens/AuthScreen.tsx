import { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';
import { StatusBar } from 'expo-status-bar'; 
import { fetchUserData } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AuthScreen = () => {

  const [email, setEmail] = useState('');
  const [isLoginVisible, setIsLoginVisible] = useState(false);
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
        }, 1400)
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
          <Image source={require('@/assets/images/logo/logo2.png')} style={styles.logo}/>
          <ActivityIndicator size="large" color={colors.blackFix} />
          <Text style={{width: '90%',fontSize: 17, fontWeight: "bold", flexWrap: 'wrap', flexShrink: 1,height: 50, textAlign: 'center'}} variant={"title1"} color={colors.black}>{sentences[randomSentenceIndex]}</Text>
        </View>
      );
    }

  return (
    <View style={[styles.container, { backgroundColor: colors.blackFix }]}>
      {theme === "light" ? <StatusBar style="dark" /> : <StatusBar style="light" />}

      <View style={styles.header}>
        <Image source={require('@/assets/images/logo/logo2.png')} style={styles.logo} />
        <ThemedText variant="title" color={colors.whiteFix}>Nutri Track</ThemedText>
        <ThemedText variant="subtitle" color={colors.grayDark}>{t('textInformAuthscreen')}</ThemedText>
      </View>

      <View style={styles.form}>
          <View style={[
            styles.modernInputWrapper, 
            isEmailFocused && styles.inputFocused, 
            { backgroundColor: colors.whiteMode }
          ]}>
          <Image source={require('@/assets/images/profil/user.png')} style={[styles.modernIcon, { tintColor: isEmailFocused ? colors.primary : colors.grayDarkFix }]}  />
          <TextInput
            style={[styles.modernInput, { color: colors.blackFix, borderColor: isEmailFocused ? colors.blackBorder : colors.grayDarkBorder }]}
            placeholder={t('email')}
            placeholderTextColor={colors.grayDarkFix}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
        </View>
        <View style={[
          styles.modernInputWrapper, 
          isPasswordFocused && styles.inputFocused, 
          { backgroundColor: colors.whiteMode }
        ]}>
          {/* Icône de gauche (Clé) */}
          <Image 
            source={require('@/assets/images/profil/key.png')} 
            style={[styles.modernIcon, { tintColor: isPasswordFocused ? colors.primary : colors.grayDarkFix }]} 
          />

          {/* Champ de saisie */}
          <TextInput
            style={[styles.modernInput, { color: colors.blackFix }]}
            placeholder={t('password')}
            placeholderTextColor={colors.grayDarkFix}
            secureTextEntry={showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />

          {/* Icône de droite (Œil) */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source={showPassword 
                ? require('@/assets/images/eye-show.png') 
                : require('@/assets/images/eye-off.png')
              } 
              style={[styles.modernIcon, { tintColor: colors.grayDarkFix, opacity: 0.6 }]} 
            />
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          onPress={signIn}
          style={[styles.signInButton, { backgroundColor: colors.whiteFix }]}
        >
          <Text style={[styles.signInText, { color: colors.blackFix}]}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.whiteFix, marginTop: 10, height: 50, width: '100%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: colors.blackFix, borderRadius: 30, fontSize: 17, fontWeight: "600"}}>Commencer </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLoginVisible(true)}>
        <Text style={{color: colors.whiteFix, fontWeight: "500", fontSize: 17, marginTop: 15}}>
          J'ai déjà un compte
        </Text>
      </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.whiteFix}]}>
          {t('textAuthscreen')}{' '}
          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => navigation.navigate('registration')}
          >
            {t('registerHere')}
          </Text>
        </Text>
        <Text style={{marginTop: 20, color: colors.whiteFix}} onPress={() => navigation.navigate('forgotpassword')}>{t('forgot')}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginVisible}
        onRequestClose={() => setIsLoginVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheetContainer, { backgroundColor: colors.whiteMode }]}>
            
            <TouchableOpacity 
              style={styles.dragHandle} 
              onPress={() => setIsLoginVisible(false)} 
            />

            <ThemedText variant="title" color={colors.black} style={{ marginBottom: 20 }}>
              Connexion
            </ThemedText>

            <View style={styles.form}>
              
              <TouchableOpacity
                onPress={signIn}
                style={[styles.signInButton, { backgroundColor: colors.black }]}
              >
                <Text style={[styles.signInText, { color: colors.white}]}>{t('login')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={{ marginTop: 20 }} 
              onPress={() => setIsLoginVisible(false)}
            >
              <Text style={{ color: colors.grayDark }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 30,
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
    modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 60,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  modernInputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: 60, // Un peu plus haut pour plus de confort
  borderRadius: 20, // Coins très arrondis (style iOS/Moderne)
  paddingHorizontal: 20,
  marginBottom: 20,
  // Shadow pour iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  // Elevation pour Android
  elevation: 3,
  borderWidth: 1,
  borderColor: 'transparent', // On commence sans bordure visible
},
inputFocused: {
  borderColor: '#E0E0E0', // Une bordure très fine en focus
  backgroundColor: '#FFFFFF',
  shadowOpacity: 0.15, // L'ombre s'accentue quand on clique
  transform: [{ scale: 1.01 }], // Effet de zoom très léger
},
modernInput: {
  flex: 1,
  height: '100%',
  fontSize: 16,
  fontWeight: '500',
  marginLeft: 15,
},
modernIcon: {
  width: 22,
  height: 22,
},
});

export default AuthScreen;

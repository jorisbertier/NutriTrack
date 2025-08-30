import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import Registration from '@/screens/Registration';
import Search from './(tabs)/Search';
import DetailsFood from '@/screens/[id]';
import Dashboard from '@/screens/dashboard';
import TabLayout from './(tabs)/_layout'; 
import EditProfileScreen from '@/screens/EditProfileScreen';
import { UserProvider } from '@/components/context/UserContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import { ThemeProvider, useTheme } from '@/hooks/ThemeProvider';
import { FoodProvider } from "@/hooks/FoodContext";
// import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import CreateAliment from '@/screens/CreateAliment';
import SearchAlimentCreated from '@/screens/SearchAlimentCreated';
import DetailsFoodCreated from '@/screens/[id]created';
import PrivacyPolicy from '@/screens/Conditions/PrivacyPolicy';
import Terms from '@/screens/Conditions/Terms';
import ReportIssue from '@/screens/Report';
import { Provider } from 'react-redux';
import { store } from '@/redux/store'
import Subscription from '@/screens/Subscription/Subscription';
import { useTranslation } from 'react-i18next';
import EditWeight from '@/screens/EditWeight';
import EditGoalScreen from '@/screens/EditGoalScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import FaqScreen from '@/screens/FaqScreen';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import HistoryWeight from '@/screens/HistoryWeight';
import QrCodeScreen from '@/screens/QrCodeScreen';
import ScannerScreen from '@/components/Scan/ScannerScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { t } = useTranslation();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Oswald: require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
    Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  // Empêche l'écran de démarrage de se cacher avant la fin du chargement des assets
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  
  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden').then(() => {
        NavigationBar.setBehaviorAsync('immersiveSticky');
      });
    }

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => unsubscribe();
  }, [loaded]);

  if (isConnected === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center',gap: 20, alignItems: 'center', backgroundColor: '#D6E4FD' }}>
        <StatusBar hidden={true} />
        <LottieView
            source={require('@/assets/lottie/Connection.json')}
            loop={true}
            style={{ width: 250, height: 250 }}
            autoPlay={true}
        />
        <Text style={{ color: 'black', fontSize: 26, fontWeight: 500, textAlign: 'center' }}>Ooops ...</Text>
        <Text style={{ color: 'black', fontSize: 18, textAlign: 'center' }}>{t('network')}</Text>
        <TouchableOpacity
          onPress={checkConnection}
          style={{
            backgroundColor: '#000',
            paddingVertical: 14,
            paddingHorizontal: 26,
            borderRadius: 12,
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 }}>
            {t('try')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loaded) {
    return null;
  }
  
  return (
    <ThemeProvider>
      <Provider store={store}>
      <UserProvider>
      <FoodProvider>
        <StatusBar backgroundColor="#000" barStyle="light-content" hidden={true}/>
        {/* <StatusBar style="auto" /> */}
        {/* <NavigationContainer independent={true} ref={navigationRef}> */}
          <Stack.Navigator
            screenOptions={{ headerShown: false, headerTitleAlign: 'center'}}
          >
            {/* Écran d'authentification */}
            <Stack.Screen name="auth" component={AuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="registration" component={Registration}
              options={{
                headerShown: true,
                headerTitle: t('registration'),
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#000',
                },
                headerTitleStyle: {
                  color: 'white',
                },
                headerTintColor: '#ffffff'
              }}
            />
              {/* Navigation par onglets (TabLayout) */}
              <Stack.Screen name="home" component={TabLayout} options={{ headerShown: false }} />

              {/* Autres écrans */}
              <Stack.Screen name="search" component={Search}/>
              <Stack.Screen name="FoodDetails" component={DetailsFood} />
              <Stack.Screen name="FoodDetailsCreated" component={DetailsFoodCreated} />
              <Stack.Screen name="Policy" component={PrivacyPolicy}
                options={{
                  headerShown: true,
                  headerTitle: t('privacyPolicy'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="Terms" component={Terms}
                options={{
                  headerShown: true,
                  headerTitle: t('termsOfUse'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="qrcode" component={QrCodeScreen}
                options={{
                  headerShown: true,
                  headerTitle: "qrcode",
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Report" component={ReportIssue}
                options={{
                  headerShown: true,
                  headerTitle: t('contactSupport'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="forgotpassword" component={ForgotPasswordScreen}
                options={{
                  headerShown: true,
                  headerTitle: t('forgotPassword'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="faq" component={FaqScreen}
                options={{
                  headerShown: true,
                  headerTitle: t('faq'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              {/* <Stack.Screen name="Subscription" component={Subscription}
                options={{
                  headerShown: true,
                  headerTitle: 'Subscription',
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              /> */}
              <Stack.Screen name="EditProfile" component={EditProfileScreen} 
                options={{
                  headerShown: true,
                  headerTitle: t('editProfile'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}
                options={{
                  headerShown: true,
                  headerTitle: t('changePassword'),
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              <Stack.Screen
                name="dashboard"
                component={Dashboard}
                options={{
                  headerShown: true,
                  headerTitle: 'Nutrition track',
                  headerTitleAlign: 'center',
                  headerStyle: {
                    backgroundColor: '#000',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                  headerTintColor: '#ffffff'
                }}
              />
              
                <Stack.Screen name="SearchAlimentCreated" component={SearchAlimentCreated} 
                  options={{
                    headerShown: true,
                    headerTitle: t('yourAliments'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: '#000',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: '#ffffff'
                  }}
                />
                <Stack.Screen name="historyweight" component={HistoryWeight} 
                  options={{
                    headerShown: true,
                    headerTitle: t('history_weight'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: '#000',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: '#ffffff'
                  }}
                />
                <Stack.Screen
                  name="CreateAliment"
                  component={CreateAliment}
                  options={{
                    headerShown: true,
                    headerTitle: t('buttonCreate'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: '#000',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: '#ffffff'
                  }}
                />
                <Stack.Screen
                  name="Editweight"
                  component={EditWeight}
                  options={{
                    headerShown: true,
                    headerTitle: t('editWeight'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: '#000',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: '#ffffff'
                  }}
                />
                <Stack.Screen
                  name="Editgoal"
                  component={EditGoalScreen}
                  options={{
                    headerShown: true,
                    headerTitle: t('editGoal'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: '#000',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: '#ffffff'
                  }}
                />
          </Stack.Navigator>
        {/* </NavigationContainer> */}
              </FoodProvider>
      </UserProvider>
      </Provider>
    </ThemeProvider>
  );
}

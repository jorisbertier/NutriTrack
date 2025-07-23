import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import Registration from '@/screens/Registration';
import Search from './(tabs)/Search';
import DetailsFood from '@/screens/[id]';
import Dashboard from '@/screens/dashboard';
import TabLayout from './(tabs)/_layout'; // Charge le layout des onglets
import EditProfileScreen from '@/screens/EditProfileScreen';
import { UserProvider } from '@/components/context/UserContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import { ThemeProvider, useTheme } from '@/hooks/ThemeProvider';
import { FoodProvider } from "@/hooks/FoodContext";
// import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'react-native';
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
  useEffect(() => {

    if (loaded) {
      SplashScreen.hideAsync();
      NavigationBar.setBackgroundColorAsync('#111419');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
    <ThemeProvider>
      <Provider store={store}>
      <UserProvider>
      <FoodProvider>
        <StatusBar backgroundColor="#000" barStyle="light-content"/>
        {/* <StatusBar style="auto" /> */}
        <NavigationContainer independent={true} ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{ headerShown: false, headerTitleAlign: 'center'}}
          >
            {/* Écran d'authentification */}
            <Stack.Screen name="auth" component={AuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="registration" component={Registration}
              options={{
                headerShown: true,
                headerTitle: 'Registration',
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
                    headerTitle: 'Your aliments',
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
                    headerTitle: 'Editweight',
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
                    headerTitle: 'Editgoal',
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
        </NavigationContainer>
              </FoodProvider>
      </UserProvider>
      </Provider>
    </ThemeProvider>
  );
}

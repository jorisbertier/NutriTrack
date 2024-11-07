import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import Registration from '@/screens/Registration';
import Search from './(tabs)/Search';
import DetailsFood from '@/screens/[id]';
import Dashboard from '@/screens/dashboard';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabLayout from './(tabs)/_layout'; // Charge le layout des onglets
import EditProfileScreen from '@/screens/EditProfileScreen';
import { UserProvider } from '@/components/context/UserContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import { ThemeProvider } from '@/hooks/ThemeProvider';

const Stack = createNativeStackNavigator();

// Empêche l'écran de démarrage de se cacher avant la fin du chargement des assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Oswald: require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
    Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    console.log(loaded)
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
    <UserProvider>
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerTitleAlign: 'center' }}
      >
        {/* Écran d'authentification */}
        <Stack.Screen name="auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="registration" component={Registration}
          options={{
            headerShown: true,
            headerTitle: 'Registration',
            headerTitleAlign: 'center'
          }}
        />
          {/* Navigation par onglets (TabLayout) */}
          <Stack.Screen name="home" component={TabLayout} options={{ headerShown: false }} />

          {/* Autres écrans */}
          <Stack.Screen name="search" component={Search} />
          <Stack.Screen name="FoodDetails" component={DetailsFood} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} 
            options={{
              headerShown: true,
              headerTitle: 'Edit Profile',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}
            options={{
              headerShown: true,
              headerTitle: 'Change password',
              headerTitleAlign: 'center'
            }}
          />
          <Stack.Screen
            name="dashboard"
            component={Dashboard}
            options={{
              headerTitle: 'Your nutrition metrics',
              headerBlurEffect: 'regular',
              headerStyle: { backgroundColor: 'rgba(255, 255, 255, 1)' },
              headerShown: true
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
        </UserProvider>
        </ThemeProvider>
  );
}

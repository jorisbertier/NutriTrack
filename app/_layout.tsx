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

const Stack = createNativeStackNavigator();

// Empêche l'écran de démarrage de se cacher avant la fin du chargement des assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerTitleAlign: 'center' }}
      >
        {/* Écran d'authentification */}
        <Stack.Screen name="auth" component={AuthScreen} options={{ headerShown: false }} />
        
        {/* Navigation par onglets (TabLayout) */}
        <Stack.Screen name="home" component={TabLayout} options={{ headerShown: false }} />

        {/* Autres écrans */}
        <Stack.Screen name="search" component={Search} />
        <Stack.Screen name="registration" component={Registration} />
        <Stack.Screen name="FoodDetails" component={DetailsFood} />
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
  );
}

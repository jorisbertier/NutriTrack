
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import Registration from '@/screens/Registration';
import Search from '@/screens/Search';
import DetailsFood from '@/screens/[id]';
import Dashboard from '@/screens/dashboard';


const Stack = createNativeStackNavigator();

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './(tabs)';

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
      screenOptions={{ headerShown: true, headerTitleAlign: 'center'}}
      >
        <Stack.Screen name="auth" component={AuthScreen} />
        <Stack.Screen name="search" component={Search} />
        <Stack.Screen name="home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="registration" component={Registration} />
        <Stack.Screen name="FoodDetails" component={DetailsFood} />
        <Stack.Screen name="dashboard" component={Dashboard} options={{headerTitle: 'Your nutrition metrics',
          headerBlurEffect: 'regular', headerStyle: { backgroundColor: 'rgba(255, 255, 255, 1)' }}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

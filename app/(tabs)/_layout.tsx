import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '.';
import Search from './Search';
import { Feather, Ionicons } from '@expo/vector-icons';
import ProfileScreen from '@/screens/ProfileScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/ThemeProvider';
import Subscription from '@/screens/Subscription/Subscription';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Stats from '@/screens/Stats';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  
  const { t } = useTranslation();
  const {colors} = useTheme();
  const Tab = createBottomTabNavigator();

  return (
    // <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle : { backgroundColor: colors.white} }}>
    {/* Onglet 1 : Home */}
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        tabBarLabel: ()=> null,
        tabBarIcon: ({ color, size }) => (
        <Feather name="home" color={color} size={size} />
      ),
      tabBarActiveTintColor : colors.primary
    }} 
    />

    {/* Onglet 2 : Search */}
    <Tab.Screen 
      name="Nutri search" 
      component={Search} 
      // options={{ tabBarLabel: 'Search', tabBarIcon: ({ color, size }) => (
      options={{ 
        tabBarLabel: ()=> null,
        tabBarIcon: ({ color, size }) => (
        <Feather name="compass" color={color} size={size} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: t('search'),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTitleStyle: {
        color: 'white',
      },
    }} 
    />

    {/* Onglet 3 : Dashboard */}
    {/* <Tab.Screen 
      name="Dashboard" 
      component={Dashboard}
      options={{
        tabBarLabel: ()=> null, 
        tabBarIcon: ({ color, size }) => (
        <Feather name="bar-chart-2" color={color} size={size} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: 'Nutrition track',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTitleStyle: {
        color: 'white',
      },
    }} 
    /> */}
    <Tab.Screen 
      name="NutriStats" 
      component={Stats}
      options={{
        tabBarLabel: ()=> null, 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="stats-chart" size={24} color={color} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: 'Nutri Stats',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTitleStyle: {
        color: 'white',
      },
    }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: ()=> null, 
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="account-circle" size={size} color={color} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: t('profile'),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTitleStyle: {
        color: 'white',
      },
    }} 
    />
    <Tab.Screen 
      name="Premium" 
      component={Subscription}
      options={{
        tabBarLabel: ()=> null, 
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="crown" size={21} color={color} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: 'Premium',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTitleStyle: {
        color: 'white',
      },
    }} 
    />
  </Tab.Navigator>
  );

}
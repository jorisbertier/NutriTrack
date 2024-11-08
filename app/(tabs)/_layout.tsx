import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '.';
import Search from './Search';
import Dashboard from '@/screens/dashboard';
import { TabBar } from '@/components/TabBar';
import { Feather } from '@expo/vector-icons';
import useThemeColors from '@/hooks/useThemeColor';
import ProfileScreen from '@/screens/ProfileScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/ThemeProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();
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
      name="Search" 
      component={Search} 
      // options={{ tabBarLabel: 'Search', tabBarIcon: ({ color, size }) => (
      options={{ 
        tabBarLabel: ()=> null,
        tabBarIcon: ({ color, size }) => (
        <Feather name="compass" color={color} size={size} />
      ),
      tabBarActiveTintColor : colors.primary,
      headerShown: true,
      headerTitle: 'Search',
      headerTitleAlign: 'center'
    }} 
    />

    {/* Onglet 3 : Dashboard */}
    <Tab.Screen 
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
      headerTitleAlign: 'center'
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
      headerTitle: 'Profile',
      headerTitleAlign: 'center'
    }} 
    />
  </Tab.Navigator>
  );

}
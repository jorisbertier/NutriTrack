import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '.';
import Search from './Search';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
    {/* Onglet 1 : Home */}
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ tabBarLabel: 'Accueil' }} 
    />

    {/* Onglet 2 : Search */}
    <Tab.Screen 
      name="Search" 
      component={Search} 
      options={{ tabBarLabel: 'Recherche' }} 
    />

    {/* Onglet 3 : Profile */}
    {/* <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ tabBarLabel: 'Profil' }} 
    /> */}
  </Tab.Navigator>
  );

}
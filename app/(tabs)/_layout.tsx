import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{title: 'Home'}}/> 
      <Tabs.Screen name="search" options={{
        title: 'Explore',
        tabBarIcon: ({ color, focused }) => (
          <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
        ),
      }} />
    </Tabs>
  );
}
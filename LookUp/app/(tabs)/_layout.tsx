import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons"; // Import the icons we intend to use

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="search"
        options={{ 
          title: 'Search', 
          tabBarIcon: ({ color }) => 
          <Ionicons
              name='search'
              size={24}
              color={color}
          /> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ 
          title: 'Favorites', 
          tabBarIcon: ({ color }) => 
          <Ionicons
              name='star'
              size={24}
              color={color}
          /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ 
          title: 'Map', 
          tabBarIcon: ({ color }) => 
          <Ionicons
              name="map"
              size={24}
              color={color}
          /> }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home (will be account)',
          tabBarIcon: ({ color }) => 
          <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore (will be settings)',
          tabBarIcon: ({ color }) => 
          <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

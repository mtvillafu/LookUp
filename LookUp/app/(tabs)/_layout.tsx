import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons"; 
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { LoginModalProvider, useLoginModal } from '@/context/LoginModalContext'; // Import Context Provider and Hook
import LoginModal from '@/components/LoginModal'; // Import Modal Component
import 'react-native-reanimated'; // For Navigation Animations

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LoginModalProvider> {/* Wrap the entire layout */}
      <MainLayout colorScheme={colorScheme ?? 'light'} />
      <LoginModal /> {/* Ensure the modal is always available */}
    </LoginModalProvider>
  );
}

// Separate MainLayout to avoid calling useLoginModal before it's wrapped
function MainLayout({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const { showLoginModal } = useLoginModal(); // Now it's inside the provider

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen name="search" options={{ 
          title: 'Search', 
          tabBarIcon: ({ color }) => <Ionicons name='search' size={24} color={color} />
        }}
      />
      <Tabs.Screen name="favorites" options={{ 
          title: 'Favorites', 
          tabBarIcon: ({ color }) => <Ionicons name='star' size={24} color={color} />
        }}
      />
      <Tabs.Screen name="map" options={{ 
          title: 'Map', 
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="index"
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent navigation, which this normally defaults to
            showLoginModal(); // Open login modal
          },
        }}
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ 
          title: 'Settings', 
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icons from expo vector icons

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: '#6200EE', // Custom active color
          drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          drawerStyle: {
            backgroundColor: '#f0f0f0', // Background for the drawer
          },
          headerStyle: {
            backgroundColor: '#000000', // Header background color
          },
          headerTintColor: '#fff', // Header text color
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="hero"
          options={{
            drawerLabel: 'Generate',
            title: 'Generate',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="image" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="gallery"
          options={{
            drawerLabel: 'Gallery',
            title: 'Gallery',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="collections" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="contactus"
          options={{
            drawerLabel: 'Contact Us',
            title: 'Contact Us',
            drawerIcon: ({ color }) => (
              <MaterialIcons name="contact-mail" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import RoomDetailsScreen from './src/screens/RoomDetailsScreen';
import BookingFormScreen from './src/screens/BookingFormScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#0a0a0a',
        card: '#0a0a0a',
        text: '#ffffff',
        border: '#222222',
        primary: '#ef4444'
      }
    }}>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0a0a0a' }
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mermaid Resort' }} />
        <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={({ route }) => ({ title: route.params.room.name })} />
        <Stack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Room' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

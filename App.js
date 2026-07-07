import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Home, Utensils, Shield } from 'lucide-react-native';

import HomeScreen from './src/screens/HomeScreen';
import RoomDetailsScreen from './src/screens/RoomDetailsScreen';
import BookingFormScreen from './src/screens/BookingFormScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import RestaurantScreen from './src/screens/RestaurantScreen';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#0a0a0a' }
    }}>
      <HomeStack.Screen name="ResortHome" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="RoomDetails" component={RoomDetailsScreen} options={({ route }) => ({ title: route.params.room.name })} />
      <HomeStack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Room' }} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.preloaderContainer}>
        <StatusBar style="light" />
        <View style={styles.preloaderInner}>
          <ActivityIndicator size="large" color="#ef4444" style={styles.preloaderSpinner} />
          <Text style={styles.preloaderText}>LOADING RESORT</Text>
        </View>
      </View>
    );
  }

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
      <Tab.Navigator screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#222', height: 60, paddingBottom: 8, paddingTop: 6 },
          tabBarActiveTintColor: '#ef4444',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Resort') {
              return <Home size={size} color={color} />;
            } else if (route.name === 'Restaurant') {
              return <Utensils size={size} color={color} />;
            } else if (route.name === 'AdminDashboard') {
              return <Shield size={size} color={color} />;
            }
          }
      })}>
        <Tab.Screen name="Resort" component={HomeStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Resort Restaurant' }} />
        <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ tabBarLabel: 'Admin', title: 'Admin Portal' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  preloaderContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  preloaderInner: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  preloaderSpinner: {
    marginBottom: 15
  },
  preloaderText: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

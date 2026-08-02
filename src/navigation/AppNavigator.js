import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Shield, Utensils } from 'lucide-react-native';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import RoomDetailsScreen from '../screens/RoomDetailsScreen';
import { colors } from '../theme/colors';
import { navigationTheme, stackScreenOptions } from '../theme/navigationTheme';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Resort: Home,
  Restaurant: Utensils,
  AdminDashboard: Shield
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="ResortHome" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="RoomDetails"
        component={RoomDetailsScreen}
        options={({ route }) => ({ title: route.params.room.name })}
      />
      <HomeStack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Room' }} />
    </HomeStack.Navigator>
  );
}

const getTabScreenOptions = ({ route }) => ({
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: 'bold' },
  tabBarStyle: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    paddingTop: 6
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarIcon: ({ color, size }) => {
    const Icon = tabIcons[route.name];
    return Icon ? <Icon size={size} color={color} /> : null;
  }
});

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator screenOptions={getTabScreenOptions}>
        <Tab.Screen name="Resort" component={HomeStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Resort Restaurant' }} />
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ tabBarLabel: 'Admin', title: 'Admin Portal' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

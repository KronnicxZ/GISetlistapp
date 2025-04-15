import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Importar pantallas
import SongsScreen from '../screens/SongsScreen';
import SetlistsScreen from '../screens/SetlistsScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import SetlistDetailScreen from '../screens/SetlistDetailScreen';
import SongSelectorScreen from '../screens/SongSelectorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SongsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SongsList" component={SongsScreen} options={{ title: 'Canciones' }} />
    <Stack.Screen name="SongDetail" component={SongDetailScreen} options={{ title: 'Detalles de la Canción' }} />
  </Stack.Navigator>
);

const SetlistsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SetlistsList" component={SetlistsScreen} options={{ title: 'Setlists' }} />
    <Stack.Screen name="SetlistDetail" component={SetlistDetailScreen} options={{ title: 'Detalles del Setlist' }} />
    <Stack.Screen name="SongSelector" component={SongSelectorScreen} options={{ title: 'Seleccionar Canciones' }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Songs') {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            } else if (route.name === 'Setlists') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray.light,
          headerStyle: {
            backgroundColor: COLORS.background.light,
          },
          headerTintColor: COLORS.text.light,
        })}
      >
        <Tab.Screen 
          name="Songs" 
          component={SongsStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Setlists" 
          component={SetlistsStack} 
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 
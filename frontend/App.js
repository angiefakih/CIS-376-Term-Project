import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import WardrobeScreen from './screens/WardrobeScreen';
import MannequinScreen from './screens/MannequinScreen';
import PlanOutfitScreen from './screens/PlanOutfitScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import RetryScreen from './screens/RetryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
        <Stack.Screen name="Mannequin" component={MannequinScreen} />
        <Stack.Screen name="PlanOutfit" component={PlanOutfitScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="Retry" component={RetryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

// App navigation container and stack navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../components/loginPage.js';
import SignUp from '../components/signupPage.js';
import Page1 from './components/Page1.js';

// npm install @react-navigation/native-stack

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={LoginPage}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUp}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name='Page1'
        component={Page1}
        options={{ title: 'Page1' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

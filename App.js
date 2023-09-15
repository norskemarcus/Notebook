// App.js should primarily handle app initialization and navigation.

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/loginPage.js';
import SignUp from './components/signupPage.js';
//import AppNavigator from '../navigation/appNavigator.js';
import Page1 from './components/Page1.js';
import Page2 from './components/Page2.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  // Track user login state
  const [user, setUser] = React.useState(null);
  const [documents, setDocuments] = useState([]);

  // Function to set the user after successful login
  const handleLogin = loggedInUser => {
    setUser(loggedInUser);
  };

  // Store the current note state in the parent component
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSaveNote = updatedNote => {
    setCurrentNote(updatedNote);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          options={{ title: 'The Note App' }}
        >
          {props => (
            <LoginPage
              {...props}
              onLogin={handleLogin}
              navigation={props.navigation} // Pass navigation prop to login
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name='SignUp'
          component={SignUp}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name='Page1'
          component={Page1}
          options={{ title: 'Back' }}
        />
        <Stack.Screen
          name='Page2'
          component={Page2}
          options={{ title: 'Page2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

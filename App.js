// App.js should primarily handle app initialization and navigation.

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/loginPage.js';
import SignUp from './components/signupPage.js';
//import AppNavigator from '../navigation/appNavigator.js';
import Page1 from './components/Page1.js';
import Page2 from './components/Page2.js';
import UploadScreen from './components/uploadScreen.js';
import { ref, uploadBytes } from 'firebase/storage';
//import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from './firebase/config.jsx';
// @react-native-async-storage/async-storage
import { useCollection } from 'react-firebase-hooks/firestore';
//import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

/* import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
 */
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

  // Han bruger <UploadMediaFile /> inde i en View

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
        <Stack.Screen
          name='UploadScreen'
          component={UploadScreen}
          options={{ title: 'Upload Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

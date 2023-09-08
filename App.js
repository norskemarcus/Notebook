// App.js should primarily handle app initialization and navigation.

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/loginPage.js';
import SignUp from './components/signupPage.js';
import AppNavigator from './navigation/appNavigator.js';
import Page1 from './components/Page1.js';
import Page2 from './components/Page2.js';

const Stack = createNativeStackNavigator();

export default function App() {
  // Track user login state
  const [user, setUser] = React.useState(null);

  // Function to set the user after successful login
  const handleLogin = loggedInUser => {
    setUser(loggedInUser);
  };

  const [documents, setDocuments] = useState([]);

  // Store the current note state in the parent component
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });

  const handleSaveNote = updatedNote => {
    setCurrentNote(updatedNote);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name='AppNavigator'
            component={AppNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name='Login'
            options={{ title: 'Login' }}
          >
            {props => (
              <LoginPage
                {...props}
                onLogin={handleLogin}
                navigation={props.navigation} // Pass navigation prop to login
              />
            )}
          </Stack.Screen>
        )}
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
        <Stack.Screen
          name='Page2'
          component={Page2}
          options={{ title: 'Page2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* 
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Notebook'
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name='Notebook'>
          {props => (
            <Notebook
              {...props}
              documents={documents}
              currentNote={currentNote} // Pass the current note to Page1
              handleSaveNote={handleSaveNote}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name='Back'>
          {props => (
            <Back
              {...props}
              currentNote={currentNote} // Pass the current note to Page2
              handleSaveNote={handleSaveNote}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 */



import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/loginPage.js';
import SignUp from './components/signupPage.js';
import Page1 from './components/Page1.js';
import Page2 from './components/Page2.js';
import UploadScreen from './components/uploadScreen.js';
import CameraScreen from './components/camera.js'; 
import CameraMobile from './components/cameraMobile.js';

const Stack = createNativeStackNavigator();

export default function App() {
  // Track user login state
  const [user, setUser] = React.useState(null);
  //const [documents, setDocuments] = useState([]);


  const handleLogin = loggedInUser => {
    setUser(loggedInUser);
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
  
        <Stack.Screen
          name='UploadScreen'
          component={UploadScreen}
          options={{ title: 'Upload Screen' }}
        />
        
        <Stack.Screen
          name='CameraScreen'
          component={CameraScreen}
          options={{ title:  'Camera' }}
        />
         <Stack.Screen
          name='CameraMobile'
          component={CameraMobile}
          options={{ title:  'Camera Mobile' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
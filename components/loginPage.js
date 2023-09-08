import axios from 'axios'; // npm install axios
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import { Alert } from 'react-native';
import { apiKey } from '../firebase/config.jsx'; //removed auth
import { auth } from '../firebase/config.jsx';

const API_KEY = 'AIzaSyA7txWcuaoBoYcSpqTf4l3nKfiiV0C1BYs';
const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('rewrewrew');

  async function login() {
    const auth = auth;

    try {
      const response = await axios.post(url + API_KEY, {
        auth: auth,
        email: email,
        password: password,
        returnSecureToken: true,
      });
      Alert.alert('Login successful ', 'token: ' + response.data.idToken.substring(0, 10) + '...');
      console.log('Login success:', response.data.idToken.substring(0, 10));
      navigation.navigate('Page1');
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      Alert.alert('Login failed ', error.message);
    }
  }

  const signUp = () => {
    // Navigate to the sign-up screen (signupUser.js)
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder='Email'
        style={styles.textBoxes}
      />
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder='Password'
        secureTextEntry={true}
        style={styles.textBoxes}
      />
      <Pressable
        onPress={login}
        style={styles.loginButton}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Text style={styles.signupText}>Don't have an account?</Text>
      <Pressable
        onPress={signUp}
        style={styles.signupLink}
      >
        <Text style={styles.signUpButton}>SignUp</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBoxes: {
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,

    fontSize: 18,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: '#2596be',
    padding: 10,
    width: '20%',
    borderRadius: 10,
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#e28743',
    padding: 7,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  signupText: {
    fontSize: 12,
    marginTop: 20,
  },
  signupLink: {
    color: 'blue',
  },
});

import axios from 'axios'; // npm install axios
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import { Alert } from 'react-native';
import { apiKey, auth as firebaseAuth } from '../firebase/config.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const API_KEY = 'AIzaSyA7txWcuaoBoYcSpqTf4l3nKfiiV0C1BYs';
const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

export default function LoginPage({ navigation }) {
  // onLogin
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('rewrewrew');
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    const auth = getAuth;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      /* const response = await axios.post(url + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true,
      }); */
      // response.data.idToken
      if (user) {
        console.log('Login success:', user);

        navigation.navigate('Page1', { userId: user.uid });
      } else {
        console.error('Unexpected login response:', user);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signUp = () => {
    navigation.navigate('SignUp');
  };

  /* return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder='Email'
          style={styles.textBoxes}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder='Password'
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Pressable
            onPress={togglePasswordVisibility}
            style={styles.showPasswordButton}
          >
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color='black'
            />
          </Pressable>
        </View>
        <Pressable
          onPress={login}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <Text style={styles.signupText}>Don't have an account?</Text>
      <Pressable
        onPress={signUp}
        style={styles.signupLink}
      >
        <Text style={styles.signUpButton}>Sign Up</Text>
      </Pressable>
    </View>
  );
}
 */
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder='Email'
          style={styles.textBoxes}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder='Password'
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Pressable
            onPress={togglePasswordVisibility}
            style={styles.showPasswordButton}
          >
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color='black'
            />
          </Pressable>
        </View>
        <Pressable
          onPress={login}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <Text style={styles.signupText}>Don't have an account?</Text>
      <Pressable
        onPress={signUp}
        style={styles.signupLink}
      >
        <Text style={styles.signUpButton}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  textBoxes: {
    marginBottom: 20,
    fontSize: 18,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Added to create space between input and icon
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    paddingRight: 0,
  },
  loginButton: {
    backgroundColor: '#2596be',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  showPasswordButton: {
    padding: 10,
  },
  signUpButton: {
    backgroundColor: '#e28743',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  signupText: {
    fontSize: 16,
    marginTop: 20,
    color: 'gray',
  },
  signupLink: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

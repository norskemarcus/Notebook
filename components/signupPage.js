import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('marcus@gmail.com');
  const [password, setPassword] = useState('E12345b');

  async function signUpUser() {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        console.log('User created:', user);
        navigation.navigate('Page1', { userId: user.uid });
      } else {
        // Handle the case where the user was not created (unlikely to happen)
        Alert.alert('Sign-up failed', 'User was not created.');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Sign-up failed', 'Email is already in use. Please use a different email.');
      } else {
        // Handle other sign-up errors
        Alert.alert('Sign-up failed', error.message);
      }
    }
  }
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
        onPress={signUpUser}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign up as member</Text>
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
    fontSize: 18,
    padding: 12,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2596be',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

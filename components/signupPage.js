import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('marcus@gmail.com');
  const [password, setPassword] = useState('E12345b');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); 
  const [error, setError] = useState(null);

  async function signUpUser() {
    try {
      setLoading(true); 
      setError(null);
      setResponse(null);

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        setResponse('User created successfully.');
        console.log('User created:', user);
        navigation.navigate('Page1', { userId: user.uid });
      } else {
        setError('Sign-up up failed', 'User was not created.');
      }
    } catch (error) {
      setLoading(false); 
      setEmail(''); 
      setPassword(''); 

      if (error.code === 'auth/email-already-in-use') {
         setError('Email is already in use. Please use a different email.');
        } else {
        setError(error.message);
        }
      } finally {
      setLoading(false);
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
        style={[styles.button, {marginBottom: 10 }]}
        disabled={loading} 
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loading indicator
        ) : (
          <Text style={styles.buttonText}>Sign up as member</Text>
        )}
      </Pressable>

      {error && <Text style={{color: "red", marginTop: 10}}>{error}</Text>}
      {response && <Text style={styles.responseText}>{response}</Text>}
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

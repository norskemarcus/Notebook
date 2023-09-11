/* import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { auth } from '../firebase/config.jsx'; // Import your Firebase authentication object

export default function Header({ isLoggedIn, onLogout }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout(); // Notify the parent component about the logout
      // navigate to the login page if needed
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      <Text>Welcome, User</Text>
      {isLoggedIn && ( // Conditionally render the Logout button when isLoggedIn is true
        <Pressable onPress={handleLogout}>
          <Text>Logout</Text>
        </Pressable>
      )}
    </View>
  );
}
 */

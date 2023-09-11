/* import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { auth } from '../firebase/config.jsx'; // Import your Firebase authentication object

export default function UserStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an authentication observer
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user); // Update the user state when the authentication state changes
    });

    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return <View>{user ? <Text>Welcome, {user.email}</Text> : <Text>Not logged in</Text>}</View>;
}
 */

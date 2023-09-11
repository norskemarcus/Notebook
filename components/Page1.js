import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth as firebaseAuth, db } from '../firebase/config.jsx';
import { addDoc, collection, where, query, getDocs, deleteDoc } from 'firebase/firestore';

export default function Page1({ navigation, route }) {
  const [titleInput, setTitleInput] = useState('');
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
      console.log('User:', user);

      if (user) {
        // User is authenticated, fetch and set user's documents
        setUserId(user.uid); // Set the userId in the local state
        getDocumentsForCurrentUser(user.uid);
      } else {
        // User is not authenticated, handle this case as needed
        console.log('User is not authenticated');
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, [route.params?.updatedDocument]); // Dependency on updatedDocument

  // Custom header for Page1 screen
  /*   useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Page 1',
      headerRight: () => (
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      ),
    });
  }, [navigation]);
 */
  // ---------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (route.params?.updatedDocument) {
      const updatedDocument = route.params?.updatedDocument;
      setDocuments(prevDocuments => prevDocuments.map(doc => (doc.id === updatedDocument.id ? updatedDocument : doc)));
    }
  }, [route.params?.updatedDocument]);

  const addDocument = () => {
    if (titleInput.trim() === '') {
      return;
    }
    saveDocumentToFirestore(titleInput);
    setTitleInput('');
  };

  const saveDocumentToFirestore = async title => {
    try {
      const user = firebaseAuth.currentUser;

      if (user) {
        user
          .getIdToken(true) // Pass `true` to force token refresh
          .then(newIdToken => {
            userId = newIdToken;
          });

        const notebookDocCollection = collection(db, 'notebook_doc');

        await addDoc(notebookDocCollection, {
          userId: userId,
          title: title,
          content: '',
          createdAt: new Date().toISOString(),
        });

        console.log('Document saved to Firestore successfully.');

        // After saving, fetch and update the documents list
        getDocumentsForCurrentUser(userId);
      } else {
        console.log('User is not authenticated - THIS CODE IS HERE: Page1.js');
      }
    } catch (error) {
      console.error('Error saving document to Firestore:', error);
    }
  };

  const getDocumentsForCurrentUser = async userId => {
    try {
      const documentsRef = collection(db, 'notebook_doc');
      const q = query(documentsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const userDocuments = [];
      querySnapshot.forEach(doc => {
        userDocuments.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(userDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  /*   const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }; */

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={titleInput}
          placeholder='Enter document title'
          onChangeText={setTitleInput}
        />
        <Pressable
          style={styles.plusButton}
          onPress={addDocument}
        >
          <Icon
            name='plus'
            size={24}
            color='#3079d1'
          />
        </Pressable>
      </View>
      <ScrollView style={styles.goalsContainer}>
        {documents.map(doc => (
          <View
            style={styles.goalItem}
            key={doc.title}
          >
            <Text
              style={styles.goalText}
              onPress={() =>
                navigation.navigate('Page2', {
                  document: doc,
                  documentId: doc.id,
                  userId: userId,
                })
              }
            >
              {doc.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

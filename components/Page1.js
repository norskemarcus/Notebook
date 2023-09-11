import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, FlatList } from 'react-native';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth as firebaseAuth, db } from '../firebase/config.jsx';
import { addDoc, collection, where, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { AsyncStorage } from '@react-native-async-storage/async-storage';
// OBS npm install @react-native-async-storage/async-storage

export default function Page1({ navigation, route }) {
  const [titleInput, setTitleInput] = useState('');
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
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
  }, [route.params?.updatedDocument, userId]); // Dependency on updatedDocument  and userId

  // Custom header for Page1 screen
  useEffect(() => {
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
        /*  user
          .getIdToken(true) // Pass `true` to force token refresh
          .then(newIdToken => {
            setUserId(newIdToken); // Use setUserId to update the state variable
          });
 */
        const notebookDocCollection = collection(db, 'notebook_doc');

        await addDoc(notebookDocCollection, {
          userId: user.uid,
          title: title,
          content: '',
          createdAt: new Date().toISOString(),
        });

        console.log('Document saved to Firestore successfully.');

        // After saving, fetch and update the documents list
        getDocumentsForCurrentUser(user.uid);
      } else {
        console.log('User is not authenticated');
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

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  async function deleteDocument(id) {
    try {
      const docRef = doc(db, 'notebook_doc', id);
      await deleteDoc(docRef);

      // Update the local documents list after deletion
      // setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
      getDocumentsForCurrentUser(userId);
      console.log(`Document with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
    }
  }

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
      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <View style={styles.goalContent}>
              <Text
                style={styles.goalText}
                onPress={() => {
                  navigation.navigate('Page2', {
                    document: item,
                    documentId: item.id,
                    userId: userId,
                  });
                }}
              >
                {item.title}
              </Text>
              <Pressable onPress={() => deleteDocument(item.id)}>
                <Icon
                  name='trash'
                  size={24}
                  color='#FF6B6B'
                />
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

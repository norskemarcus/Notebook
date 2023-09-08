import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.jsx';
import { addDoc, collection, where, query, getDocs } from 'firebase/firestore';

export default function Page1({ navigation, route }) {
  // useState = react native hook, en mekanisme man kan hekte sig på. Lidt som en session.
  const [titleInput, setTitleInput] = useState(''); // gemme blankt først
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize userId in the local state
  //  userId is defined in the local state and set when the user is authenticated. It will then be available for use in the onPress handler when navigating to Page2.

  // Use useEffect to fetch documents when the component mounts or user changes
  useEffect(() => {
    // Check if the user is authenticated
    const user = auth.currentUser;
    if (user) {
      // User is authenticated, fetch and set user's documents
      setUserId(user.uid); // Set the userId in the local state
      getDocumentsForCurrentUser(user.uid);
    } else {
      // User is not authenticated, handle this case as needed
      console.log('User is not authenticated');
    }
  }, [route.params?.updatedDocument]); // Dependency on updatedDocument

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
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
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

  return (
    <View style={[styles.appContainer]}>
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
                  userId: userId, // Pass userId to Page2
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

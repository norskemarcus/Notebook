import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';
import { db } from '../firebase/config.jsx';
import { updateDoc, doc } from 'firebase/firestore';

export default function Page2({ navigation, route }) {
  // const document = route.params?.document; // optional chaining to handle case when route is null
  const [document] = useState(route.params?.document || {});
  const { documentId, userId } = route.params;
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialTitle, setInitialTitle] = useState(document?.title || '');

  // Hvor bliver dette brugt?
  const [reply, setReply] = useState('Empty');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveChanges = async () => {
    setIsEditMode(false);

    const documentData = {
      userId: userId, // documentId
      title: title,
      content: content,
      createdAt: new Date().toISOString(), // // Convert Date to a serializable string
    };

    // OBS: ikke bruge collection når det omhandler ett dokument med en id!
    const notebookDocRef = doc(db, 'notebook_doc', documentId);

    if (document) {
      // document.title = title;
      //document.content = content;
      // Update the document in Firestore using its ID
      await updateDoc(notebookDocRef, documentData);
    }

    //navigation.navigate({ name: 'Page1', params: { updatedDocument: documentData } });
    navigation.navigate('Page1', {
      updatedDocument: { id: documentId, ...documentData }, // Exclude createdAt, resolve problem of non-serializable values in the navigation state.
    });
  };
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setTitle(initialTitle);
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={handleEdit}
          style={styles.editIcon}
        >
          <Icon
            name='edit'
            size={24}
            color='#3079d1'
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>

      {isEditMode ? (
        <View>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View> // multiline = true allows textinput to accept multiple lines of text input
      ) : (
        <Text style={styles.contentText}>{content}</Text>
      )}

      {isEditMode && (
        <View style={styles.editButtonsContainer}>
          <Pressable
            onPress={handleSaveChanges}
            style={styles.saveButton}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
          <Pressable
            onPress={handleCancelEdit}
            style={styles.cancelButton}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

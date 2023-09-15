import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
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
      userId: userId,
      title: title,
      content: content,
      createdAt: new Date().toISOString(), // // Convert Date to a serializable string
    };

    // OBS: ikke bruge collection når det omhandler ett dokument med en id!
    const notebookDocRef = doc(db, 'notebook_doc', documentId);

    if (document) {
      await updateDoc(notebookDocRef, documentData);
    }
    // måske unødvendig at sende data
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

      <View style={styles.contentContainer}>
        {isEditMode && (
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
          </View>
        )}
        {!isEditMode && <Text style={[styles.contentText, styles.centerContentText]}>{content}</Text>}
      </View>
    </View>
  );
}

/* 
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
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={[styles.contentText, styles.centerContentText]}>{content}</Text>
        </View>
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
 */

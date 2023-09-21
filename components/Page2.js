import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';
import { db, storage } from '../firebase/config.jsx';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import { useFocusEffect } from '@react-navigation/native';


export default function Page2({ navigation, route }) {
  const [document] = useState(route.params?.document || {});
  const { documentId, userId } = route.params;
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialTitle, setInitialTitle] = useState(document?.title || '');
  const [imageURL, setImageURL] = useState(null);
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      retrieveImageURL();
    }
  }, [document]);

  useEffect(() => {
    if (imageURL) {
      setForceRender(!forceRender); // Toggle the dummy state to trigger a re-render
    }
  }, [imageURL]);

  useFocusEffect(
    React.useCallback(() => {
      // Reload the data when the screen is focused
      if (document) {
        setTitle(document.title);
        setContent(document.content);
        retrieveImageURL();
      }
    }, [document])
  );
  





    async function retrieveImageURL() {
      try {
        const notebookDocRef = doc(db, 'notebook_doc', documentId);
        const docSnapshot = await getDoc(notebookDocRef);

        if (docSnapshot.exists()) {
          const imageURL = docSnapshot.data().imageURL;
          setImageURL(imageURL);
        } else {
          // If no document exists, check for an existing image
          checkImageInStorage();
        }
      } catch (error) {
        console.error('Error retrieving image URL from Firestore:', error);
      }
    }
    
    async function checkImageInStorage() {
      try {
        const storageRef = storage;
        const imagePath = `images/${documentId}.jpg`;
        const metadata = await getMetadata(ref(storageRef, imagePath));

        if (metadata.size > 0) {
          const fullImageURL = await getDownloadURL(ref(storageRef, imagePath));
          setImageURL(fullImageURL);
        } else {
          setImageURL(null);
        }
      } catch (error) {
        console.error('Error checking for image:', error);
      }
    }
 

  const renderImage = () => {
    if (imageURL) {
      return (
        <Image
          source={{ uri: imageURL }}
          style={styles.centeredImage}
        />
      );
    }
    return null;
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const goToImageUpload = () => {
    navigation.navigate('UploadScreen', { documentId, navigation });
  };

  const handleSaveChanges = async () => {
    setIsEditMode(false);

    const documentData = {
      userId: userId,
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
    };

    const notebookDocRef = doc(db, 'notebook_doc', documentId);

    if (document) {
      await updateDoc(notebookDocRef, documentData);
    }

    navigation.navigate('Page1', {
      updatedDocument: { id: documentId, ...documentData },
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
        <Pressable
          onPress={goToImageUpload}
          style={styles.uploadButton}
        >
          <Text style={styles.buttonText}>Upload an image</Text>
        </Pressable>

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
        <View style={styles.imageContainer}>
          {renderImage()}
        </View>
      </View>
    </View>
  );
}

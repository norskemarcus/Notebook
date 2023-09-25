import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';
import { db, storage } from '../firebase/config.jsx';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getMetadata, deleteObject } from 'firebase/storage';
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
  const [newImageURL, setNewImageURL] = useState(null);
  const [isMirrored, setIsMirrored] = useState(false);


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
        const imageURL = docSnapshot.data().imageURL || newImageURL; ;
        setImageURL(imageURL);
      
      } else {
        // If no document exists, check for an existing image
      //  checkImageInStorage();
      setImageURL(null);
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
    if (newImageURL) {
      return (
        <Image
          source={{ uri: newImageURL }}  // Use newImageURL if available
          style={styles.centeredImage}
        />
      );
    } else if (imageURL){
      return (
        <Image
          source={{ uri: imageURL }} // Use imageURL as fallback
          style={styles.centeredImage}
        />
      )
      } else {
        return (
           <Pressable
          style={styles.imagePlaceholder}
          onPress={goToImageUpload}
        >
          <Icon name="camera" size={48} color="#50a182" /> 
          <Text style={styles.imagePlaceholderText}>Add an image</Text>
        </Pressable>
      );
  
    }
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


  const handleDeleteImage = async () => {
    try {
      const storageRef = ref(storage, `images/${documentId}.jpg`); // Get a reference to the image
      await deleteObject(storageRef); // Delete the image from Firebase Storage

      //const imagePath = `images/${documentId}.jpg`;
  
      // Update Firestore to remove the image URL
      const notebookDocRef = doc(db, 'notebook_doc', documentId);
      await updateDoc(notebookDocRef, { imageURL: null });

      setImageURL(null);
  
      // Info to the user should come here! Picture is not being deleted
    
      console.log('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  const handleToggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  return (
    <ScrollView style={styles.appContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
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
            <View style={styles.iconsContainer}>
            <Pressable
              onPress={goToImageUpload}
              style={styles.changePictureButton}
            >
              <Icon name="camera" size={20} color="black" />
            </Pressable>
            <Pressable
            onPress={handleDeleteImage}
            style={styles.deleteImageButton}
          >
            <Icon name="trash" size={20} color="red" /> 
          </Pressable>
          </View>
    
          </View>
        )}
        {!isEditMode && (
          <ScrollView style={styles.scrollableTextContainer}>
            <Text style={[styles.contentText, styles.centerContentText]}>{content}</Text>
          </ScrollView>
        )}
     <View style={styles.imageContainer}>
        {renderImage()}
       
      </View>
    </View>
  </ScrollView>
);
        
}
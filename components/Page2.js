import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';
import { db, storage } from '../firebase/config.jsx';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import UploadScreen from './uploadScreen.js';
import { getDownloadURL, ref, getMetadata  } from 'firebase/storage';

export default function Page2({ navigation, route }) {
  // const document = route.params?.document; // optional chaining to handle case when route is null
  const [document] = useState(route.params?.document || {});
  const { documentId, userId } = route.params;
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialTitle, setInitialTitle] = useState(document?.title || '');
  // Define state variable to store image path
  const [imagePath, setImagePath] = useState(null);
  // Er dette korrekt?
  const { uploadedImage } = route.params;

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }

      // Check if an image URL was passed from UploadScreen or Page1
    if (route.params?.uploadedImage) {
      setImagePath(route.params.uploadedImage);
    } else {
      // If no uploaded image, fetch the image URL from Firestore
      retrieveImageURL();
    }
  }, [document]);

  
// Retrieve the image URL from Firestore when the component mounts
const retrieveImageURL = async () => {
  try {
    const notebookDocRef = doc(db, 'notebook_doc', documentId);
    const docSnapshot = await getDoc(notebookDocRef);

    if (docSnapshot.exists()) {
      const imageURL = docSnapshot.data().imageURL;
      console.log("DENNE imageURL burde være korrekt", imageURL);
      setImagePath(imageURL);
    } else {
      // If no document exists, check for an existing image
      console.log("checkImageInStorage bliver kørt")
      checkImageInStorage();
    }
  } catch (error) {
    console.error('Error retrieving image URL from Firestore:', error);
  }
};


  const checkImageInStorage = async () => {
    try {
      const storageRef = getStorage(storage);
      console.log(storageRef);

      const imagePath = `images/${documentId}.jpg`;
      console.log("imagePath here:", imagePath);
  
      const metadata = await getMetadata(ref(storageRef, imagePath));
  
      if (metadata.size > 0) {
      
        const fullImageURL = await getDownloadURL(ref(storageRef, imagePath));
        setImagePath(fullImageURL);
        console.log("fullImageURL ---------------------------------", fullImageURL);
      } else {
        setImagePath(null);
      }
    } catch (error) {
      console.error('Error checking for image:', error);
    }
  };

  // Function to render the image
  const renderImage = () => {
    if (imageURL) {
      return (
        <Image
          source={{ uri: "https://firebasestorage.googleapis.com/v0/b/notebook-32257.appspot.com/o/images%2FQoQzwAXj3qmUS82RvCx3.jpg?alt=media&token=c81d77c9-4aae-4eda-96ec-eab9a78eb0d2" }}
          style={styles.centeredImage}
        />
      );
    }
    return null; // Return null if no image path is available
  };
// imageURL
  // https://firebasestorage.googleapis.com/v0/b/notebook-32257.appspot.com/o/images%2FQoQzwAXj3qmUS82RvCx3.jpg?alt=media&token=c81d77c9-4aae-4eda-96ec-eab9a78eb0d2

  const handleEdit = () => {
    setIsEditMode(true);
  };

   if (uploadedImage) {
    downloadImage();
  } 

  // Denne følger Jon sin video. OBS ÆNDRE NAVNET. Hvordan få fat på unik id til billedet?
  // OBS: have med en check om det findes et billede som er koblet til og hvis det gør så skal det vises.

  //  getDownloadURL(ref(storage, editObj.id + '.jpg'))
  async function downloadImage() {
    
    try {

      const imageRef = ref(storage, uploadedImage);
      const url = await getDownloadURL(imageRef);
      setImagePath(url);    
      console.log("imageRef fra downloadImage()", imageRef);
      console.log("uploadedImage:", uploadedImage)
    } catch(error){
      console.error('Error downloading image:', error);
    }
  } 

  const goToImageUpload = () => {
    navigation.navigate('UploadScreen', { documentId, navigation }); // Pass the navigation prop
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
        {/* Centered image container */}
        <View style={styles.imageContainer}>
        {uploadedImage && renderImage()}
        </View>
      </View>
    </View>
  );
}

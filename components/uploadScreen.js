import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, SafeAreaView, Image, snapshot } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { db } from '../firebase/config.jsx';
import { styles } from '../styles';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase/config.jsx';
import { useCollection } from 'react-firebase-hooks/firestore';
import { updateDoc, doc } from 'firebase/firestore';





const UploadScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { navigation } = route.params; // Receive the navigation prop
  const { documentId } = route.params;
 


  const pickImage = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission denied for accessing photos.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
      } else {
        console.log('Image selection canceled or no image selected.');
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const uploadImage = async () => {
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      const storageRef = ref(storage, 'images/' + documentId + ".jpg"); 
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error => {
          console.error('Error uploading:', error);
          setUploading(false);
        },
        async () => {
          
          try {
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Update the document's data with the image URL
            const documentData = {
              imageURL: downloadURL,
            };

            // Update the document in Firestore
            const notebookDocRef = doc(db, 'notebook_doc', documentId);

            await updateDoc(notebookDocRef, documentData);

            console.log('Image uploaded');

            navigation.navigate('Page2' , { documentId: documentId, imageURL: downloadURL });
         
          } catch (error) {
            console.error('Error getting download URL:', error);
            setUploading(false);
          }

          
        },
      );
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
 
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} />
      <Pressable
        style={styles.selectButton}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>Image from docs</Text>
      </Pressable>

      <Pressable
        style={styles.useCameraButton}
      >
        <Text style={styles.buttonText} onPress={() => navigation.navigate("CameraScreen", {documentId: documentId})}>Use camera</Text>
      </Pressable>
    

      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.uploadedImage}
          />
        )}
        <Pressable
          style={styles.uploadButton}
          onPress={uploadImage}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UploadScreen;

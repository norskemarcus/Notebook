import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, Image, snapshot } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { db } from '../firebase/config.jsx';
import { styles } from '../styles';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
        // Handle the case where permission is not granted
        console.log('Permission denied for accessing photos.');
        return;
      }

      // Launch the image library
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
        // Handle the case where the user canceled or no image was selected
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
      const storageRef = ref(storage, 'images/' + documentId + ".jpg"); // new Date().getTime());  
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
          // Upload completed successfully

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

            // Try to send the imageURL back to 'Page2'
            // navigation.setOptions({
            //   screenName: 'Page2',
            //   params: { uploadedImage: downloadURL },
            // });

            console.log('Image uploaded');

            navigation.navigate('Page2', { uploadedImage: downloadURL });

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
  /*  const uploadImage = async () => {
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      const storageRef = ref(storage, 'images/' + new Date().getTime()); // Generate a unique path for each image

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);

      console.log('Image uploaded');
      setUploading(false);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Save the image URL to Firestore or associate it with the user/document
      // For example, you can save it to a 'profileImageURL' field in the user's document
      // Replace 'yourUserId' with the actual user ID
      const userId = 'yourUserId';
      const userDocRef = doc(db, 'users', userId);

      const userData = {
        profileImageURL: imageUrl, // Save the image URL here
      };

      // Update the user's document in Firestore with the image URL
      await updateDoc(userDocRef, userData);

      // Try to send the image back to 'Page2'
      navigation.navigate('Page2', { uploadedImage: imageUrl });
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
 */
  /*  try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = e => {
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
      const ref = db.storage().ref().child(filename).put(blob);

      await ref.put(blob);
      setUploading(false);
      console.log('Photo uploaded..'); // ---------------------> remove when it works
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }; */

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} />
      <Pressable
        style={styles.selectButton}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>Pick an Image</Text>
      </Pressable>

      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 300, height: 300 }}
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

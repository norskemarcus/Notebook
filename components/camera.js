import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import { styles } from '../styles';
import { Camera } from 'expo-camera';
// import { shareAsync } from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/FontAwesome';

// Imports to save to the database
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config.jsx';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.jsx';


const CameraScreen = ({ route, navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState();
  const { documentId } = route.params;
  

  let cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraPermission.status === 'granted');
  
    })();
  }, []);

  if (cameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!cameraPermission) {
    return <Text>Permission for the camera not granted.</Text>;
  }

  let takePic = async () => {
    
    if(cameraRef.current) {

      let options = {
        quality: 1, // highest quality
        base64: true,
        exif: false // extra info about the photo
      };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    }
  };

  if (photo) { // Check if a photo has been taken
   
    let savePhoto = async () => {
      // Call the uploadPhoto function to upload the saved photo to Firebase
      await uploadPhoto(documentId, photo.uri);
      setPhoto(undefined); // Clear the photo
      navigation.navigate('Page2', {documentId : documentId });
    };


    // Save the chosen photo from camera to the document
    const uploadPhoto = async (documentId, photoUri) => {
      try {
        const res = await fetch(photoUri);
        const blob = await res.blob();
        const storageRef = ref(storage, 'images/' + documentId + '.jpg');
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
    
              // You can navigate back to the previous screen or another screen
              // navigation.goBack(); // Example: navigate back
            } catch (error) {
              console.error('Error getting download URL:', error);
              setUploading(false);
            }
          }
        );
      } catch (error) {
        console.error(error);
        setUploading(false);
      }
    };
    




    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: `data:image/jpg;base64:${photo.base64}` }} />
       
        {cameraPermission && (
          <Pressable onPress={savePhoto} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        )}
        <Pressable onPress={() => setPhoto(undefined)} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.imageContainer} ref={cameraRef} ratio="16:9">
      <View style={styles.space}>
        <Pressable onPress={takePic} style={[styles.cameraButton, { marginTop: 20 }]}>
        <Icon name="camera" size={32} color="white" />
        </Pressable>
      </View>
    </Camera>
  );
};

export default CameraScreen;

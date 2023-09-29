import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Button, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase/config.jsx';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase/config.jsx';
import { updateDoc, doc } from 'firebase/firestore';



const CameraMobile = ({ navigation, route }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState();

  const [imageSaved, setImageSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress percentage
  
  const { documentId } = route.params;

  const permisionFunction = async () => {
 
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === 'granted');
    
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission for media access needed.');
    }
  };
  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  
  useEffect(() => {
    permisionFunction();
  }, []);


  const takePicture = async () => {
    if (camera) {
      const newPhoto = await camera.takePictureAsync({ skipProcessing: true }); // to speed up on Android devices
     setImageUri(newPhoto.uri);
    }
  };


  let savePhoto = async () => {
    try {
      await uploadPhoto(documentId, imageUri);
      setPhoto(undefined); // Clear the photo

      console.log("imageUri", imageUri);
     
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const uploadPhoto = async (documentId, imageUri) => {
    
    try {
      const res = await fetch(imageUri);
      const blob = await res.blob();
      const storageRef = ref(storage, `images/${documentId}.jpg`); 

      console.log("storageRef:", storageRef);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      setUploading(true); 

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setUploadProgress(progress); // Update upload progress

          if (progress === 100) {
            (async () => {
              try {
                const downloadURL = await getDownloadURL(storageRef);
                const documentData = {
                  imageURL: downloadURL,
                };

            
                const notebookDocRef = doc(db, 'notebook_doc', documentId);
                await updateDoc(notebookDocRef, documentData);

                console.log("downloadURL = ", downloadURL);

                console.log('Image uploaded');
  
                navigation.navigate('Page2', {
                  documentId: documentId,
                  imageURL: downloadURL,
                });
              }  catch (error) {
                console.error('Error getting download URL:', error);
                setUploading(false);
              }
            })();
          }
        },
        error => {
          console.error('Error uploading:', error);
          setUploading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  
 

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          onCameraReady={onCameraReady}
          type={type}
          ratio={'1:1'}
        />
         <View style={styles.cameraButtonContainer}>
            <Pressable onPress={takePicture} style={styles.cameraButton}>
            <Icon name="camera" size={32} color="white" disabled={!isCameraReady} />
            </Pressable>
          </View>
        
      </View>      
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ flex: 1 }}
        />
  
      )} 
      {/* "If imageUri has a truthy value (i.e., it's not null, undefined, false, 0, or an empty string), and imageSaved is false, then render the content inside the parentheses." */}
       {imageUri && !imageSaved && (
      <Pressable onPress={savePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    padding: 10,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
});


export default CameraMobile;

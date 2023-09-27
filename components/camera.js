import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import { styles } from '../styles';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config.jsx';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.jsx';
//import * as ImageManipulator from 'react-native-image-manipulator'; 



const CameraScreen = ({ route, navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState();
  const { documentId } = route.params;
  const [uploading, setUploading] = useState(false); // New state for tracking upload progress
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress percentage
  

  let cameraRef = useRef();

  // useEffect(() => {
  //   (async () => {
  //     const cameraPermission = await Camera.requestCameraPermissionsAsync();
    
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setCameraPermission(true);
        //setCameraPermission(cameraPermission.status === 'granted');
      } else {
        
        console.log('Camera permission denied');
      }
    })();
  }, []);


  if (cameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!cameraPermission) {
    return <Text>Please wait</Text>;
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

  if (photo) {
    let savePhoto = async () => {
      try {
        // Call the uploadPhoto function to upload the saved photo to Firebase
        await uploadPhoto(documentId, photo.uri);
        setPhoto(undefined); // Clear the photo
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    };

    // Save the chosen photo from camera to the document
    const uploadPhoto = async (documentId, photoUri) => {
      try {
        const res = await fetch(photoUri);
        const blob = await res.blob();
        const storageRef = ref(storage, `images/${documentId}.jpg`); // 'images/' + documentId + '.jpg'
        const uploadTask = uploadBytesResumable(storageRef, blob);

        setUploading(true); // Set uploading to true

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
    
                  console.log('Image uploaded');
    
                  navigation.navigate('Page2', {
                    documentId: documentId,
                    imageURL: downloadURL,
                  });
                } catch (error) {
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
    

    // Showing progress on screen
    if (uploading) {
          return (
            <SafeAreaView style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Uploading... {uploadProgress.toFixed(2)}%</Text>
            </SafeAreaView>
          );
    }



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
    <Camera style={styles.imageContainer} ref={cameraRef} ratio={'1:1'}>
      <View style={styles.space}>
        <Pressable onPress={takePic}>
        <Icon name="camera" size={32} color="white" />
        </Pressable>
      </View>
    </Camera>
  );
};

export default CameraScreen;

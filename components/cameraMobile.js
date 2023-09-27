import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Button, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';



const CameraMobile = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageSaved, setImageSaved] = useState(false);

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
      const data = await camera.takePictureAsync({ skipProcessing: true }); // to speed up on Android devices
      console.log(data.uri);
      setImageUri(data.uri);
    }
  };


  let savePhoto = async () => {
    try {
      // Call the uploadPhoto function to upload the saved photo to Firebase
      //await uploadPhoto(documentId, photo.uri);
      //setPhoto(undefined); // Clear the photo
      console.log("Photo is saved - TEST ONLY")
    } catch (error) {
      console.error('Error saving photo:', error);
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
      </View>
      <Button
        title={'Take Picture'}
        onPress={takePicture}
        disabled={!isCameraReady}
      />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ flex: 1 }}
        />
      )}
       {imageUri && !imageSaved && (
      <Pressable onPress={savePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    )}
    {imageSaved && (
      <Pressable onPress={() => navigation.navigate('Page2')}>
        <Icon name="check-circle" size={32} color="green" />
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
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});


export default CameraMobile;

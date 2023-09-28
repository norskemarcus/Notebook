import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 16,
   
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 20,
  },
  editIcon: {
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 18,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingHorizontal: 10, // Use a percentage of the screen width
    width: '100%', // Ensure it takes the full width
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, 
    //paddingHorizontal: 16,
    paddingHorizontal: 0.04 * width,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 6,
    //padding: 10,
    padding: 0.02 * width,
    backgroundColor: 'transparent',
    width: '70%', // Use a percentage of the input container's width

  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  contentInput: {
    fontSize: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#ffffff',
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#393c39',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    fontSize: 16,
    width: '60%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    userSelect: 'text',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#3079d1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',  
  },
  plusButton: {
    backgroundColor: 'transparent',
  },
  goalsContainer: {
    marginTop: 20,
  },
  goalItem: {
    width: 'auto',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  goalText: {
    color: '#393c39',
    fontSize: 16,
  },
  goalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, 
  },
  trashIcon: {
    alignSelf: 'flex-end', // Align the trash icon to the right edge
  },
  flatList: {
    flexGrow: 1, // Ensure the FlatList takes available vertical space
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  selectButton: {
    borderRadius: 5,
    width: 200,
    height: 50,
    backgroundColor: '#4e7ecc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10
  },
  useCameraButton: {
    borderRadius: 5,
    width: 200,
    height: 50,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10
  },
  useCameraMobileButton: {
    borderRadius: 5,
    width: 200,
    height: 50,
    backgroundColor: '#e28743', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10
  },
  saveIconButton: {
    borderRadius: 5,
    width: 50,
    height: 50,
    backgroundColor: '#50a182',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
  },
  space: {
    flex : 1,
    marginTop: 60
  },
  uploadedImage: {
    width: 200, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    resizeMode: 'contain', // You can change the resizeMode as per your requirements
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#50a182',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  centeredImage: {
    width: '100%', // Occupy the full width of the container
    aspectRatio: 1, // Preserve the aspect ratio (1:1 for square images)
    resizeMode: 'contain', // Maintain the image's aspect ratio and fit it within the container
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0', // Background color for the placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Border color for the placeholder
    marginTop: 20,
  },
  
  imagePlaceholderText: {
    fontSize: 16,
    marginTop: 8,
    color: '#50a182', // Text color for the "Add an image" text
  },
  changePictureButton: {
    backgroundColor: 'transparent', 
    padding: 5, 
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainerCamera: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  preview: {
    flex: 1,
    alignSelf: 'stretch'
  }
});

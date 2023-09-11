import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  appContainer: {
    // flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 50,
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
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 6,
    padding: 10,
  },
  contentInput: {
    fontSize: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 6,
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#393c39',
    width: '70%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    fontSize: 16,
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
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusButton: {
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  goalsContainer: {
    marginTop: 20,
    // MORE HERE??
  },
  goalItem: {
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
    flexDirection: 'row', // Add this property to display title and delete icon horizontally
    justifyContent: 'space-between', // Optional: to align them at the ends
    alignItems: 'center', // Optional: to vertically align them
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
});
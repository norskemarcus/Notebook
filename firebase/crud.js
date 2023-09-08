// docs: https://firebase.google.com/docs/firestore/quickstart
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, Modal } from 'react-native';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore'; // very nice !
import { database } from './firebase/config.jsx';

// Firebase CRUD -------------

export default function App() {
  const [text, setText] = useState('');
  const [editObject, setEditobject] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // a hook, similar to useState
  const [values, loading, error] = useCollection(collection(database, 'notes'));

  const data = values?.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  // above we use optional chaining (?) to handle the case, when Firebase has not replied yet.
  async function addDocument() {
    await addDoc(collection(database, 'notes'), {
      text: text,
    });
    setText(''); // clear the input field
  }

  async function deleteDocument(id) {
    deleteDoc(doc(database, 'notes', id));
  }

  function updateDocument(index) {
    setEditobject(data[index]);
    setModalVisible(!modalVisible);
  }

  async function saveUpdate() {
    updateDoc(doc(database, 'notes', editObject.id), {
      text: text,
    });
    setModalVisible(!modalVisible);
  }
  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        onDismiss={() => {
          // clear InputText when modal is closed
          setText('');
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            defaultValue={editObject.text}
            onChangeText={txt => setText(txt)}
          />
          <Button
            title='Save'
            onPress={saveUpdate}
          />
          <Button
            title='Cancel'
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </Modal>
      <Button
        title='Add document'
        onPress={addDocument}
      />
      <TextInput
        placeholder='type here'
        value={text}
        onChangeText={txt => setText(txt)}
      />
      <FlatList
        data={data}
        renderItem={item => (
          <View style={styles.row}>
            <Text>{item.item.text}</Text>
            <Button
              title='Edit'
              onPress={() => updateDocument(item.index)}
            />
            <Button
              title='Delete'
              onPress={() => deleteDocument(item.item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    marginTop: 100,
    maxHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
});

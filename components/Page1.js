import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { styles } from "../styles";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

export default function Page1({ navigation, route }) {
  // useState = react native hook, en mekanisme man kan hekte sig på. Lidt som en session.
  const [titleInput, setTitleInput] = useState(""); // gemme blankt først
  const [documents, setDocuments] = useState([]);

  const messageBack = route.params?.messageBack; // value sent from page2 component

  // const [messageBack, setMessageBack] = useState(""); // State for the messageBack parameter

  // Use useEffect to update data when coming back from Page 2
  useEffect(() => {
    if (route.params?.updatedDocument) {
      const updatedDocument = route.params.updatedDocument;

      // Update the documents array with the updated document
      setDocuments((prevDocuments) => prevDocuments.map((doc) => (doc.title === updatedDocument.title ? updatedDocument : doc)));
    }
  }, [route.params?.updatedDocument]);

  const addDocument = () => {
    if (titleInput.trim() === "") {
      return;
    }
    // Add a new document with the entered title
    setDocuments([...documents, { title: titleInput }]);
    setTitleInput("");
  };

  return (
    <View style={[styles.appContainer, styles.pageContainer]}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} value={titleInput} placeholder="Enter document title" onChangeText={setTitleInput} />
        <Pressable style={styles.plusButton} onPress={addDocument}>
          <Icon name="plus" size={24} color="#3079d1" />
        </Pressable>
      </View>
      <ScrollView style={styles.goalsContainer}>
        {documents.map((doc) => (
          <View style={styles.goalItem} key={doc.title}>
            <Text style={styles.goalText} onPress={() => navigation.navigate("Back", { document: doc })}>
              {doc.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "../styles";

export default function Page2({ navigation, route }) {
  const document = route.params?.document; // optional chaining to handle case when route is null

  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(""); // Add content state for the document content
  const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode

  const [reply, setReply] = useState("Empty");

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveChanges = () => {
    setIsEditMode(false);

    if (document) {
      document.title = title;
      document.content = content;
    }

    navigation.navigate({ name: "Notebook", params: { messageBack: title } });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setTitle(initialTitle);
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleEdit} style={styles.editIcon}>
          <Icon name="edit" size={24} color="#3079d1" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>

      {isEditMode ? (
        <View>
          <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} />
          <TextInput style={styles.contentInput} value={content} onChangeText={setContent} multiline />
        </View> // multiline = true allows textinput to accept multipile lines of text input
      ) : (
        <Text style={styles.contentText}>{content}</Text>
      )}

      {isEditMode && (
        <View style={styles.editButtonsContainer}>
          <Pressable onPress={handleSaveChanges} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
          <Pressable onPress={handleCancelEdit} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Notebook from "./components/Page1.js";
import Back from "./components/Page2.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [documents, setDocuments] = useState([]);

  // Store the current note state in the parent component
  const [currentNote, setCurrentNote] = useState({ title: "", content: "" });

  const handleSaveNote = (updatedNote) => {
    setCurrentNote(updatedNote);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Notebook" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Notebook">
          {(props) => (
            <Notebook
              {...props}
              documents={documents}
              currentNote={currentNote} // Pass the current note to Page1
              handleSaveNote={handleSaveNote}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Back">
          {(props) => (
            <Back
              {...props}
              currentNote={currentNote} // Pass the current note to Page2
              handleSaveNote={handleSaveNote}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

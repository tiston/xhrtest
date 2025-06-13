import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadMedia, uploadMedia2 } from "./helpers";
import * as FileSystem from "expo-file-system";

const App = () => {
  const [singleFile, setSingleFile] = useState<any>(null);

  const uploadImage = async () => {
    try {
      console.log("upload");
      // Check if any file is selected or not
      const uploadUrl = `http://192.168.0.21:3000/api/upload`;
      if (singleFile != null) {
        await uploadMedia(singleFile, uploadUrl, {});
      } else {
        // If no file selected the show alert
        alert("Please Select File first");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    console.log(result);
    if (result && result.assets?.[0]) {
      const file = result.assets[0];
      const fileUri = file.uri;
      const mimeType = file.mimeType || "application/octet-stream"; // à adapter
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      const fileForFormData = {
        uri: fileUri,
        name: file.name,
        type: mimeType,
        size: (fileInfo as any).size,
      };
      setSingleFile(fileForFormData);
    }
  };

  console.log(singleFile);

  return (
    <View style={styles.mainBody}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 30, textAlign: "center" }}>
          React Native File Upload Example
        </Text>
        <Text
          style={{
            fontSize: 25,
            marginTop: 20,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          www.aboutreact.com
        </Text>
      </View>
      {/*Showing the data of selected Single file*/}
      <Button title="open file" onPress={pickDocument} />
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={uploadImage}
      >
        <Text style={styles.buttonTextStyle}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: "#307ecc",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307ecc",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: "#fff",
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: "center",
  },
});

export default App;

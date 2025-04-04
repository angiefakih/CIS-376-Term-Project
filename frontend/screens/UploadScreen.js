import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function UploadScreen({ navigation, route }) {
  const user_id = route.params?.user_id;

  const [imageUri, setImageUri] = useState(route.params?.image || '');
  const [category, setCategory] = useState(route.params?.category || '');
  const [color, setColor] = useState(route.params?.color || '');
  const [brand, setBrand] = useState(route.params?.brand || '');
  const [season, setSeason] = useState(route.params?.season || '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !category) {
      Alert.alert("Missing info", "Please pick an image and enter a category.");
      return;
    }

    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const clothingData = {
        user_id,
        image_data: base64Image,
        category,
        color,
        brand,
        season
      };

      const response = await fetch('http://192.168.68.115:5000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clothingData)
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Confirmation', { ...clothingData, image: `http://192.168.68.115:5000${data.image_path}` });
      } else {
        navigation.navigate('Retry', { ...clothingData });
      }
    } catch (error) {
      console.error("Upload error:", error);
      navigation.navigate('Retry', { user_id, image: imageUri, category, color, brand, season });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Clothing Item</Text>

      <Button title="Pick Image from Files" onPress={pickImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginVertical: 10 }} />
      ) : null}

      <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />
      <TextInput placeholder="Color" style={styles.input} value={color} onChangeText={setColor} />
      <TextInput placeholder="Brand" style={styles.input} value={brand} onChangeText={setBrand} />
      <TextInput placeholder="Season" style={styles.input} value={season} onChangeText={setSeason} />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5 }
});

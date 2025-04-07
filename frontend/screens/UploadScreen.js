import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import backgroundImage from '../assets/images/luxe-fabric.png';

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
    if (!imageUri || !category || !color || !brand || !season) {
      Alert.alert("Missing info", "Please complete all fields and pick an image.");
      return;
    }

    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const clothingData = { user_id, image_data: base64Image, category, color, brand, season };

      const response = await fetch('http://192.168.0.108:5000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clothingData)
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Confirmation', { ...clothingData, image: `http://192.168.0.108:5000${data.image_path}` });
      } else {
        navigation.navigate('Retry', { ...clothingData });
      }
    } catch (error) {
      console.error("Upload error:", error);
      navigation.navigate('Retry', { user_id, image: imageUri, category, color, brand, season });
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <LinearGradient colors={['rgb(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Upload Item</Text>

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <FontAwesome name="image" size={20} color="#fff" />
            <Text style={styles.pickerText}>Pick Image</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          <TextInput placeholder="Category" style={styles.input} placeholderTextColor="#ccc" value={category} onChangeText={setCategory} />
          <TextInput placeholder="Color" style={styles.input} placeholderTextColor="#ccc" value={color} onChangeText={setColor} />
          <TextInput placeholder="Brand" style={styles.input} placeholderTextColor="#ccc" value={brand} onChangeText={setBrand} />
          <TextInput placeholder="Season" style={styles.input} placeholderTextColor="#ccc" value={season} onChangeText={setSeason} />

          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#F5ECD7',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: '#666',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 15,
    fontSize: 15,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 12,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  pickerText: {
    color: '#F5F5DC',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  previewImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  uploadButton: {
    backgroundColor: '#3A3A3A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  uploadText: {
    color: '#EFE6DA',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

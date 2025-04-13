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
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import backgroundImage from '../assets/images/loginbackground.jpg';
import { API_URL } from '../config';

export default function UploadScreen({ navigation, route }) {
  const user_id = route.params?.user_id;

  const [imageUri, setImageUri] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [season, setSeason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setImageUri('');
    setCategory('');
    setColor('');
    setBrand('');
    setSeason('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
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

    setIsLoading(true);

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
        season,
      };

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clothingData),
      });

      const data = await response.json();

      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Your item has been uploaded.", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              navigation.navigate('Confirmation', {
                ...clothingData,
                image: `${API_URL}${data.image_path}`,
              });
            },
          },
        ]);
      } else {
        Alert.alert("Upload failed", data.error || "Something went wrong.");
        navigation.navigate('Retry', { ...clothingData });
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Failed to upload.");
      navigation.navigate('Retry', {
        user_id,
        image: imageUri,
        category,
        color,
        brand,
        season,
      });
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome name="arrow-left" size={20} color="#F5F5DC" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Upload Item</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <FontAwesome name="image" size={20} color="#F5F5DC" />
              <Text style={styles.pickerText}>Pick Image</Text>
            </TouchableOpacity>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            <View style={styles.fieldGroup}>
              <View style={styles.radioGroup}>
              <Text style={styles.radioGroupLabel}>Category</Text>
              <View style={styles.radioOptions}>
                {['Tops', 'Bottoms', 'Shoes'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setCategory(option)}
                    style={[
                      styles.radioButton,
                      category === option && styles.radioButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        category === option && styles.radioTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

</View>
            <TextInput
              placeholder="Color"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={color}
              onChangeText={setColor}
            />
            <TextInput
              placeholder="Brand"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={brand}
              onChangeText={setBrand}
            />
            <TextInput
              placeholder="Season"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={season}
              onChangeText={setSeason}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color="#F5F5DC" style={{ marginVertical: 20 }} />
            ) : (
              <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#F5F5DC',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  title: {
    fontSize: 26,
    color: '#F5F5DC',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5F5DC',
  },
  pickerText: {
    color: '#F5F5DC',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
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
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#F5F5DC',
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20, 
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderColor: '#F5F5DC',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  uploadText: {
    color: '#F5F5DC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  
  radioGroup: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: '#F5F5DC',
    borderWidth: 1,
    padding: 12,
  },
  
  radioGroupLabel: {
    color: '#F5F5DC',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  radioOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  radioButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#F5F5DC',
  },
  
  radioButtonSelected: {
    backgroundColor: '#F5F5DC',
  },
  
  radioText: {
    color: '#F5F5DC',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 16,
    fontWeight: '600',
  },
  
  radioTextSelected: {
    color: '#000',
  },
  
  
  
});

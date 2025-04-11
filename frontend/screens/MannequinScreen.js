import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import backgroundImage from '../assets/images/loginbackground.jpg'; 

export default function MannequinScreen() {
  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Style Your Mannequin</Text>

          <Image
            source={require('../assets/images/mannequin-placeholder.jpg')} 
            style={styles.mannequin}
          />

          <Text style={styles.subtitle}>Coming Soon</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.styleButton}>
              <FontAwesome5 name="tshirt" size={18} color="#fff" />
              <Text style={styles.buttonText}>Add Top</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleButton}>
              <FontAwesome5 name="shoe-prints" size={18} color="#fff" />
              <Text style={styles.buttonText}>Add Shoes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleButton}>
              <FontAwesome5 name="hat-cowboy" size={18} color="#fff" />
              <Text style={styles.buttonText}>Add Accessory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F5ECD7',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 10,
    marginBottom: 30,
  },
  mannequin: {
    width: 180,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  styleButton: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  buttonText: {
    color: '#EFE6DA',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
});

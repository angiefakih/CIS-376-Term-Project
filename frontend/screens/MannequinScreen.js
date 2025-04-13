import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PantsIcon from '../assets/icons/trousers.png';
import JacketIcon from '../assets/icons/jacket.png';




export default function MannequinScreen() {
  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Style Your Mannequin</Text>

        <Text style={styles.subtitle}>Coming Soon</Text>

     <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.styleButton}>
          <FontAwesome5 name="tshirt" size={18} color="#3B3A39" />
          <Text style={styles.buttonText}>Add Top</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.styleButton}>
           <Image source={PantsIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Add Bottoms</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.styleButton}>
          <FontAwesome5 name="shoe-prints" size={18} color="#3B3A39" />
          <Text style={styles.buttonText}>Add Shoes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.styleButton}>
          <Image source={JacketIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Add Outerwear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.styleButton}>
          <FontAwesome5 name="hat-cowboy" size={18} color="#3B3A39" />
          <Text style={styles.buttonText}>Add Accessory</Text>
        </TouchableOpacity>
        
      </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F9F7F3', 
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3B3A39',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  styleButton: {
    backgroundColor: '#ffffffee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#3B3A39',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#3B3A39', 
    resizeMode: 'contain',
  },
  
});

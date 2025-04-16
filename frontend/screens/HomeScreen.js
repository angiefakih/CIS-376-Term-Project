import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import backgroundImage from '../assets/images/loginbackground.jpg';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native'; 

export default function HomeScreen({ navigation, route }) {
  const user_id = route.params?.user_id;

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => navigation.replace("Login"),
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.darkOverlay}>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#F5F5DC" />
        </TouchableOpacity>


        <View style={styles.container}>
          <Text style={styles.title}>Welcome to your Closet Companion</Text>

          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Upload', { user_id })}>
              <FontAwesome5 name="upload" size={22} color="#F5F3EF" />
              <Text style={styles.gridText}>Upload Item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Wardrobe', { user_id })}>
              <Feather name="grid" size={22} color="#F5F3EF" />
              <Text style={styles.gridText}>View Wardrobe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Mannequin', { user_id })}>
              <MaterialCommunityIcons name="human-female" size={22} color="#F5F3EF" />
              <Text style={styles.gridText}>Style Mannequin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('PlanOutfit',{ user_id })}>
              <FontAwesome5 name="calendar-check" size={22} color="#F5F3EF" />
              <Text style={styles.gridText}>Plan Outfit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',   
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F5F3EF',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridButton: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F5F3EF',
    padding: 10,
  },
  gridText: {
    color: '#F5F3EF',
    fontSize: 15,
    marginTop: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 70,
    left: 20, 
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F5F5DC',
    zIndex: 10,
  }  
});
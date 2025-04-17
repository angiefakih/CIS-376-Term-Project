import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Platform
} from 'react-native';
import backgroundImage from '../assets/images/loginbackground.jpg';
import { API_URL } from '../config';


export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const BACKEND_URL = 'http://192.168.0.109:5000';
  
  const allowedDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@hotmail.com",
    "@icloud.com",
    "@umich.edu"
  ];
  
  const isValidEmail = (email) => {
    return allowedDomains.some(domain => email.endsWith(domain));
  };
  
  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please use a valid email domain (e.g., gmail.com)");
      return;
    }
  
    if (password.length < 5) {
      Alert.alert("Weak Password", "Password must be at least 5 characters long.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Account created successfully", [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate('Login')
          }
        ]);
      } else {
        Alert.alert("Error", data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create an Account</Text>

          <TextInput
            placeholder="First Name"
            style={styles.input}
            placeholderTextColor="#ccc"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            placeholder="Last Name"
            style={styles.input}
            placeholderTextColor="#ccc"
            value={lastName}
            onChangeText={setLastName}
          />


          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 24,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#F5F5DC',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#F5F5DC',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 15,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

 
  button: {
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
  buttonText: {
    color: '#F5F5DC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  linkText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

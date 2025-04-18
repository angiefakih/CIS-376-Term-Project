import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

const { manifest2, manifest } = Constants;

// Get the backend IP depending on the platform
const backendHost =
  Platform.OS === 'web'
    ? 'localhost'
    : Constants.expoConfig?.hostUri?.split(':')[0];
const BACKEND_URL = `http://${backendHost}:5000`;

import backgroundImage from '../assets/images/loginbackground.jpg';

export default function LoginScreen() {
  // Setup state and navigation tools
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const messageTimerRef = useRef(null);

  // Shows a message for a few seconds
  const showMessage = (text, color) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(null);
    setTimeout(() => {
      setMessage({ text, color });
      messageTimerRef.current = setTimeout(() => {
        setMessage(null);
      }, 5000);
    }, 0);
  };

  // Clears input when screen is focused
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setMessage(null);
    }, [])
  );

  // Show success message if sign up was successful
  useEffect(() => {
    if (route?.params?.signupSuccess) {
      showMessage("Account created successfully.", "green");
    }
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [route]);

  // Sends login request to backend
  const handleLogin = async () => {
    if (!email || !password) {
      showMessage("Email/Password Empty", "red");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user_id = data.user_id;
        navigation.navigate("Home", { user_id });
      } else {
        showMessage("Email/Password is Incorrect", "red");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    // Background image wrapper
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">

      {/* Keyboard avoiding view for mobile input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.inner}>

          {/* Login form box with styling */}
          <View style={styles.blurBox}>
            {/* Title text */}
            <Text style={styles.title}>Welcome Back</Text>
            {/* Show login or signup success/failure message */}
            {message?.text && (
              <Text style={[styles.messageText, { color: message.color }]}>
                {message.text}
              </Text>
            )}
            {/* Email input */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {/* Password input */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {/* Login button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            {/* Link to sign-up screen */}
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.linkWrapper}>
              <Text style={styles.linkText}>Don’t have an account? <Text style={{ fontWeight: 'bold' }}>Sign up</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
  },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  blurBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "700",
    fontFamily: 'serif',
    color: "#f2f2f2",
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    color: '#f5f5f5',
  },
  button: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#111",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600"
  },
  linkWrapper: {
    alignSelf: 'center',
    marginTop: 16,
  },
  linkText: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  messageText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

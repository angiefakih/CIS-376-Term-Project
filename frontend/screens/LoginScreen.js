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
const backendHost =
  Platform.OS === 'web'
    ? 'localhost'
    : Constants.expoConfig?.hostUri?.split(':')[0];
const BACKEND_URL = `http://${backendHost}:5000`;

import backgroundImage from '../assets/images/closetbackground.png';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const messageTimerRef = useRef(null);

  const showMessage = (text, color) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setMessage(null);

    setTimeout(() => {
      setMessage({ text, color });

      messageTimerRef.current = setTimeout(() => {
        setMessage(null);
        messageTimerRef.current = null;
      }, 5000);
    }, 0);
  };

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setMessage(null); // ✅ Clear message on screen refocus
    }, [])
  );

  useEffect(() => {
    if (route?.params?.signupSuccess) {
      showMessage("Account created successfully.", "green");
    }
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, [route]);

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
        navigation.navigate("Home");
      } else {
        showMessage("Email/Password is Incorrect", "red");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Login</Text>

          {message?.text ? (
            <Text style={[styles.messageText, { color: message.color }]}>
              {message.text}
            </Text>
          ) : null}

          <TextInput
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.linkWrapper}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
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
  },
  inner: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  },
  linkWrapper: {
    alignSelf: 'center',
    marginTop: 10,
  },
  linkText: {
    color: "#000",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  messageText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

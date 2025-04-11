import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

//const { manifest2, manifest } = Constants;
//const backendHost =
  //Platform.OS === 'web'
   // ? 'localhost'
   // : Constants.expoConfig?.hostUri?.split(':')[0];
    const BACKEND_URL = 'http://192.168.68.66:5001'; // ← use your actual IP here

import backgroundImage from '../assets/images/loginbackground.jpg';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
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
      setFirstName('');
      setLastName('');
      setGender('');
      setMessage(null); 
    }, [])
  );

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName || !gender) {
      showMessage("Please fill in all fields.", "red");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          gender
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate("Login", { signupSuccess: true });
      } else {
        showMessage(data.error || "Email is already in use.", "red");
      }
    } catch (error) {
      console.error(error);
      showMessage("Failed to connect to server.", "red");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Sign Up</Text>

          {message?.text ? (
            <Text style={[styles.messageText, { color: message.color }]}>
              {message.text}
            </Text>
          ) : null}

          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === "Male" && styles.genderSelected]}
              onPress={() => setGender("Male")}
            >
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === "Female" && styles.genderSelected]}
              onPress={() => setGender("Female")}
            >
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>

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

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkWrapper}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
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
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  genderButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
  },
  genderSelected: {
    backgroundColor: "#444",
  },
  genderText: {
    color: "#fff",
  },
  messageText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

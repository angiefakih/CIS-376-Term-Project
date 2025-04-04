import React, { useState } from 'react';
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
import { useRouter } from 'expo-router'; // ✅ Navigation

// ✅ Make sure this file exists at: assets/images/closetbackground.jpg
import backgroundImage from '../../assets/images/closetbackground.png';

export default function App() {
  const router = useRouter(); // ✅ Init router

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const BACKEND_URL = "http://192.168.0.103:5000"; // ✅ Replace with your backend IP

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (isSignup && (!firstName || !lastName || !gender)) {
      Alert.alert("Error", "Please fill in all signup fields.");
      return;
    }

    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup
            ? { email, password, first_name: firstName, last_name: lastName, gender }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);

        // ✅ Navigate to dashboard with username param (adjust key if needed)
        router.replace({
          pathname: '/dashboard',
          params: {
            username: data.first_name || email.split('@')[0] // fallback if backend doesn't return name
          }
        });
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>

          {isSignup && (
            <>
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
                  style={[
                    styles.genderButton,
                    gender === "Male" && styles.genderSelected,
                  ]}
                  onPress={() => setGender("Male")}
                >
                  <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Female" && styles.genderSelected,
                  ]}
                  onPress={() => setGender("Female")}
                >
                  <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isSignup ? "Create Account" : "Log In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.toggleText}>
              {isSignup
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </Text>
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
    marginBottom: 30,
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
  toggleText: {
    color: "#555",
    textAlign: "center",
    marginTop: 10,
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
});

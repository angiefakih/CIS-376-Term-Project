// config.js
import Constants from 'expo-constants';

// Dynamically gets your local IP when in Expo dev mode
const LOCAL_IP = Constants.manifest?.debuggerHost?.split(':').shift() || '192.168.0.109';

export const API_URL = `http://${LOCAL_IP}:5000`;

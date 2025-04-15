import Constants from 'expo-constants';

let LOCAL_IP;

// Try debuggerHost first
if (Constants.manifest?.debuggerHost) {
  LOCAL_IP = Constants.manifest.debuggerHost.split(':').shift();
}
// Else try expoConfig.hostUri
else if (Constants.expoConfig?.hostUri) {
  LOCAL_IP = Constants.expoConfig.hostUri.split(':').shift();
}
// Else hardcode as fallback
// else {
//   LOCAL_IP = '192.168.xx.xxx'; // <-- manually set if needed
// }

export const API_URL = `http://${LOCAL_IP}:5000`;
console.log("🌐 API_URL:", API_URL);
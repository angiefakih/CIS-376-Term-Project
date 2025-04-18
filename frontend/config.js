import Constants from 'expo-constants';

let LOCAL_IP;

// Try debuggerHost first
if (Constants.manifest?.debuggerHost) {
  LOCAL_IP = Constants.manifest.debuggerHost.split(':').shift();
}
// Try expoConfig.hostUri
else if (Constants.expoConfig?.hostUri) {
  LOCAL_IP = Constants.expoConfig.hostUri.split(':').shift();
}
// Hardcode
// else {
//   LOCAL_IP = '192.168.xx.xxx'; //manually set
// }

export const API_URL = `http://${LOCAL_IP}:5000`;

import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function Dashboard() {
  const router = useRouter();
  const { username } = useLocalSearchParams(); // optional: gets ?username=Ahmad

  const handleLogout = () => {
    // Add logout logic if needed (clear token, etc.)
    router.replace('/'); // goes back to login or home screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {username || 'Fashionista'}! 👗</Text>

      <View style={styles.buttonGroup}>
        <Button title="👕 View Wardrobe" onPress={() => router.push('/wardrobe')} />
        <Button title="📷 Upload Clothing" onPress={() => router.push('/upload')} />
        <Button title="🧍 Dress Mannequin" onPress={() => router.push('/mannequin')} />
        <Button title="📅 Plan Outfit" onPress={() => router.push('/plan')} />
        <Button color="#d9534f" title="🚪 Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 20,
  },
});

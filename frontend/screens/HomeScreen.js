import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const user_id = route.params?.user_id;

  return (
    <View style={styles.container}>
      <Button title="Upload Clothing" onPress={() => navigation.navigate('Upload', { user_id })} />
      <View style={styles.space} />
      <Button title="View Wardrobe" onPress={() => navigation.navigate('Wardrobe', { user_id })} />
      <View style={styles.space} />
      <Button title="Dress Mannequin" onPress={() => navigation.navigate('Mannequin')} />
      <View style={styles.space} />
      <Button title="Plan Outfit" onPress={() => navigation.navigate('PlanOutfit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  space: { height: 20 }
});

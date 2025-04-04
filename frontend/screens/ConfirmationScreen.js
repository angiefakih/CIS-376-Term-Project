import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ConfirmationScreen({ route }) {
  const { image, category, color, brand, season } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Successful! ✅</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <Text>Category: {category}</Text>
      <Text>Color: {color}</Text>
      <Text>Brand: {brand}</Text>
      <Text>Season: {season}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 150, height: 150, marginBottom: 10 }
});

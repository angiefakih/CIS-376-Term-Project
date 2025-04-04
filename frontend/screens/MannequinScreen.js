import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MannequinScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dress the Mannequin (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20 }
});

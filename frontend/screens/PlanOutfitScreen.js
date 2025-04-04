import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlanOutfitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Outfit for Future (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20 }
});

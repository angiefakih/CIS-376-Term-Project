import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function RetryScreen({ navigation, route }) {
  const { user_id, image, category, color, brand, season } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Failed</Text>
      <Text>Please try again.</Text>
      <Button
        title="Try Again"
        onPress={() =>
          navigation.navigate('Upload', {
            user_id,
            image,
            category,
            color,
            brand,
            season
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
});

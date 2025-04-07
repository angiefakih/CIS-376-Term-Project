import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

export default function WardrobeScreen({ route }) {
  const [items, setItems] = useState([]);
  const user_id = route.params?.user_id;

  useEffect(() => {
    fetch(`http://192.168.60.103:5000/wardrobe/${user_id}`)
      .then(res => res.json())
      .then(setItems)
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: `http://192.168.0.103:5000${item.image}` }} style={styles.image} />
            <Text>{item.category} - {item.color}</Text>
            <Text>{item.brand}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, alignItems: 'center' },
  image: { width: 100, height: 100, marginBottom: 5 }
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Platform
} from 'react-native';
import backgroundImage from '../assets/images/loginbackground.jpg';

export default function PlanOutfitScreen({ route }) {
  const user_id = route.params?.user_id;
  const [plannedOutfits, setPlannedOutfits] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.68.93:5000/planned-outfits/${user_id}`)
      .then(res => res.json())
      .then(data => {
        console.log("📝 Planned outfits:", data);
        setPlannedOutfits(data);
      })
      .catch(err => console.error("❌ Fetch failed:", err));
  }, []);

  const renderOutfit = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.occasion}</Text>
        <Text style={styles.subtitle}>{item.date || 'No Date'}</Text>

        <View style={styles.imageRow}>
          {item.top && <Image source={{ uri: item.top }} style={styles.image} />}
          {item.bottom && <Image source={{ uri: item.bottom }} style={styles.image} />}
          {item.shoes && <Image source={{ uri: item.shoes }} style={styles.image} />}
        </View>

        {!item.top && <Text style={styles.outfitText}>Top: ❌</Text>}
        {!item.bottom && <Text style={styles.outfitText}>Bottom: ❌</Text>}
        {!item.shoes && <Text style={styles.outfitText}>Shoes: ❌</Text>}
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <FlatList
          data={plannedOutfits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOutfit}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  outfitText: {
    fontSize: 14,
    color: '#444',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

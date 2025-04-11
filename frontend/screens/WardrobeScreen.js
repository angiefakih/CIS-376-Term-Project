import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import backgroundImage from '../assets/images/loginbackground.jpg';

export default function WardrobeScreen({ route }) {
  const [items, setItems] = useState([]);
  const user_id = route.params?.user_id;

  useEffect(() => {
    fetch(`http://192.168.68.115:5000/wardrobe/${user_id}`)
      .then(res => res.json())
      .then(setItems)
      .catch(err => console.error(err));
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Wardrobe</Text>
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: `http://192.168.68.115:5000${item.image}` }}
                  style={styles.image}
                />
                <Text style={styles.text}>{item.category} - {item.color}</Text>
                <Text style={styles.text}>{item.brand}</Text>
              </View>
            )}
          />
        </View>
      </LinearGradient>
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
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: '#F5ECD7',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  text: {
    color: '#EAD9C7',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '../config';

export default function PlanOutfitScreen({ route, navigation }) {
  const user_id = route.params?.user_id;
  const [plannedOutfits, setPlannedOutfits] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user_id || !isFocused) return;

    fetch(`${API_URL}/planned-outfits/${user_id}`)
      .then(res => res.json())
      .then(data => {
        console.log("📝 Planned outfits:", data);
        setPlannedOutfits(data);
      })
      .catch(err => console.error("❌ Fetch failed:", err));
  }, [isFocused]);

  const handleDeleteOutfit = (outfitId) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/planned-outfits/${outfitId}`, {
                method: 'DELETE',
              });

              const result = await res.json();

              if (!res.ok) {
                throw new Error(result.error || 'Failed to delete outfit');
              }

              const updatedRes = await fetch(`${API_URL}/planned-outfits/${user_id}`);
              const updatedData = await updatedRes.json();

              setPlannedOutfits(updatedData);
            } catch (err) {
              console.error('Delete failed:', err);
              Alert.alert('Error', 'Failed to delete the outfit.');
            }
          },
        },
      ]
    );
  };

  const renderOutfit = ({ item }) => {
    
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Mannequin', {
            user_id,
            outfit: {
              top: item.top,
              bottom: item.bottom,
              shoes: item.shoes,
              accessories: item.accessories,
            }
          });
        }}
        onLongPress={() => handleDeleteOutfit(item.id)}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{item.occasion}</Text>
          <Text style={styles.subtitle}>{item.date || 'No Date'}</Text>
  
          <View style={styles.imageRow}>
          {item.top?.uri && (
          <View style={styles.imageColumn}>
            <Image source={{ uri: item.top.uri }} style={styles.image} />
            <Text style={styles.imageLabel}>Top</Text>
          </View>
        )}

        {item.bottom?.uri && (
          <View style={styles.imageColumn}>
            <Image source={{ uri: item.bottom.uri }} style={styles.image} />
            <Text style={styles.imageLabel}>Bottom</Text>
          </View>
        )}

        {item.shoes?.uri && (
          <View style={styles.imageColumn}>
            <Image source={{ uri: item.shoes.uri }} style={styles.image} />
            <Text style={styles.imageLabel}>Shoes</Text>
          </View>
        )}

        {item.accessories?.uri && (
          <View style={styles.imageColumn}>
            <Image source={{ uri: item.accessories.uri }} style={styles.image} />
            <Text style={styles.imageLabel}>Acc.</Text>
          </View>
        )}

          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="#F5F5DC" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.screenTitle}>Planned Outfits</Text>

      {/* Outfit List */}
      <FlatList
        data={plannedOutfits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOutfit}
        contentContainerStyle={styles.list}
      />

      {/* Add Outfit Floating Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Mannequin', { user_id })}
        style={styles.fab}
      >
        <FontAwesome name="plus" size={20} color="#F5F5DC" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1C1A', // Espresso tone
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  screenTitle: {
    fontSize: 28,
    color: '#F5F5DC',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3C2F2F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A6E6E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#F8F6F2',
    borderRadius: 12,
    marginTop: 10,
  },
  imageColumn: {
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3C1B1',
    backgroundColor: '#fff',
    resizeMode: 'cover',
  },
  imageLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#7A6E6E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#F5F5DC',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

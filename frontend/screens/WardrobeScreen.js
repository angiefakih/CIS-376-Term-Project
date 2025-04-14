import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config'; 

export default function WardrobeScreen({ route, navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const user_id = route.params?.user_id;

  const categories = ['All', 'Tops', 'Bottoms', 'Shoes'];

  useEffect(() => {
    fetch(`${API_URL}/wardrobe/${user_id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  const handleEdit = (item) => {
    navigation.navigate('Upload', { ...item, image: `${API_URL}${item.image}`, user_id });
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this item from your wardrobe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_URL}/wardrobe/${itemId}`, {
                method: 'DELETE',
              });
              const updatedItems = items.filter(item => item.id !== itemId);
              setItems(updatedItems);
              handleFilter(selectedCategory); // reapply filter
            } catch (err) {
              console.error('Delete failed:', err);
              Alert.alert('Error', 'Failed to delete item.');
            }
          }
        }
      ]
    );
  };

  const handleCardLongPress = (item) => {
    Alert.alert(
      'Delete Item?',
      `${item.category} - ${item.color}\n${item.brand}`,
      [
        { text: 'Delete', onPress: () => handleDelete(item.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderChip = (category) => (
    <TouchableOpacity
      key={category}
      onPress={() => handleFilter(category)}
      style={[
        styles.chip,
        selectedCategory === category && styles.chipSelected
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selectedCategory === category && styles.chipTextSelected
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <TouchableOpacity onLongPress={() => handleCardLongPress(item)}>
          <Image
            source={{ uri: `${API_URL}${item.image}` }}
            style={styles.image}
          />
          <Text style={styles.text}>{item.category} - {item.color}</Text>
          <Text style={styles.text}>{item.brand}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={30} color="#3B3A39" />
      </TouchableOpacity>

        <Text style={styles.title}>Your Wardrobe</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipBar}>
          {categories.map(renderChip)}
        </ScrollView>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your wardrobe is empty.</Text>
            <Text style={styles.emptyText}>Tap the ➕ button to add your first item.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              paddingTop: 0,      
              marginTop: 0,       
            }}
            renderItem={renderItem}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Upload', { user_id })}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F9F7F3',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#3B3A39',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  chipBar: {
    marginBottom: 0,
    //backgroundColor: 'rgba(255, 0, 0, 0.1)', // test only
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    marginRight: 10,
    height: 36,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#3B3A39',
    borderColor: '#3B3A39',
  },
  chipText: {
    color: '#3B3A39',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  chipTextSelected: {
    color: '#fff',
  },
  grid: {
    paddingBottom: 80,
    paddingTop: 0, 
    marginTop: 0,    
    //backgroundColor: 'rgba(255, 0, 0, 0.1)', // optional test
  },
  
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
    alignItems: 'center',
    width: '48%',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    color: '#3B3A39',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#3B3A39',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
    marginBottom: 6,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 10,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  
});

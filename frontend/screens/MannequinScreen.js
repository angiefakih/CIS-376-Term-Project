import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PantsIcon from '../assets/icons/trousers.png';
import Constants from 'expo-constants';

const { manifest2, manifest } = Constants;
const backendHost = Platform.OS === 'web'
  ? 'localhost'
  : Constants.expoConfig?.hostUri?.split(':')[0];
const BACKEND_URL = `http://${backendHost}:5000`;


export default function MannequinScreen({ navigation, route }) {
  const user_id = route?.params?.user_id || null;
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);
  const [isMale, setIsMale] = useState(true);
  const [occasion, setOccasion] = useState('');
  const [date, setDate] = useState('');
  const [planModalVisible, setPlanModalVisible] = useState(false);

  const [selectedClothes, setSelectedClothes] = useState({
    top: null,
    shoes: null,
    bottom: null,
  });

  const handleSelectClothing = (item) => {
    setSelectedClothes((prev) => ({
      ...prev,
      [selectedCategory]: item.image_path
        ? { uri: item.image_path } // from wardrobe database
        : item.image,              // from local hardcoded images
    }));
    setActionHistory((prev) => [...prev, selectedCategory]);
    setModalVisible(false);
  };
  

  const handlePlanOutfit = async () => {
    if (!occasion) {
      alert("Please enter an occasion");
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_URL}/plan-outfit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          top: selectedClothes.top?.uri || null,
          bottom: selectedClothes.bottom?.uri || null,
          shoes: selectedClothes.shoes?.uri || null,
          occasion,
          date
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Outfit planned successfully!");
      } else {
        alert("Failed to save outfit: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert("Something went wrong. Please try again.");
    }
  
    setOccasion('');
    setDate('');
    setPlanModalVisible(false);
  };
  

  const fetchClothing = async (category) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_user_clothing/${user_id}/${category}`);
      const data = await response.json();
      const fullData = data.map(item => ({
        ...item,
        image_path: `${BACKEND_URL}${item.image}?${Date.now()}`,
      }));
      setClothingItems(fullData);      
    } catch (error) {
      console.error(error);
    }
  };  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        {/* Back Button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  >
          <FontAwesome5 name="arrow-left" size={24} color="#3B3A39" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.undoFloating}
          onPress={() => {
            if (actionHistory.length > 0) {
              const last = actionHistory[actionHistory.length - 1];
              setSelectedClothes((prev) => ({ 
                ...prev,
                 [last]: null,
                }));
              setActionHistory((prev) => prev.slice(0, -1));
            }
          }}>
          <FontAwesome5 name="undo" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsMale(prev => !prev)}>
          <FontAwesome5 name="venus-mars" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.planFloating} onPress={() => setPlanModalVisible(true)}>
          <FontAwesome5 name="calendar-plus" size={16} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Style your Mannequin</Text>
        </View>

        <View style={styles.mannequinContainer}>
          <Image source={isMale ? require('../assets/images/male.png') : require('../assets/images/female.png')} style={styles.mannequinImage} />
          {selectedClothes.top && <Image source={selectedClothes.top} style={styles.topImage} />}
          {selectedClothes.bottom && <Image source={selectedClothes.bottom} style={styles.bottomImage} />}
          {selectedClothes.shoes && <Image source={selectedClothes.shoes} style={styles.shoesImage} />}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
           style={styles.styleButton} 
           onPress={() => {
             setSelectedCategory('top');
             fetchClothing('Tops');
             setModalVisible(true);
             }}
             >
              
            <FontAwesome5 name="tshirt" size={18} color="#3B3A39" />
            <Text style={styles.buttonText}>Tops</Text>
          </TouchableOpacity>

          <TouchableOpacity
           style={styles.styleButton}
            onPress={() => {
             setSelectedCategory('bottom');
             fetchClothing('Bottoms');
             setModalVisible(true);
             }}
             >
            <Image source={PantsIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Bottoms</Text>
          </TouchableOpacity>

          <TouchableOpacity
           style={styles.styleButton}
            onPress={() => {
             setSelectedCategory('shoes');
             fetchClothing('Shoes');
             setModalVisible(true); 
            }}
             >
            <FontAwesome5 name="shoe-prints" size={18} color="#3B3A39" />
            <Text style={styles.buttonText}>Shoes</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select a {selectedCategory}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    horizontal
                    data={clothingItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => {
                        setSelectedClothes((prev) => ({
                          ...prev,
                          [selectedCategory]: { uri: item.image_path },
                        }));
                        setActionHistory((prev) => [...prev, selectedCategory]);
                        setModalVisible(false);
                      }}>
                        <Image source={{ uri: item.image_path }} style={styles.clothingOption} />
                      </TouchableOpacity>
                    )}
                    
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal visible={planModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Plan Outfit</Text>
                <TouchableOpacity onPress={() => setPlanModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Occasion"
                style={styles.input}
                placeholderTextColor="#999"
                value={occasion}
                onChangeText={setOccasion}
              />
              <TextInput
                placeholder="Date (optional)"
                style={styles.input}
                placeholderTextColor="#999"
                value={date}
                onChangeText={setDate}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handlePlanOutfit}>
                <Text style={styles.saveText}>Save Outfit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F7F3' },
  background: { flex: 1, backgroundColor: '#F9F7F3' },
  header: { alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 26, color: '#3B3A39', fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', letterSpacing: 1.2 },
  mannequinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  mannequinImage: { width: 1000, height: 700, resizeMode: 'contain' },
  topImage: { position: 'absolute', top: 50, left: 25, width: 130, height: 80, resizeMode: 'contain', zIndex: 2 },
  bottomImage: { position: 'absolute', top: 150, left: 25, width: 130, height: 100, resizeMode: 'contain', zIndex: 2 },
  shoesImage: { position: 'absolute', top: 250, left: 35, width: 110, height: 60, resizeMode: 'contain', zIndex: 2 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  styleButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#ffffffee', borderWidth: 1, borderColor: '#ccc' },
  buttonText: { color: '#3B3A39', marginLeft: 8, fontWeight: '600', fontSize: 14, letterSpacing: 1, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  icon: { width: 20, height: 20, marginRight: 6, tintColor: '#3B3A39', resizeMode: 'contain' },
  undoFloating: { position: 'absolute', top: 70, right: 20, zIndex: 10, backgroundColor: '#8b0000', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  switchButton: { position: 'absolute', top: 120, right: 20, zIndex: 10, backgroundColor: '#555', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  planFloating: { position: 'absolute', top: 170, right: 20, zIndex: 10, backgroundColor: '#3B3A39', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 10, padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontWeight: 'bold', fontSize: 18 },
  closeButton: { backgroundColor: '#ccc', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { fontSize: 16, fontWeight: 'bold' },
  clothingOption: { width: 100, height: 100, marginRight: 12, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  saveButton: { backgroundColor: '#3B3A39', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold' }
});
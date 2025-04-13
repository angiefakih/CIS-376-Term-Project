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
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PantsIcon from '../assets/icons/trousers.png';

export default function MannequinScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);
  const [isMale, setIsMale] = useState(true);

  const [selectedClothes, setSelectedClothes] = useState({
    top: null,
    shoes: null,
    bottom: null,
  });

  const clothesData = {
    top: [
      { id: 1, image: require('../assets/images/top1.png') },
      { id: 2, image: require('../assets/images/top2.png') },
    ],
    shoes: [
      { id: 3, image: require('../assets/images/shoes1.png') },
    ],
    bottom: [
      { id: 4, image: require('../assets/images/pants1.png') },
    ],
  };

  const handleSelectClothing = (item) => {
    setSelectedClothes((prev) => ({
      ...prev,
      [selectedCategory]: item.image,
    }));
    setActionHistory((prev) => [...prev, selectedCategory]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>

        {/* 🔙 Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#3B3A39" />
        </TouchableOpacity>

        {/* 🔁 Undo Floating Button */}
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
          }}
        >
          <FontAwesome5 name="undo" size={18} color="#fff" />
        </TouchableOpacity>

        {/* 🧍 Switch Mannequin Button */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsMale(prev => !prev)}
        >
          <FontAwesome5 name="venus-mars" size={16} color="#fff" />
        </TouchableOpacity>

        {/* 🧍 Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Style your Mannequin</Text>
        </View>

        {/* 🧍 Mannequin + Clothes */}
        <View style={styles.mannequinContainer}>
          <Image
            source={isMale ? require('../assets/images/male.png') : require('../assets/images/female.png')}
            style={styles.mannequinImage}
          />
          {selectedClothes.top && (
            <Image source={selectedClothes.top} style={styles.topImage} />
          )}
          {selectedClothes.bottom && (
            <Image source={selectedClothes.bottom} style={styles.bottomImage} />
          )}
          {selectedClothes.shoes && (
            <Image source={selectedClothes.shoes} style={styles.shoesImage} />
          )}
        </View>

        {/* 👕 👖 👟 Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.styleButton}
            onPress={() => {
              setSelectedCategory('top');
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
              setModalVisible(true);
            }}
          >
            <FontAwesome5 name="shoe-prints" size={18} color="#3B3A39" />
            <Text style={styles.buttonText}>Shoes</Text>
          </TouchableOpacity>
        </View>

        {/* 📦 Modal Picker */}
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
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
                    data={clothesData[selectedCategory] || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSelectClothing(item)}>
                        <Image source={item.image} style={styles.clothingOption} />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F7F3',
  },
  background: {
    flex: 1,
    backgroundColor: '#F9F7F3',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    color: '#3B3A39',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1.2,
  },
  mannequinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  mannequinImage: {
    width: 1000,
    height: 700,
    resizeMode: 'contain',
  },
  topImage: {
    position: 'absolute',
    top: 50,
    left: 25,
    width: 130,
    height: 80,
    resizeMode: 'contain',
    zIndex: 2,
  },
  bottomImage: {
    position: 'absolute',
    top: 150,
    left: 25,
    width: 130,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
  },
  shoesImage: {
    position: 'absolute',
    top: 250,
    left: 35,
    width: 110,
    height: 60,
    resizeMode: 'contain',
    zIndex: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  styleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#ffffffee',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#3B3A39',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
    tintColor: '#3B3A39',
    resizeMode: 'contain',
  },
  undoFloating: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 10,
    backgroundColor: '#8b0000',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  switchButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 10,
    backgroundColor: '#555',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: '#ccc',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clothingOption: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
  },
});
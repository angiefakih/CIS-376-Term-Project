import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal,
  FlatList, SafeAreaView, TouchableWithoutFeedback,
  Animated, PanResponder, Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import PantsIcon from '../assets/icons/trousers.png';import Constants from 'expo-constants';

const { manifest2, manifest } = Constants;
const backendHost = Platform.OS === 'web'
  ? 'localhost'
  : Constants.expoConfig?.hostUri?.split(':')[0];
const BACKEND_URL = `http://${backendHost}:5000`;


export default function MannequinScreen({ navigation, route }) {
  const { user_id } = route.params;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);
  const [isMale, setIsMale] = useState(true);
  const [selectedClothes, setSelectedClothes] = useState({
    top: null, bottom: null, shoes: null, accessories: null, 
  });
  const [clothingItems, setClothingItems] = useState([]);

  const clothesData = {
    top: [
      { id: 1, image: require('../assets/images/top1.png') },
      { id: 2, image: require('../assets/images/top2.png') },
    ],
    bottom: [
      { id: 3, image: require('../assets/images/pants1.png') },
    ],
    shoes: [
      { id: 4, image: require('../assets/images/shoes1.png') },
    ],
  };

  const makeItemState = (initialX, initialY) => {
    const translateX = useRef(new Animated.Value(initialX)).current;
    const translateY = useRef(new Animated.Value(initialY)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastOffset = useRef({ x: initialX, y: initialY });

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current.x);
        translateY.setOffset(lastOffset.current.y);
        translateX.setValue(0);
        translateY.setValue(0);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX, dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        translateX.flattenOffset();
        translateY.flattenOffset();
        lastOffset.current = {
          x: translateX.__getValue(),
          y: translateY.__getValue()
        };
      }
    });

    const onPinch = Animated.event([{ nativeEvent: { scale } }], {
      useNativeDriver: false,
    });

    return { translateX, translateY, scale, panResponder, onPinch };
  };

  const top = makeItemState(75, 130);
  const bottom = makeItemState(68, 300);
  const shoes = makeItemState(50, 300);
  const accessory = makeItemState(90, 200);

  const handleSelectClothing = (item) => {
    setSelectedClothes((prev) => ({
      ...prev,
      [selectedCategory]: item.image,
    }));
    setActionHistory((prev) => [...prev, selectedCategory]);
    setModalVisible(false);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#3B3A39" />
          </TouchableOpacity>

          {/* Undo Button */}
          <TouchableOpacity
            style={styles.undoFloating}
            onPress={() => {
              if (actionHistory.length > 0) {
                const last = actionHistory[actionHistory.length - 1];
                setSelectedClothes((prev) => ({ ...prev, [last]: null }));
                setActionHistory((prev) => prev.slice(0, -1));
              }
            }}
          >
            <FontAwesome5 name="undo" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Switch Gender Button */}
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsMale(prev => !prev)}>
            <FontAwesome5 name="venus-mars" size={16} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Style your Mannequin</Text>
          </View>

          {/* Mannequin & Clothing Layers */}
          <View style={styles.mannequinContainer}>
            <Image
              source={isMale ? require('../assets/images/male.png') : require('../assets/images/female.png')}
              style={styles.mannequinImage}
            />

            {/* TOP */}
            {selectedClothes.top && (
              <PinchGestureHandler onGestureEvent={top.onPinch}>
                <Animated.View
                  {...top.panResponder.panHandlers}
                  style={[
                    styles.topImage,
                    {
                      transform: [
                        { translateX: top.translateX },
                        { translateY: top.translateY },
                        { scale: top.scale },
                      ]
                    }
                  ]}
                >
                  <Image source={selectedClothes.top} style={styles.clothingImage} />
                </Animated.View>
              </PinchGestureHandler>
            )}

            {/* BOTTOM */}
            {selectedClothes.bottom && (
              <PinchGestureHandler onGestureEvent={bottom.onPinch}>
                <Animated.View
                  {...bottom.panResponder.panHandlers}
                  style={[
                    styles.bottomImage,
                    {
                      transform: [
                        { translateX: bottom.translateX },
                        { translateY: bottom.translateY },
                        { scale: bottom.scale },
                      ]
                    }
                  ]}
                >
                  <Image source={selectedClothes.bottom} style={styles.clothingImage} />
                </Animated.View>
              </PinchGestureHandler>
            )}

            {/* SHOES */}
            {selectedClothes.shoes && (
              <PinchGestureHandler onGestureEvent={shoes.onPinch}>
                <Animated.View
                  {...shoes.panResponder.panHandlers}
                  style={[
                    styles.shoesImage,
                    {
                      transform: [
                        { translateX: shoes.translateX },
                        { translateY: shoes.translateY },
                        { scale: shoes.scale },
                      ]
                    }
                  ]}
                >
                  <Image source={selectedClothes.shoes} style={styles.clothingImage} />
                </Animated.View>
              </PinchGestureHandler>
            )}

            {/*Accessories*/}
            {selectedClothes.accessories && (
              <PinchGestureHandler onGestureEvent={accessory.onPinch}>
                <Animated.View
                  {...accessory.panResponder.panHandlers}
                  style={[
                    {
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      zIndex: 4,
                      transform: [
                        { translateX: accessory.translateX },
                        { translateY: accessory.translateY },
                        { scale: accessory.scale },
                      ]
                    }
                  ]}
                >
                  <Image source={selectedClothes.accessories} style={styles.clothingImage} />
                </Animated.View>
              </PinchGestureHandler>
            )}

          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
          {['top', 'bottom', 'shoes', 'accessories'].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.styleButton}
              onPress={() => {
                setSelectedCategory(type);
                
                const categoryMap = {
                  top: 'Tops',
                  bottom: 'Bottoms',
                  shoes: 'Shoes',
                  accessories: 'Accessories',
                };
                fetchClothing(categoryMap[type]);
                setModalVisible(true);
              }}
            >
              {type === 'top' && <FontAwesome5 name="tshirt" size={18} color="#3B3A39" />}
              {type === 'bottom' && <Image source={PantsIcon} style={styles.icon} />}
              {type === 'shoes' && <FontAwesome5 name="shoe-prints" size={18} color="#3B3A39" />}
              {type === 'accessories' && <FontAwesome5 name="glasses" size={18} color="#3B3A39" />}
              <Text style={styles.buttonText}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}


          </View>

          {/* Modal */}
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
                        <TouchableOpacity onPress={() => handleSelectClothing(
                          item.image_path
                            ? { image: { uri: item.image_path } }
                            : item
                        )}>
                          <Image
                            source={
                              item.image
                                ? item.image
                                : { uri: item.image_path }
                            }
                            style={styles.clothingOption}
                          />
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F7F3' },
  background: { flex: 1, backgroundColor: '#F9F7F3' },
  header: { alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#3B3A39' },
  mannequinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mannequinImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  clothingImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  topImage: { position: 'absolute', width: 150, height: 180, zIndex: 3 },
  bottomImage: { position: 'absolute', width: 150, height: 220, zIndex: 1 },
  shoesImage: { position: 'absolute', width: 120, height: 80, zIndex: 2 },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap',
    paddingVertical: 12, paddingHorizontal: 20,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd',
  },
  styleButton: {
    flexDirection: 'row', alignItems: 'center', width: '45%', 
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10, backgroundColor: '#ffffffee',
    borderWidth: 1, borderColor: '#ccc',
    marginVertical: 3,
    
  },
  buttonText: {
    color: '#3B3A39', marginLeft: 8,
    fontWeight: '600', fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  icon: { width: 20, height: 20, marginRight: 6, resizeMode: 'contain' },
  undoFloating: {
    position: 'absolute', top: 70, right: 20, zIndex: 10,
    backgroundColor: '#8b0000', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  switchButton: {
    position: 'absolute', top: 130, right: 20, zIndex: 10,
    backgroundColor: '#555', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 10, padding: 8 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  modalTitle: { fontWeight: 'bold', fontSize: 18 },
  closeButton: {
    backgroundColor: '#ccc', width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  closeButtonText: { fontSize: 16, fontWeight: 'bold' },
  clothingOption: {
    width: 100, height: 100, marginRight: 12, borderRadius: 8,
  },
  
});
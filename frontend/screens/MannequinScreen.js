import React, { useState, useRef,useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal,
  FlatList, SafeAreaView, TouchableWithoutFeedback,
  Animated, PanResponder, Platform, TextInput 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import PantsIcon from '../assets/icons/trousers.png';import Constants from 'expo-constants';
import { Alert } from 'react-native'; 
//import DateTimePicker from '@react-native-community/datetimepicker';


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
  const [occasion, setOccasion] = useState('');
  const [planModalVisible, setPlanModalVisible] = useState(false);

  const [mm, setMM] = useState('');
  const [dd, setDD] = useState('');
  const [yyyy, setYYYY] = useState('');

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

  useEffect(() => {
    if (route.params?.gender) {
      setIsMale(route.params.gender === 'male');
    }
    if (route.params?.outfit) {
      const outfit = route.params.outfit;
  
      if (outfit.top?.uri) {
        setSelectedClothes(prev => ({ ...prev, top: { uri: outfit.top.uri } }));
        top.translateX.setValue(outfit.top.x || 75);
        top.translateY.setValue(outfit.top.y || 130);
        top.scale.setValue(outfit.top.scale || 1);
      }
  
      if (outfit.bottom?.uri) {
        setSelectedClothes(prev => ({ ...prev, bottom: { uri: outfit.bottom.uri } }));
        bottom.translateX.setValue(outfit.bottom.x || 68);
        bottom.translateY.setValue(outfit.bottom.y || 300);
        bottom.scale.setValue(outfit.bottom.scale || 1);
      }
  
      if (outfit.shoes?.uri) {
        setSelectedClothes(prev => ({ ...prev, shoes: { uri: outfit.shoes.uri } }));
        shoes.translateX.setValue(outfit.shoes.x || 50);
        shoes.translateY.setValue(outfit.shoes.y || 300);
        shoes.scale.setValue(outfit.shoes.scale || 1);
      }
  
      if (outfit.accessories?.uri) {
        setSelectedClothes(prev => ({ ...prev, accessories: { uri: outfit.accessories.uri } }));
        accessory.translateX.setValue(outfit.accessories.x || 90);
        accessory.translateY.setValue(outfit.accessories.y || 200);
        accessory.scale.setValue(outfit.accessories.scale || 1);
      }
    }
  }, [route.params?.outfit]);
  
  

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

  const isValidDate = (dateStr) => {
    if (!dateStr) return true; // allow empty (optional)
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!regex.test(dateStr)) return false;
  
    const dateObj = new Date(dateStr);
    return !isNaN(dateObj.getTime());
  };
  
  const isRealDate = (mm, dd, yyyy) => {
    const month = parseInt(mm, 10);
    const day = parseInt(dd, 10);
    const year = parseInt(yyyy, 10);
  
    if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (year < 2000 || year > 9999) return false;
  
    let maxDay;
  
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      maxDay = 31;
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDay = 30;
    } else if (month === 2) {
      const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
      if (isLeap) {
        maxDay = 29;
      } else {
        maxDay = 28;
      }
    }
  
    return day >= 1 && day <= maxDay;
  };

  const handlePlanOutfit = async () => {
    if (!occasion) {
      Alert.alert("Missing Info", "Please enter an occasion");
      return;
    }

    finalDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    if (!isRealDate(mm, dd, yyyy)) {
      Alert.alert("Invalid Date", "That date doesn’t exist.");
      return;
    }

    const outfitData = {
      user_id,
      occasion,
      date: finalDate,
      top: selectedClothes.top?.uri ? {
        uri: selectedClothes.top.uri,
        x: top.translateX.__getValue(),
        y: top.translateY.__getValue(),
        scale: top.scale.__getValue()
      } : null,
      bottom: selectedClothes.bottom?.uri ? {
        uri: selectedClothes.bottom.uri,
        x: bottom.translateX.__getValue(),
        y: bottom.translateY.__getValue(),
        scale: bottom.scale.__getValue()
      } : null,
      shoes: selectedClothes.shoes?.uri ? {
        uri: selectedClothes.shoes.uri,
        x: shoes.translateX.__getValue(),
        y: shoes.translateY.__getValue(),
        scale: shoes.scale.__getValue()
      } : null,
      accessories: selectedClothes.accessories?.uri ? {
        uri: selectedClothes.accessories.uri,
        x: accessory.translateX.__getValue(),
        y: accessory.translateY.__getValue(),
        scale: accessory.scale.__getValue()
      } : null,
      gender: isMale ? 'male' : 'female',
    };
  
    try {
      console.log("🛰️ Sending to:", `${BACKEND_URL}/plan-outfit`);
      const response = await fetch(`${BACKEND_URL}/plan-outfit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outfitData)
      });
  
      const text = await response.text();
      let data;
  
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Not valid JSON. Raw response:", text);
        throw new Error("Invalid JSON returned from server.");
      }
  
      if (response.ok) {
        Alert.alert("Outfit Planned", "Your outfit has been saved!", [
          {
            text: "OK",
            onPress: () => {
              setPlanModalVisible(false);
              setOccasion('');
              setMM('');
              setDD('');
              setYYYY('');
              navigation.navigate('PlanOutfit', { user_id });
            }
          }
        ]);
      } else {
        Alert.alert("Failed", data.message || "Unknown error");
      }
  
    } catch (err) {
      console.error("Save failed:", err);
      Alert.alert("Error", "Something went wrong.");
    }
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
          
          {/* Plan Button */}
          <TouchableOpacity
            style={styles.planFloating}
            onPress={() => setPlanModalVisible(true)}
          >
            <FontAwesome5 name="calendar-plus" size={16} color="#fff" />
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
                            source={{ uri: item.image_path }}
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TextInput
                    placeholder="MM"
                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                    placeholderTextColor="#999"
                    value={mm}
                    onChangeText={(text) => {
                      if (/^\d{0,2}$/.test(text)) setMM(text);
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <TextInput
                    placeholder="DD"
                    style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
                    placeholderTextColor="#999"
                    value={dd}
                    onChangeText={(text) => {
                      if (/^\d{0,2}$/.test(text)) setDD(text);
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <TextInput
                    placeholder="YYYY"
                    style={[styles.input, { flex: 2, marginLeft: 5 }]}
                    placeholderTextColor="#999"
                    value={yyyy}
                    onChangeText={(text) => {
                      if (/^\d{0,4}$/.test(text)) setYYYY(text);
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handlePlanOutfit}>
                  <Text style={styles.saveText}>Save Outfit</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 10, padding: 8 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center',
  },
  undoFloating: {
    position: 'absolute', top: 70, right: 20, zIndex: 10,
    backgroundColor: '#8b0000', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  switchButton: {
    position: 'absolute', top: 120, right: 20, zIndex: 10,
    backgroundColor: '#555', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  planFloating: {
    position: 'absolute', top: 170, right: 20, zIndex: 10,
    backgroundColor: '#3B3A39', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
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
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#3B3A39', padding: 12, borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff', fontWeight: 'bold',
  },  
});
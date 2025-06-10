import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categoryImages = {
  'Nasi & Mie': require('../assets/Images/ayamBakar.jpg'),
  'Ayam & Daging': require('../assets/Images/ayamBakar.jpg'),
  'Seafood': require('../assets/Images/ayamBakar.jpg'),
  'Sayuran': require('../assets/Images/ayamBakar.jpg'),
  'Sup & Soto': require('../assets/Images/ayamBakar.jpg'),
  'Kue & Dessert': require('../assets/Images/ayamBakar.jpg'),
  'Minuman': require('../assets/Images/ayamBakar.jpg'),
  'Sarapan': require('../assets/Images/ayamBakar.jpg'),
};

const DATA = [
  { id: '1', title: 'Nasi & Mie', count: 150, image: categoryImages['Nasi & Mie'] },
  { id: '2', title: 'Ayam & Daging', count: 120, image: categoryImages['Ayam & Daging'] },
  { id: '3', title: 'Seafood', count: 85, image: categoryImages['Seafood'] },
  { id: '4', title: 'Sayuran', count: 95, image: categoryImages['Sayuran'] },
  { id: '5', title: 'Sup & Soto', count: 75, image: categoryImages['Sup & Soto'] },
  { id: '6', title: 'Kue & Dessert', count: 110, image: categoryImages['Kue & Dessert'] },
  { id: '7', title: 'Minuman', count: 65, image: categoryImages['Minuman'] },
  { id: '8', title: 'Sarapan', count: 80, image: categoryImages['Sarapan'] },
];

const numColumns = 2;
const itemWidth = Dimensions.get('window').width / numColumns - 24;

const KategoriScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <ImageBackground source={item.image} style={styles.image} imageStyle={{ borderRadius: 14 }}>
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.count}>{item.count} Resep</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#7F4F24" />
      </TouchableOpacity>
      <Text style={styles.header}>Kategori Resep</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default KategoriScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#7F4F24',
    marginTop: 32,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  list: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    overflow: 'hidden',
    width: itemWidth,
    height: 130,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#B08968',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 14,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  count: {
    color: 'white',
    fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

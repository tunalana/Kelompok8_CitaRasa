import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dataAllRecipe from '../Data/DataAllRecipe.json';
import imageMapping from './imageMapping';

const AllRecipe = ({ navigation }) => {
  const renderItem = (item) => {
    const imageSource = imageMapping[item.imageName];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPress={() => navigation.navigate('DetailScreen', { item })}
        activeOpacity={0.85}
      >
        <Image source={imageSource} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.category}>{item.kategori || 'Resep Masakan'}</Text>
          <Text style={styles.title}>{item.nama}</Text>
          <Text style={styles.detail}>Waktu: {item.durasiMasak}</Text>
          <View style={styles.bottomRow}>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
            <Text style={styles.views}>{item.populer} disukai</Text>
          </View>
          {item.status && (
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#7F4F24" />
      </TouchableOpacity>
      <Text style={styles.header}>📋 Semua Resep</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {dataAllRecipe.map((item) => renderItem(item))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
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
    color: '#7F4F24',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#B08968',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    width: 92,
    height: 92,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    backgroundColor: '#FFE5B4',
  },
  infoContainer: {
    flex: 1,
    padding: 14,
    position: 'relative',
    justifyContent: 'center',
  },
  category: {
    color: '#B08968',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  title: {
    color: '#7F4F24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  detail: {
    color: '#B08968',
    fontSize: 13,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  views: {
    color: '#7F4F24',
    fontSize: 13,
    fontWeight: '600',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 8,
    left: 14,
    backgroundColor: '#FFE5B4',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  status: {
    color: '#7F4F24',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AllRecipe;

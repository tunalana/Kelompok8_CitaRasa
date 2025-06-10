import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataAllRecipes from '../Data/DataAllRecipe.json';
import imageMapping from './imageMapping';

const Search = ({ navigation }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Makanan Berat');
  const [searchText, setSearchText] = useState('');

  const categories = [
    'Makanan Berat',
    'Makanan Ringan',
    'Minuman',
    'Dessert',
    'Soup',
    'Salad',
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  // Simpan item ke pencarian terakhir di AsyncStorage
  const saveLastSearch = async (item) => {
    try {
      const jsonValue = await AsyncStorage.getItem('@last_search');
      let lastSearches = jsonValue != null ? JSON.parse(jsonValue) : [];

      // Cek item sudah ada atau belum berdasarkan id
      const exists = lastSearches.some(searchItem => searchItem.id === item.id);
      if (!exists) {
        // Masukkan di depan list
        lastSearches.unshift(item);

        // Batasi max 10 item
        if (lastSearches.length > 10) lastSearches.pop();

        await AsyncStorage.setItem('@last_search', JSON.stringify(lastSearches));
      }
    } catch (e) {
      console.error('Gagal menyimpan pencarian terakhir:', e);
    }
  };

  const filteredData = dataAllRecipes.filter(
    (item) =>
      item.category.toLowerCase() === selectedCategory.toLowerCase() &&
      item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const imageSource =
      imageMapping[item.imageName] || imageMapping['default.jpg'];

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          saveLastSearch(item);
          navigation.navigate('DetailScreen', { item });
        }}
      >
        <Image source={imageSource} style={styles.thumbnail} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultSubtitle}>
            {item.ingredientsCount} Bahan • {item.cookTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4E342E" />
      </TouchableOpacity>

      <Text style={styles.header}>Cari Resep Favoritmu</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Ketik nama resep"
        placeholderTextColor="#A1887F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>
          {selectedCategory.toUpperCase()}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#4E342E" />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectCategory(item)}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada resep ditemukan.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',  // krem lembut
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  header: {
    color: '#4E342E',           // coklat tua
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  searchInput: {
    backgroundColor: '#FFE5B4', // krem muda
    borderRadius: 12,
    padding: 14,
    color: '#4E342E',           // coklat tua
    marginBottom: 20,
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFB74D', // orange pastel
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  dropdownText: {
    color: '#4E342E',           // coklat tua
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownMenu: {
    backgroundColor: '#FFF3E0', // krem sangat terang
    borderRadius: 12,
    marginTop: 10,
    maxHeight: 220,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD54F', // kuning pastel
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#6D4C41',           // coklat medium
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFE0B2', // krem soft
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: '#4E342E',           // coklat tua
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultSubtitle: {
    color: '#8D6E63',           // coklat muda
    fontSize: 14,
    marginTop: 6,
  },
  emptyText: {
    color: '#A1887F',           // coklat abu
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Search;

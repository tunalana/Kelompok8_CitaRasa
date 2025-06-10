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
        activeOpacity={0.85}
      >
        <Image source={imageSource} style={styles.thumbnail} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultSubtitle}>
            {item.ingredientsCount} Bahan • {item.cookTime}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#B08968" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#7F4F24" />
      </TouchableOpacity>

      <Text style={styles.header}>Cari Resep Favoritmu</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#B08968" />
        <TextInput
          style={styles.searchInput}
          placeholder="Ketik nama resep"
          placeholderTextColor="#B08968"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(!showDropdown)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>
          {selectedCategory}
        </Text>
        <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color="#7F4F24" />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  item === selectedCategory && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelectCategory(item)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    item === selectedCategory && styles.dropdownItemTextSelected,
                  ]}
                >
                  {item}
                </Text>
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',  // krem lembut
    padding: 0,
    paddingTop: 56,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  header: {
    color: '#7F4F24',           // coklat tua
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEFE5',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 18,
    marginBottom: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#7F4F24',
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFE5B4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    elevation: 1,
  },
  dropdownText: {
    color: '#7F4F24',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownMenu: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 14,
    elevation: 2,
    maxHeight: 220,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5B4',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFB74D',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#7F4F24',
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 18,
    marginVertical: 7,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#B08968',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#FFE8D3',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: '#7F4F24',
    fontSize: 17,
    fontWeight: 'bold',
  },
  resultSubtitle: {
    color: '#B08968',
    fontSize: 13,
    marginTop: 6,
  },
  emptyText: {
    color: '#A1887F',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Search;

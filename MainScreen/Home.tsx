import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = ['Salad', 'Breakfast', 'Appetizer', 'Noodle', 'Lunch'];
const STORAGE_KEY = '@last_searches';

const allRecipes = [
  { id: '1', title: 'Salad Buah', category: 'Salad', time: '10 Mins', image: require('../assets/Images/ayamBakar.jpg') },
  { id: '2', title: 'Pancake Pisang', category: 'Breakfast', time: '15 Mins', image: require('../assets/Images/ayamBakar.jpg') },
  { id: '3', title: 'Tahu Crispy', category: 'Appetizer', time: '10 Mins', image: require('../assets/Images/ayamBakar.jpg') },
  { id: '4', title: 'Mie Goreng Jawa', category: 'Noodle', time: '20 Mins', image: require('../assets/Images/ayamBakar.jpg') },
  { id: '5', title: 'Nasi Goreng Spesial', category: 'Lunch', time: '15 Mins', image: require('../assets/Images/ayamBakar.jpg') },
];

const popularRecipes = allRecipes.slice(0, 5);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Salad');
  const [greeting, setGreeting] = useState({ title: '', subtitle: '' });
  const [lastSearches, setLastSearches] = useState([]);
  const { width } = useWindowDimensions();

  // Update greeting berdasarkan waktu saat ini
  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting({ title: 'Selamat Pagi', subtitle: 'Saatnya sarapan sehat!' });
    } else if (hour >= 11 && hour < 15) {
      setGreeting({ title: 'Selamat Siang', subtitle: 'Waktunya makan siang lezat' });
    } else if (hour >= 15 && hour < 18) {
      setGreeting({ title: 'Selamat Sore', subtitle: 'Cemilan sore siap menemani' });
    } else {
      setGreeting({ title: 'Selamat Malam', subtitle: 'Saatnya santai dan makan malam' });
    }
  };

  // Load pencarian terakhir dari AsyncStorage
  const loadLastSearches = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setLastSearches(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Failed to load last searches:', error);
    }
  };

  // Simpan pencarian terakhir ke AsyncStorage
  const saveLastSearches = async (searches) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save last searches:', error);
    }
  };

  // Hapus semua pencarian terakhir dengan konfirmasi
  const deleteAllSearches = () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah kamu yakin ingin menghapus semua pencarian terakhir?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setLastSearches([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
          },
        },
      ],
    );
  };

  // Tambah item pencarian terakhir
  const addSearch = async (searchItem) => {
    try {
      let updated = [searchItem, ...lastSearches.filter(i => i.id !== searchItem.id)];
      if (updated.length > 10) updated = updated.slice(0, 10);
      setLastSearches(updated);
      await saveLastSearches(updated);
    } catch (error) {
      console.error('Failed to add last search:', error);
    }
  };

  useEffect(() => {
    updateGreeting();
    loadLastSearches();
    const interval = setInterval(updateGreeting, 900000); // update tiap 15 menit
    return () => clearInterval(interval);
  }, []);

  // Filter resep sesuai kategori
  const filteredRecipes = allRecipes.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting.title}</Text>
            <Text style={styles.subGreeting}>{greeting.subtitle}</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('NotificationScreen')}
            >
              <Icon name="notifications-outline" size={24} color="#FF7622" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terpopuler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Terpopuler 🔥</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllRecipe')}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={popularRecipes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8, paddingLeft: Platform.OS === 'android' ? 10 : 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.popularCard, { width: width * 0.45, minWidth: 160, maxWidth: 220 }]}
              onPress={() => navigation.navigate('DetailMenu', { item })}
            >
              <Image source={item.image} style={styles.popularImage} />
              <View style={styles.popularInfo}>
                <Text style={styles.popularTitle}>{item.title}</Text>
                <Text style={styles.popularTime}>⏱ {item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Resep Terbaru */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resep Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Kategori')}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filtered Recipe Cards */}
        <FlatList
          data={filteredRecipes}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, paddingLeft: Platform.OS === 'android' ? 10 : 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recipeCard, { width: width * 0.38, minWidth: 140, maxWidth: 180 }]}
              onPress={() => navigation.navigate('DetailMenu', { item })}
            >
              <Image source={item.image} style={styles.recipeImage} />
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeTime}>⏱ {item.time}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Pencarian Terakhir */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pencarian Terakhir</Text>
          <TouchableOpacity onPress={deleteAllSearches}>
            <Text style={styles.seeAll}>Hapus Semua</Text>
          </TouchableOpacity>
        </View>

        {lastSearches.length > 0 ? (
          <FlatList
            data={lastSearches}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingLeft: Platform.OS === 'android' ? 10 : 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.lastSearchCard, { width: width * 0.28, minWidth: 90, maxWidth: 120 }]}
                onPress={() => navigation.navigate('DetailMenu', { item })}
              >
                <Image source={item.image} style={styles.lastSearchImage} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noLastSearch}>Tidak ada pencarian terakhir</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#FF7622' },
  subGreeting: { color: '#B08968', fontSize: 14, marginTop: 2 },
  icons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#7F4F24' },
  seeAll: { color: '#FF7622', fontWeight: 'bold', fontSize: 14 },
  popularCard: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginRight: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  popularImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  popularInfo: {
    padding: 12,
  },
  popularTitle: { fontSize: 16, fontWeight: 'bold', color: '#7F4F24' },
  popularTime: { color: '#B08968', fontSize: 13, marginTop: 4 },
  categoryTabs: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  categoryButton: {
    backgroundColor: '#FFEFE5',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#FF7622',
  },
  categoryText: { color: '#FF7622', fontWeight: '600', fontSize: 14 },
  categoryTextSelected: {
    color: '#fff',
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  recipeImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  recipeTitle: { fontSize: 15, fontWeight: 'bold', color: '#7F4F24', textAlign: 'center' },
  recipeTime: { color: '#B08968', fontSize: 12, marginTop: 2 },
  lastSearchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  lastSearchImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  noLastSearch: {
    padding: 16,
    color: '#B08968',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default HomeScreen;

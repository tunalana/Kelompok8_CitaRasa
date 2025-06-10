import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    id: '1',
    title: 'Rendang Daging Sapi',
    chef: 'Chef Anita',
    time: '120 menit',
    level: 'Sulit',
    likes: 1245,
    savedAt: '2 hari yang lalu',
    image: require('../assets/Images/rendang.jpeg'),
  },
  {
    id: '2',
    title: 'Sate Ayam Madura',
    chef: 'Chef Budi',
    time: '45 menit',
    level: 'Sedang',
    likes: 982,
    savedAt: '5 hari yang lalu',
    image: require('../assets/Images/ayamBakar.jpg'),
  },
  {
    id: '3',
    title: 'Nasi Uduk Betawi',
    chef: 'Chef Diana',
    time: '30 menit',
    level: 'Mudah',
    likes: 754,
    savedAt: '1 minggu yang lalu',
    image: require('../assets/Images/sotoAyam.jpeg'),
  },
];

const BookmarkScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailMenu', { item })}
      activeOpacity={0.85}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://ui-avatars.com/api/?name=' + item.chef }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.chef}>{item.chef}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            <Ionicons name="time-outline" size={14} color="#B08968" /> {item.time}
          </Text>
          <Text style={styles.metaText}>
            <MaterialCommunityIcons name="signal" size={14} color="#B08968" /> {item.level}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.like}>
            <Ionicons name="heart" size={14} color="#EF4444" /> {item.likes}
          </Text>
          <Text style={styles.savedAt}>Disimpan {item.savedAt}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Resep Favorit</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#B08968" />
        <TextInput
          placeholder="Cari resep favorit..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#B08968"
        />
      </View>
      <FlatList
        data={DATA.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 0,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7F4F24',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEFE5',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 18,
    marginBottom: 18,
    height: 44,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 15,
    color: '#7F4F24',
    marginLeft: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#B08968',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#FFE8D3',
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFE5B4',
    backgroundColor: '#FFF8F0',
  },
  chef: {
    fontSize: 12,
    color: '#B08968',
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#7F4F24',
    marginTop: 2,
    flexShrink: 1,
    maxWidth: 170,
  },
  meta: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 4,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#B08968',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  like: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  savedAt: {
    fontSize: 12,
    color: '#B08968',
    fontStyle: 'italic',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 5,
    elevation: 2,
  },
});

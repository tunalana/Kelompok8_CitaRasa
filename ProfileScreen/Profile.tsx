import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=FFE5B4&color=7F4F24';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const handleEdit = (recipe) => {
    navigation.navigate('EditRecipe', { recipe });
  };

  const handleDelete = (recipe) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah kamu yakin ingin menghapus resep "${recipe.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', onPress: () => console.log(`Deleted: ${recipe.title}`), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchProfileAndRecipes = async () => {
      let user = null;
      try {
        user = supabase.auth.user ? supabase.auth.user() : supabase.auth.session()?.user;
      } catch (e) {
        Alert.alert('Error', 'Gagal mendapatkan user Supabase.');
        return;
      }
      if (!user) {
        Alert.alert('Error', 'User belum login.');
        return;
      }
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) {
        Alert.alert('Profil tidak ditemukan', 'Data profil tidak ditemukan di database. Silakan lengkapi profil Anda.');
        setProfile({
          name: '',
          username: '',
          bio: '',
          avatar: '',
          twitter: '',
          instagram: '',
        });
      } else {
        setProfile(profileData);
      }
      // Fetch user recipes
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });
      if (!recipeError) setRecipes(recipeData || []);
    };
    fetchProfileAndRecipes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchProfileAndRecipes = async () => {
        let user = null;
        try {
          user = supabase.auth.user ? supabase.auth.user() : supabase.auth.session()?.user;
        } catch (e) {
          Alert.alert('Error', 'Gagal mendapatkan user Supabase.');
          return;
        }
        if (!user) {
          Alert.alert('Error', 'User belum login.');
          return;
        }
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) {
          Alert.alert('Profil tidak ditemukan', 'Data profil tidak ditemukan di database. Silakan lengkapi profil Anda.');
          setProfile({
            name: '',
            username: '',
            bio: '',
            avatar: '',
            twitter: '',
            instagram: '',
          });
        } else {
          setProfile(profileData);
        }
        // Fetch user recipes
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('id', { ascending: false });
        if (!recipeError) setRecipes(recipeData || []);
      };
      fetchProfileAndRecipes();
    });
    return unsubscribe;
  }, [navigation]);

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F0' }}>
        <Text style={{ color: '#7F4F24', fontSize: 16 }}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#7F4F24" />
      </TouchableOpacity>
      {/* Header Profile */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar || defaultAvatar }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name || 'User'}</Text>
          <Text style={styles.username}>{profile?.username ? `@${profile.username}` : ''}</Text>
          <Text style={styles.bio}>{profile?.bio || ''}</Text>
          {profile?.twitter ? (
            <Text style={styles.bio}>Twitter: {profile.twitter}</Text>
          ) : null}
          {profile?.instagram ? (
            <Text style={styles.bio}>Instagram: {profile.instagram}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={18} color="#EF4444" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Statistik */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Recipes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>14K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>120</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Daftar Resep */}
      <Text style={styles.sectionTitle}>My Recipes</Text>
      <View style={styles.recipeList}>
        {recipes.length === 0 ? (
          <Text style={{ color: '#B08968', textAlign: 'center', marginTop: 12 }}>Belum ada resep yang kamu buat.</Text>
        ) : (
          recipes.map((item) => (
            <RecipeCard
              key={item.id}
              recipe={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const RecipeCard = ({ recipe, onEdit, onDelete }) => (
  <View style={styles.recipeCard}>
    <Image source={{ uri: recipe.image_url || recipe.image }} style={styles.recipeImage} />
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() =>
        Alert.alert(
          'Opsi',
          `Pilih aksi untuk "${recipe.title}"`,
          [
            { text: 'Edit', onPress: () => onEdit(recipe) },
            { text: 'Hapus', onPress: () => onDelete(recipe), style: 'destructive' },
            { text: 'Batal', style: 'cancel' },
          ],
          { cancelable: true }
        )
      }
    >
      <MaterialIcons name="more-vert" size={22} color="#B08968" />
    </TouchableOpacity>
    <View style={styles.recipeContent}>
      <View style={styles.recipeHeaderRow}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.rating}>★ {typeof recipe.rating === 'number' ? recipe.rating.toFixed(1) : '-'}</Text>
      </View>
      <Text style={styles.recipeDetails}>
        {Array.isArray(recipe.ingredients) ? recipe.ingredients.length : recipe.ingredients || '-'} Ingredients • {recipe.cook_time || recipe.time || '-'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 0,
    paddingTop: 0,
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
  profileHeader: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  avatarWrapper: {
    borderWidth: 3,
    borderColor: '#FFE5B4',
    borderRadius: 60,
    padding: 4,
    marginBottom: 12,
    backgroundColor: '#FFF8F0',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F4F24',
  },
  username: {
    fontSize: 13,
    color: '#B08968',
    marginTop: 2,
    marginBottom: 4,
  },
  bio: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 260,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignSelf: 'center',
    marginTop: 6,
  },
  editProfileText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7F4F24',
  },
  statLabel: {
    color: '#B08968',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFE5B4',
    marginHorizontal: 24,
    marginVertical: 18,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#7F4F24',
    marginLeft: 24,
    marginBottom: 10,
  },
  recipeList: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 140,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
    padding: 4,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  rating: {
    color: '#FBBF24',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7F4F24',
    flex: 1,
    flexWrap: 'wrap',
  },
  recipeDetails: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
});

export default ProfileScreen;

// src/screens/Setting.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../AuthContext';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../types.ts';

// 1) Define the navigation prop for this screen
type SettingNavProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

const Setting = () => {
  // 2) Tell useNavigation exactly which routes exist
  const navigation = useNavigation<SettingNavProp>();

  const {
    logout,
    user,
    vibrate,
    setVibrate,
    fastMode,
    setFastMode,
  } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    photoURL: '',
  });
  const [aboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === 'true');
      }
      const saved =
        user ||
        JSON.parse((await AsyncStorage.getItem('loggedInUser')) || '{}');
      setProfile({
        name:
          saved.name ||
          saved.nama ||
          'Nama Pengguna',
        email:
          saved.email ||
          'email@contoh.com',
        username:
          saved.username ||
          (saved.email ? saved.email.split('@')[0] : 'username'),
        photoURL: saved.photoURL || '',
      });
    };
    loadSettings();
  }, [user]);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          await logout();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Box */}
      <View style={styles.profileBoxContainer}>
        <TouchableOpacity
          style={styles.profileBox}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={
              profile.photoURL
                ? { uri: profile.photoURL }
                : require('../assets/logo.png')
            }
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              {profile.name}
            </Text>
            <Text style={styles.profileEmail}>
              {profile.email}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tampilan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tampilan</Text>
        <SettingRow
          title="Mode Gelap"
          description="Aktifkan tampilan gelap"
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
        <SettingRow
          title="Fast Mode"
          description="Sembunyikan thumbnail resep"
          value={fastMode}
          onValueChange={(v) => setFastMode(v)}
        />
      </View>

      {/* Interaksi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interaksi</Text>
        <SettingRow
          title="Getar"
          description="Getar saat data dimuat"
          value={vibrate}
          onValueChange={(v) => setVibrate(v)}
        />
      </View>

      {/* Informasi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi</Text>
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => setAboutVisible(true)}
        >
          <Text style={styles.infoTitle}>
            Tentang Aplikasi
          </Text>
          <Text style={styles.infoDesc}>
            Pelajari lebih lanjut tentang ResepKu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => navigation.navigate('FAQ')}
        >
          <Text style={styles.infoTitle}>FAQ</Text>
          <Text style={styles.infoDesc}>
            Pertanyaan yang sering diajukan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal Tentang Aplikasi */}
      <Modal
        visible={aboutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Tentang ResepKu
            </Text>
            <Text style={styles.modalText}>
              ResepKu adalah aplikasi resep makanan
              Indonesia yang menyediakan berbagai resep
              pilihan dari berbagai kategori. Temukan
              inspirasi masakan harian, simpan resep
              favorit, dan nikmati pengalaman memasak yang
              mudah dan menyenangkan. Semua fitur gratis
              dan tanpa biaya langganan!
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setAboutVisible(false)}
            >
              <Text style={styles.closeButtonText}>
                Tutup
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const SettingRow = ({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) => (
  <View style={styles.row}>
    <View style={styles.textContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>
        {description}
      </Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e0c9a6', true: '#FF7622' }}
      thumbColor={value ? '#FF7622' : '#fff'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  profileBoxContainer: {
    paddingHorizontal: 18,
    marginTop: 24,
  },
  profileBox: {
    backgroundColor: '#F6E7D8',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#E5CBAF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F4F24',
  },
  profileEmail: {
    fontSize: 13,
    color: '#B08968',
  },
  section: {
    marginHorizontal: 18,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#E5CBAF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B08968',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#F6E7D8',
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7F4F24',
  },
  rowDescription: {
    fontSize: 13,
    color: '#B08968',
    marginTop: 2,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomColor: '#F6E7D8',
    borderBottomWidth: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7F4F24',
  },
  infoDesc: {
    fontSize: 13,
    color: '#B08968',
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 18,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 32,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff8f0',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  closeButton: {
    backgroundColor: '#FF7622',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});

export default Setting;

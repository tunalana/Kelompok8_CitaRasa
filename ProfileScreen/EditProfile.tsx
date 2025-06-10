import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../supabaseClient';

const defaultAvatar =
  'https://ui-avatars.com/api/?name=John+Doe&background=FFE5B4&color=7F4F24';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [bio, setBio] = useState(
    'Food lover, home cook, and recipe explorer. Selalu mencoba resep baru setiap minggu!'
  );
  const [avatar, setAvatar] = useState<string | null>(null);
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  const uploadAvatarToSupabase = async (uri: string) => {
    try {
      // ekstensi + nama file unik
      const ext = uri.split('.').pop() || 'jpg';
      const rnd = Math.random().toString(36).slice(2, 10);
      const fileName = `${Date.now()}-${rnd}.${ext}`;

      // baca file jadi base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);
      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      // upload
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: true,
        });
      if (uploadError) throw uploadError;

      // publicURL
      const { publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicURL;
    } catch (e: any) {
      console.log('Upload avatar error:', e.message);
      Alert.alert('Error', 'Gagal upload avatar');
      return null;
    }
  };

  const handleSave = async () => {
    // validasi
    if (!name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Email tidak valid');
      return;
    }

    let avatarUrl = avatar;
    if (avatar && !avatar.startsWith('http')) {
      avatarUrl = await uploadAvatarToSupabase(avatar);
      if (!avatarUrl) return;
    }

    const user =
      supabase.auth.user?.() || supabase.auth.session()?.user;
    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name, email, bio, avatar: avatarUrl, twitter, instagram })
      .eq('id', user.id);

    if (updateError) {
      Alert.alert('Error', 'Gagal update profil');
      return;
    }

    Alert.alert('Success', 'Profil berhasil diperbarui!');
    navigation.goBack();
  };

  const pickImage = async () => {
    const { granted } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Izin dibutuhkan',
        'Akses galeri diperlukan untuk memilih foto.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <–– gunakan ini dulu
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { granted } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Izin dibutuhkan',
        'Akses kamera diperlukan untuk mengambil foto.'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <–– dan ini
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: '#FFF8F0' }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#7F4F24" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Edit Profil</Text>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: avatar || defaultAvatar }}
                style={{
                  ...styles.avatar,
                  width: width * 0.28,
                  height: width * 0.28,
                  borderRadius: (width * 0.28) / 2,
                }}
              />
              <View style={styles.avatarButtons}>
                <TouchableOpacity
                  style={styles.avatarBtn}
                  onPress={pickImage}
                >
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color="#7F4F24"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.avatarBtn}
                  onPress={takePhoto}
                >
                  <Ionicons
                    name="camera-outline"
                    size={20}
                    color="#7F4F24"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Fields */}
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={[styles.input, { width: width * 0.85, maxWidth: 400 }]}
              placeholder="Masukkan nama lengkap"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#B08968"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { width: width * 0.85, maxWidth: 400 }]}
              placeholder="Masukkan email aktif"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#B08968"
            />
            <Text style={styles.label}>Biodata</Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                { width: width * 0.85, maxWidth: 400 },
              ]}
              placeholder="Ceritakan sedikit tentang kamu…"
              value={bio}
              onChangeText={setBio}
              multiline
              placeholderTextColor="#B08968"
            />
            <Text style={styles.label}>Twitter</Text>
            <TextInput
              style={[styles.input, { width: width * 0.85, maxWidth: 400 }]}
              placeholder="Username Twitter (misal: @namakamu)"
              value={twitter}
              onChangeText={setTwitter}
              autoCapitalize="none"
              placeholderTextColor="#B08968"
            />
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={[styles.input, { width: width * 0.85, maxWidth: 400 }]}
              placeholder="Username Instagram (misal: @namakamu)"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
              placeholderTextColor="#B08968"
            />

            <TouchableOpacity
              style={[styles.saveButton, { width: width * 0.85, maxWidth: 400 }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#FFF8F0',
    flexGrow: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#7F4F24',
    letterSpacing: 0.2,
    marginTop: 10,
  },
  avatarWrapper: { alignItems: 'center', marginBottom: 22, position: 'relative' },
  avatar: { borderWidth: 3, borderColor: '#FFE5B4', backgroundColor: '#FFF8F0' },
  avatarButtons: { flexDirection: 'row', position: 'absolute', bottom: -8, right: 8 },
  avatarBtn: {
    backgroundColor: '#FFE5B4',
    borderRadius: 18,
    padding: 7,
    marginHorizontal: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFF8F0',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 15,
    color: '#7F4F24',
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFE5B4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#7F4F24',
  },
  bioInput: { height: 90, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.2 },
});

export default EditProfileScreen;

// CreateRecipeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../supabaseClient';

const CreateRecipeScreen = ({ navigation }) => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [serves, setServes] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState<string[]>(['']);
  const { width: windowWidth } = useWindowDimensions();

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Izin dibutuhkan', 'Akses galeri diperlukan.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // use supported enum
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Izin dibutuhkan', 'Akses kamera diperlukan.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // use supported enum
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddIngredient = () =>
    setIngredients([...ingredients, { name: '', quantity: '' }]);

  const handleIngredientChange = (
    index: number,
    key: 'name' | 'quantity',
    value: string
  ) => {
    const arr = [...ingredients];
    arr[index][key] = value;
    setIngredients(arr);
  };

  const handleAddStep = () => setSteps([...steps, '']);

  const handleStepChange = (index: number, value: string) => {
    const arr = [...steps];
    arr[index] = value;
    setSteps(arr);
  };

  const uploadRecipeImage = async (uri: string) => {
    try {
      const ext = uri.split('.').pop() || 'jpg';
      const rnd = Math.random().toString(36).slice(2, 10);
      const fileName = `${Date.now()}-${rnd}.${ext}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicURL },
        error: urlError,
      } = supabase.storage.from('recipe-images').getPublicUrl(fileName);
      if (urlError) throw urlError;

      return publicURL;
    } catch (e: any) {
      console.error('uploadRecipeImage error:', e);
      Alert.alert('Error', 'Gagal upload gambar resep');
      return null;
    }
  };

  const handleSave = async () => {
    if (
      !title.trim() ||
      !serves.trim() ||
      !cookTime.trim() ||
      ingredients.some(i => !i.name.trim() || !i.quantity.trim()) ||
      steps.some(s => !s.trim())
    ) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    let imageUrl = image;
    if (image && !image.startsWith('http')) {
      imageUrl = await uploadRecipeImage(image);
      if (!imageUrl) return;
    }

    const user = supabase.auth.user?.() || supabase.auth.session()?.user;
    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    const { error } = await supabase.from('recipes').insert([
      {
        user_id: user.id,
        title,
        serves,
        cook_time: cookTime,
        ingredients,
        steps,
        image_url: imageUrl,
      },
    ]);
    if (error) {
      console.error('Insert recipe error:', error);
      Alert.alert('Error', 'Gagal menyimpan resep!');
      return;
    }

    Alert.alert('Sukses', 'Resep berhasil disimpan!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#7F4F24" />
        </TouchableOpacity>

        <Text style={styles.title}>Buat Resep Baru</Text>

        <TouchableOpacity
          onPress={pickImage}
          style={[styles.imageContainer, { width: windowWidth - 40 }]}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={[styles.image, { width: windowWidth - 40 }]}
            />
          ) : (
            <View
              style={[styles.placeholderImage, { width: windowWidth - 40 }]}
            >
              <Ionicons name="image" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>Tambah Foto Resep</Text>
            </View>
          )}
          <TouchableOpacity onPress={takePhoto} style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>

        <TextInput
          placeholder="Nama Resep"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#B08968"
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Porsi"
            style={styles.smallInput}
            keyboardType="numeric"
            value={serves}
            onChangeText={setServes}
            placeholderTextColor="#B08968"
          />
          <TextInput
            placeholder="Waktu Masak (menit)"
            style={styles.smallInput}
            keyboardType="numeric"
            value={cookTime}
            onChangeText={setCookTime}
            placeholderTextColor="#B08968"
          />
        </View>

        <Text style={styles.sectionTitle}>Bahan-bahan</Text>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.row}>
            <TextInput
              placeholder="Nama Bahan"
              style={styles.mediumInput}
              value={ing.name}
              onChangeText={t => handleIngredientChange(idx, 'name', t)}
              placeholderTextColor="#B08968"
            />
            <TextInput
              placeholder="Jumlah"
              style={styles.mediumInput}
              value={ing.quantity}
              onChangeText={t => handleIngredientChange(idx, 'quantity', t)}
              placeholderTextColor="#B08968"
            />
          </View>
        ))}
        <TouchableOpacity onPress={handleAddIngredient}>
          <Text style={styles.addText}>+ Tambah Bahan</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Langkah-langkah</Text>
        {steps.map((step, idx) => (
          <TextInput
            key={idx}
            placeholder={`Langkah ${idx + 1}`}
            style={styles.input}
            value={step}
            onChangeText={t => handleStepChange(idx, t)}
            multiline
            placeholderTextColor="#B08968"
          />
        ))}
        <TouchableOpacity onPress={handleAddStep}>
          <Text style={styles.addText}>+ Tambah Langkah</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan Resep</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1, padding: 20, backgroundColor: '#FFF8F0' },
  backButton: { marginBottom: 8, alignSelf: 'flex-start' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, color: '#7F4F24' },
  imageContainer: {
    position: 'relative',
    marginBottom: 18,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    alignSelf: 'center',
  },
  image: {
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholderImage: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#FFE8D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#B08968', fontSize: 14, marginTop: 8 },
  cameraIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 15,
    color: '#7F4F24',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  smallInput: {
    backgroundColor: 'white',
    flex: 0.48,
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    color: '#7F4F24',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  mediumInput: {
    backgroundColor: 'white',
    flex: 0.48,
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    color: '#7F4F24',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 12,
    color: '#7F4F24',
  },
  addText: {
    color: '#EF4444',
    marginBottom: 24,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2,
  },
  saveButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default CreateRecipeScreen;

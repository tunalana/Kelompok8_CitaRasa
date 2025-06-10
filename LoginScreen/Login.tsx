import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView,
  Platform, Image, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Checkbox from 'expo-checkbox';
import { supabase } from '../supabaseClient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = {
  navigation: any; // Ganti dengan tipe NativeStackScreenProps jika kamu pakai @react-navigation/native-stack
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validasi', 'Email dan password wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const { user, session, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        Alert.alert('Gagal Login', error.message);
      } else if (user && session) {
        Alert.alert('Berhasil', 'Login sukses!');
        navigation.replace('Main');
      } else {
        Alert.alert('Gagal Login', 'Cek email verifikasi terlebih dahulu.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Masuk ke Akun Anda</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
            accessibilityLabel="Input email"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
              accessibilityLabel="Input password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel="Toggle password visibility"
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? '#EF4444' : undefined}
              />
              <Text style={styles.checkboxLabel}>Ingat saya</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Lupa kata sandi?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>{loading ? 'Loading...' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => Alert.alert('Info', 'Login dengan Google belum tersedia')}
          >
            <View style={styles.socialContent}>
              <Image
                source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Login dengan Google</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => Alert.alert('Info', 'Login dengan Facebook belum tersedia')}
          >
            <View style={styles.socialContent}>
              <FontAwesome
                name="facebook"
                size={20}
                color="#fff"
                style={styles.socialIcon}
              />
              <Text style={styles.facebookText}>Login dengan Facebook</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>
              Belum punya akun? <Text style={styles.signupLink}>Daftar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  headerContainer: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#7F4F24' },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#FFE5B4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { marginLeft: 6, color: '#7F4F24', fontSize: 13 },
  forgotText: { color: '#EF4444', textDecorationLine: 'underline', fontSize: 13 },
  loginButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 14,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  socialContent: { flexDirection: 'row', alignItems: 'center' },
  socialIcon: { width: 20, height: 20, marginRight: 8 },
  socialText: { color: '#000', fontWeight: '500' },
  facebookText: { color: '#fff', fontWeight: '500' },
  signupText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  signupLink: { color: '#EF4444', fontWeight: 'bold' },
});
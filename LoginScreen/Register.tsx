import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, Linking
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../supabaseClient'; // Import supabase client

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Semua field harus diisi.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Format email tidak valid.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak sama.');
      return;
    }
    if (!isChecked) {
      Alert.alert('Error', 'Anda harus menyetujui Terms & Conditions.');
      return;
    }

    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error && user) {
      // Insert ke tabel profiles setelah register
      await supabase.from('profiles').insert([
        { id: user.id, email }
      ]);
    }
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Sukses',
        'Registrasi berhasil! Silakan cek email untuk verifikasi.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
    }
  };

  const openTerms = () => Linking.openURL('https://yourapp.com/terms');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/favicon.png')} style={styles.logo} />
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkboxBox}>
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={openTerms}>
            MetaHealth Terms & Conditions
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} disabled>
        <View style={styles.socialContent}>
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Login with Google</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton} disabled>
        <View style={styles.socialContent}>
          <FontAwesome name="facebook" size={20} color="#fff" style={styles.socialIcon} />
          <Text style={styles.facebookText}>Login with Facebook</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>
          Sudah punya akun? <Text style={styles.signupLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyeIcon: {
    marginLeft: -30,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    marginRight: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#ff8c00',
    borderColor: '#ff8c00',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#ff8c00',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  googleButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontWeight: 'bold',
    color: '#000',
  },
  facebookText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
  },
  signupLink: {
    fontWeight: 'bold',
    color: '#000',
  },
});

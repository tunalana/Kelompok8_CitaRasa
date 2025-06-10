import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient'; // Import supabase client

export default function VerificationScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  // Ambil email dari params jika ada
  const email = route?.params?.email || 'your@email.com';

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }

    if (index === 3 && value) {
      Keyboard.dismiss();
      handleSubmit(newCode.join(''));
    }
  };

  // Fungsi verifikasi kode (magic link/email OTP)
  const handleSubmit = async (finalCode) => {
    if (finalCode.length < 4) {
      Alert.alert('Error', 'Kode harus 4 digit.');
      return;
    }
    setLoading(true);
    // Supabase tidak menyediakan verifikasi kode manual untuk sign up, 
    // biasanya user klik link di email. 
    // Jika kamu pakai OTP (one time password), gunakan supabase.auth.verifyOtp
    try {
      const { data, error } = await supabase.auth.api.verifyOTP({
        email,
        token: finalCode,
        type: 'email' as any, // Per Supabase v1.x, gunakan 'email' untuk Email OTP
        // Perbaikan: gunakan 'email' sebagai EmailOTPType
      });
      setLoading(false);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Sukses', 'Verifikasi berhasil!', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      }    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Terjadi kesalahan.');
    }
  };

  // Fungsi resend kode (mengirim ulang email verifikasi)
  const handleResend = async () => {
    setLoading(true);
    // Tidak ada method resend di Supabase v1.x, jadi gunakan signUp lagi untuk resend email verifikasi
    const { error } = await supabase.auth.signUp({ email });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Sukses', 'Kode verifikasi telah dikirim ulang ke email.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Enter 4 digit code</Text>
        <Text style={styles.subtitle}>
          Enter 4 digit code that you receive on your email ({email})
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputs.current[index] = ref; }}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(value) => handleChange(value, index)}
              value={digit}
              autoFocus={index === 0}
              returnKeyType="next"
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Not received a code?{' '}
          <Text style={styles.resendLink} onPress={handleResend}>
            {loading ? 'Sending...' : 'Resend'}
          </Text>
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit(code.join(''))} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    fontSize: 24,
    width: 60,
    height: 60,
    textAlign: 'center',
    color: '#000',
  },
  resendText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },
  resendLink: {
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF8A00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const FAQ = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState({ question: '', answer: '' });

  const openModal = (item) => {
    setSelectedFAQ(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header dengan tombol back */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={26} color="#d35400" />
        </TouchableOpacity>
        <Text style={styles.header}>Pertanyaan Umum (FAQ)</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {faqList.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => openModal(item)}>
            <Text style={styles.question}>🍽️ {item.question}</Text>
            <Text
              style={styles.answer}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.answer}
            </Text>
            <Text style={styles.lihatDetail}>Lihat detail</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal untuk detail FAQ */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalQuestion}>{selectedFAQ.question}</Text>
            <ScrollView>
              <Text style={styles.modalAnswer}>{selectedFAQ.answer}</Text>
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const faqList = [
  {
    question: 'Apakah aplikasi ResepKu ini gratis?',
    answer:
      'Ya, ResepKu sepenuhnya gratis dan bisa digunakan tanpa biaya berlangganan. Semua fitur tersedia tanpa perlu login premium.',
  },
  {
    question: 'Apakah semua resep di aplikasi ini bisa dipercaya?',
    answer:
      'Kami mengkurasi resep dari berbagai sumber terpercaya dan komunitas pengguna. Namun, selalu sesuaikan dengan selera dan kondisi dapur masing-masing.',
  },
  {
    question: 'Bisakah saya menyimpan resep favorit?',
    answer:
      'Tentu! Kamu bisa menggunakan fitur "Bookmark" untuk menyimpan resep favorit dan mengaksesnya kapan saja dari menu Bookmark.',
  },
  {
    question: 'Apakah saya bisa menambahkan resep sendiri?',
    answer:
      'Saat ini fitur untuk menambahkan resep pribadi belum tersedia. Namun, kami sedang mengembangkan fitur ini untuk update mendatang.',
  },
  {
    question: 'Kenapa gambar atau data resep tidak muncul?',
    answer:
      'Coba periksa koneksi internet kamu. Jika masih bermasalah, silakan coba tutup dan buka kembali aplikasi atau hubungi tim kami.',
  },
  {
    question: 'Bagaimana jika saya ingin mencari resep tertentu?',
    answer:
      'Gunakan fitur pencarian di halaman utama dan ketik nama resep atau bahan yang ingin kamu cari.',
  },
  {
    question: 'Apakah aplikasi ini bisa digunakan secara offline?',
    answer:
      'Sebagian fitur memerlukan koneksi internet, seperti memuat data terbaru. Namun, resep yang sudah dibuka bisa tetap diakses selama aplikasi tidak ditutup.',
  },
  {
    question: 'Apakah resep-resep di sini cocok untuk pemula?',
    answer:
      'Ya! Kami menyediakan resep dengan langkah-langkah yang mudah diikuti, cocok untuk pemula maupun yang sudah berpengalaman di dapur.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    paddingTop: Platform.OS === 'android' ? 32 : 48,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff8f0',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d35400',
    textAlign: 'center',
    marginRight: 34,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    minHeight: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  question: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  lihatDetail: {
    color: '#FF7622',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'right',
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
  modalQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalAnswer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'left',
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

export default FAQ;
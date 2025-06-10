import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import dataResep from "../Data/DataResep.json";
import imageMapping from "./imageMapping";

const DetailScreen = ({ route }: any) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const resep = dataResep.find(
    (r) => r.title.toLowerCase() === item.title?.toLowerCase()
  );
  if (!resep)
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Resep tidak ditemukan</Text>
      </View>
    );

  const langkahMemasak = Array.from({ length: resep.steps.length }, (_, index) => ({
    title: `Langkah ${index + 1}`,
    detail: resep.steps[index],
  }));

  let imageSource = imageMapping?.[resep.image];
  if (!imageSource) imageSource = require('../assets/Images/ayamBakar.jpg');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={styles.icon.color} />
        </TouchableOpacity>

        {/* Gambar Resep */}
        <Image
          source={imageSource}
          style={{
            width: width * 0.92,
            height: width * 0.5,
            borderRadius: 18,
            alignSelf: "center",
            marginBottom: 18,
            marginTop: 2,
            backgroundColor: "#FFE8D3",
          }}
          resizeMode="cover"
        />

        <View style={styles.header}>
          <Text style={styles.recipeTitle}>{resep.title}</Text>
          <Text style={styles.subTitle}>
            {resep.category} • {resep.releaseDate}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingValue}>{resep.rating.toFixed(2)}</Text>
        </View>

        {/* Info Ringkas */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, { marginRight: 12 }]}>
            <Ionicons name="person-outline" size={18} color="#B08968" />
            <Text style={styles.infoText}>{resep.chef}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color="#B08968" />
            <Text style={styles.infoText}>{resep.time || "?"} menit</Text>
          </View>
        </View>

        {/* Bahan-Bahan */}
        <View style={[styles.infoBox, { width: width * 0.92 }]}>
          <Text style={styles.sectionTitle}>Bahan-bahan</Text>
          {resep.ingredients?.map((bahan, idx) => (
            <Text key={idx} style={styles.infoValue}>
              • {bahan}
            </Text>
          ))}
        </View>

        {/* Langkah Memasak */}
        <View style={[styles.infoBox, { width: width * 0.92 }]}>
          <Text style={styles.sectionTitle}>Langkah Memasak</Text>
          {langkahMemasak.map((step, idx) => (
            <View key={idx} style={styles.stepItem}>
              <Text style={styles.infoLabel}>{step.title}</Text>
              <Text style={styles.infoValue}>{step.detail}</Text>
            </View>
          ))}
        </View>

        {/* Info Tambahan */}
        <View style={[styles.infoBox, { width: width * 0.92 }]}>
          <Text style={styles.sectionTitle}>Info Resep</Text>
          <Text style={styles.infoLabel}>Kategori:</Text>
          <Text style={styles.infoValue}>{resep.category}</Text>
          <Text style={styles.infoLabel}>Pembuat:</Text>
          <Text style={styles.infoValue}>{resep.chef}</Text>
          <Text style={styles.infoLabel}>Tanggal Rilis:</Text>
          <Text style={styles.infoValue}>{resep.releaseDate}</Text>
          <Text style={styles.infoLabel}>Deskripsi:</Text>
          <Text style={styles.infoValue}>{resep.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

const colors = {
  background: "#FFF8F0",
  primaryText: "#4E342E",
  secondaryText: "#6D4C41",
  accent: "#FF7622",
  sectionBg: "#FFE5B4",
  ratingStar: "#FFD700",
  icon: "#4E342E",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 0,
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginLeft: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
    alignSelf: "flex-start",
  },
  icon: {
    color: colors.icon,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  recipeTitle: {
    fontSize: 22,
    color: colors.primaryText,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  subTitle: {
    color: colors.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 2,
  },
  ratingStar: {
    color: colors.ratingStar,
    fontSize: 22,
  },
  ratingValue: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEFE5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  infoText: {
    color: "#7F4F24",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  infoBox: {
    backgroundColor: colors.sectionBg,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    marginTop: 0,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoLabel: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoValue: {
    color: colors.primaryText,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 4,
  },
  stepItem: {
    marginBottom: 12,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  notFoundText: {
    color: colors.primaryText,
    fontSize: 16,
  },
});

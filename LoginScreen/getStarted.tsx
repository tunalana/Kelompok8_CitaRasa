import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  image: any;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: '1',
    image: require('../assets/meal.png'),
    title: 'Personalized meal planning',
    description: 'Pick your meals in minutes. With over 700 recipes and custom options, eat what you love!',
  },
  {
    id: '2',
    image: require('../assets/image2.png'),
    title: 'Simple, stress-free grocery shopping',
    description: 'Grocery shopping has never been easier. Get everything you need for the week in one place.',
  },
  {
    id: '3',
    image: require('../assets/image3.png'),
    title: 'Delicious, healthy meals made easy',
    description: 'Easily create meals that nourish in about 20 minutes, from stove to table.',
  },
];

type RootStackParamList = {
  Register: undefined;
};

export default function GetStartedScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 100); // beri waktu render sebelum scroll
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Register');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index!);
      }
    }
  ).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged,
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        initialScrollIndex={0}
        extraData={currentIndex}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
        </Text>
      </TouchableOpacity>

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF7A00',
    width: '90%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF7A00',
    width: 12,
    height: 12,
  },
});

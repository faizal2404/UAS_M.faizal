import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [randomMovies, setRandomMovies] = useState<Movie[]>([]);
  const router = useRouter();

  const placeholderKeywords = ['avengers', 'batman', 'spider', 'star', 'war'];

  useEffect(() => {
    getRandomMovies();
  }, []);

  const getRandomMovies = async () => {
    const keyword = placeholderKeywords[Math.floor(Math.random() * placeholderKeywords.length)];
    try {
      const res = await fetch(`http://www.omdbapi.com/?apikey=b45dad4f&s=${keyword}`);
      const data = await res.json();
      if (data.Response === 'True') {
        setRandomMovies(data.Search.slice(0, 5));
      }
    } catch (err) {
      console.error('Gagal ambil film random');
    }
  };

  const fetchMovies = async () => {
    if (!search.trim()) {
      setMovies(null);
      setError('❗ Silakan masukkan nama film.');
      return;
    }

    setLoading(true);
    setError('');
    setMovies(null);

    try {
      const res = await fetch(`http://www.omdbapi.com/?apikey=b45dad4f&s=${search}`);
      const data = await res.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError('❌ Film tidak ditemukan.');
      }
    } catch {
      setError('⚠️ Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/100x150?text=No+Image',
        }}
        style={styles.poster}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.Title}</Text>
        <Text style={styles.cardText}>Tahun: {item.Year}</Text>
        <Text style={styles.cardText}>Tipe: {item.Type}</Text>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => router.push(`/detail?imdbID=${item.imdbID}`)}
        >
          <Text style={styles.detailButtonText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0C3B" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>OCEANFILM</Text>

          {randomMovies.length > 0 && (
            <Carousel
              loop
              width={width}
              height={240}
              autoPlay
              data={randomMovies}
              scrollAnimationDuration={3000}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/detail?imdbID=${item.imdbID}`)}
                  style={styles.sliderCard}
                >
                  <Image source={{ uri: item.Poster }} style={styles.sliderImage} />
                  <Text style={styles.sliderTitle}>{item.Title}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="🔍 Cari film favoritmu..."
              placeholderTextColor="#ccc"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchButton} onPress={fetchMovies}>
              <Text style={styles.searchButtonText}>Cari</Text>
            </TouchableOpacity>
          </View>

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

          {!loading && movies && (
            <FlatList
              data={movies}
              keyExtractor={(item) => item.imdbID}
              renderItem={renderMovieCard}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 80,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2857',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: width - 32,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#4C4E91',
    fontWeight: 'bold',
  },
  sliderCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderImage: {
    width: width * 0.9,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
    marginTop: 10,
  },
  sliderTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2A2857',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  poster: {
    width: 100,
    height: 150,
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: '#4C4E91',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
});

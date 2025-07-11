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
      const res = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&s=${keyword}`);
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
      const res = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&s=${search}`);
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <View style={{ width: '100%', paddingHorizontal: 16 }}>
              <FlatList
                data={movies}
                keyExtractor={(item) => item.imdbID}
                renderItem={renderMovieCard}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0C3B' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 40,
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2857',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '100%',
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
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    elevation: 2,
  },
  searchButtonText: {
    color: '#4C4E91',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sliderCard: { justifyContent: 'center', alignItems: 'center' },
  sliderImage: {
    width: width * 0.9,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 14,
    marginTop: 10,
    elevation: 4,
  },
  sliderTitle: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
  },
  errorText: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2A2857',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
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
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  detailButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
});

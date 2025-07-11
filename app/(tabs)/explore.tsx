import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

const keywords = ['avengers', 'harry', 'fast', 'matrix', 'spider'];

export default function ExploreScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=b45dad4f&s=${randomKeyword}`
      );
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError('❌ Tidak ada film trending ditemukan.');
      }
    } catch (err) {
      setError('⚠️ Gagal mengambil data trending film.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.Poster !== 'N/A'
              ? item.Poster
              : 'https://via.placeholder.com/100x150?text=No+Image',
        }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.Title}</Text>
        <Text style={styles.meta}>Tahun: {item.Year}</Text>
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

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.header}>🎬 Film Trending</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2A2857',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  meta: {
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
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#4C4E91',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type MovieDetail = {
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Runtime: string;
};

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof imdbID !== 'string') return;

    fetch(`https://www.omdbapi.com/?apikey=b45dad4f&i=${imdbID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === 'True') {
          setMovie(data);
        }
      })
      .catch(() => {
        setMovie(null);
      })
      .finally(() => setLoading(false));
  }, [imdbID]);

  if (loading) {
    return (
      <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!movie) {
    return (
      <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.centered}>
        <Text style={styles.errorText}>❌ Gagal memuat data film.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Kembali</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0C3B" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Kembali</Text>
        </TouchableOpacity>

        <Image
          source={{
            uri:
              movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/300x450?text=No+Image',
          }}
          style={styles.poster}
        />

        <View style={styles.card}>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.detail}>Tahun: {movie.Year}</Text>
          <Text style={styles.detail}>Durasi: {movie.Runtime}</Text>
          <Text style={styles.detail}>IMDb: {movie.imdbRating}</Text>
          <Text style={styles.detail}>Genre: {movie.Genre}</Text>
          <Text style={styles.detail}>Sutradara: {movie.Director}</Text>
          <Text style={styles.detail}>Aktor: {movie.Actors}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.plot}>{movie.Plot}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 16,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#2A2857',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  detail: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  plot: {
    fontSize: 15,
    color: '#f0f0f0',
    lineHeight: 22,
    textAlign: 'left',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4C4E91',
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

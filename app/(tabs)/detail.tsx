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
  Released: string;
  Country: string;
  Writer: string;
  Language: string;
  Awards: string;
};

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof imdbID !== 'string') return;

    fetch(`http://www.omdbapi.com/?apikey=b45dad4f&i=${imdbID}`)
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
        <Text style={styles.errorText}>Gagal memuat data film.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0C3B" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  <Text style={styles.backButtonText}>← Kembali</Text>
</TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/300x450?text=No+Image',
            }}
            style={styles.poster}
          />
        </View>

        
        <Text style={styles.title}>{movie.Title}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.detail}>Rilis: {movie.Released}</Text>
          <Text style={styles.detail}>Bahasa: {movie.Language}</Text>
          <Text style={styles.detail}>Durasi: {movie.Runtime}</Text>
          <Text style={styles.detail}>IMDb Rating: {movie.imdbRating}</Text>
          <Text style={styles.detail}>Genre: {movie.Genre}</Text>
          <Text style={styles.detail}>Sutradara: {movie.Director}</Text>
          <Text style={styles.detail}>Penulis: {movie.Writer}</Text>
          <Text style={styles.detail}>Pemeran: {movie.Actors}</Text>
        </View>

        
        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.plot}>{movie.Plot}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  poster: {
    width: 240,
    height: 360,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#2A2857',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detail: {
    fontSize: 15,
    color: '#ddd',
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
    textAlign: 'justify',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  backButton: {
  alignSelf: 'flex-start',
  marginVertical: 16,
  backgroundColor: '#4C4E91',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  });

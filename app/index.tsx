import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 2500); // Delay 2.5 detik

    return () => clearTimeout(timer); // Clear timer kalau komponen unmount
  }, []);

  return (
    <LinearGradient colors={['#0D0C3B', '#1E1B5A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0C3B" />
      <Text style={styles.title}>OCEANFILM</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
});

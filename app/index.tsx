import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/hero'); // Redirect to the hero page
  };

  return (
    <LinearGradient
      colors={['#242424', '#242424']}
      style={styles.container}
    >
      <Image
        source={require('../assets/images/robot.gif')} // Replace with your GIF URL
        style={styles.gif}
      />
      <Text style={styles.title}>Welcome to AI Image Generator</Text>
      <Text style={styles.info}>
        Unleash the power of AI to create stunning images with just a prompt.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#242424',
  },
  gif: {
    width: 400,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#FF6000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
});

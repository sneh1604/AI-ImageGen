import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
  Share,
  Animated,
  Easing,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;



const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

async function query(data: { inputs: string }): Promise<string> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large',
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody}`);
    }

    const blob = await response.blob();
    return await blobToBase64(blob) as string;
  } catch (error) {
    console.error('Error in query function:', error);
    throw error;
  }
}

export default function HeroScreen() {
  const [prompt, setPrompt] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animated placeholder prompt logic
  const placeholderOptions = [
    'Describe a sunset in the mountains...',
    'Imagine a futuristic city...',
    'Create a surreal dreamscape...',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholderAnim = new Animated.Value(0);

  // Function to animate the placeholder
  const animatePlaceholder = () => {
    placeholderAnim.setValue(0);
    Animated.timing(placeholderAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
    });
  };

  const saveToGallery = async () => {
    if (!imageData || !prompt) return;

    try {
      const galleryData = await AsyncStorage.getItem('gallery');
      const savedImages = galleryData ? JSON.parse(galleryData) : [];
      const newEntry = { prompt, imageData };
      await AsyncStorage.setItem('gallery', JSON.stringify([...savedImages, newEntry]));
      Alert.alert('Saved to Gallery', 'Your image and prompt have been saved!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Error', 'Could not save to gallery.');
    }
  };


  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: string = await query({ inputs: prompt });
      setImageData(result);
    } catch (error) {
      setError('Failed to generate image. Please try again.');
      console.error('Error generating image:', error);
    }
    setLoading(false);
    await saveToGallery();
  };

  const saveImage = async () => {
    if (!imageData) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'To save images, allow access to media library.');
      return;
    }

    try {
      const fileUri = `${FileSystem.documentDirectory}generatedImage.jpg`;
      await FileSystem.writeAsStringAsync(fileUri, imageData.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('AI Images', asset, false);
      Alert.alert('Image Saved!', 'Your image has been saved to the gallery.');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'There was a problem saving the image.');
    }
  };

  const shareImage = async () => {
    if (!imageData) return;

    try {
      const fileUri = `${FileSystem.documentDirectory}sharedImage.jpg`;
      await FileSystem.writeAsStringAsync(fileUri, imageData.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.share({
        message: 'Check out this AI-generated image!',
        url: fileUri,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'There was a problem sharing the image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FontAwesome name="magic" size={48} color="#6C5BD4" style={styles.icon} />
      <Text style={styles.title}>AI Image Generator</Text>
      <Text style={styles.subtitle}>Create stunning images with AI</Text>

      <Animated.View style={{ opacity: placeholderAnim }}>
        <TextInput
          style={styles.input}
          placeholder={placeholderOptions[placeholderIndex]}
          value={prompt}
          onChangeText={setPrompt}
          placeholderTextColor="#aaa"
          onFocus={animatePlaceholder}
          onBlur={animatePlaceholder}
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.button, loading || !prompt.trim() ? styles.buttonDisabled : null]}
        onPress={handleGenerateImage}
        disabled={loading || !prompt.trim()}
      >
        <Text style={styles.buttonText}>{loading ? 'Generating...' : 'Generate Image'}</Text>
        {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6C5BD4" style={styles.loading} />}

      {!loading && imageData && (
        <>
          <Image source={{ uri: `data:image/jpeg;base64,${imageData.split(',')[1]}` }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={saveImage}>
              <Text style={styles.saveButtonText}>Save Image</Text>
              <FontAwesome name="download" size={16} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareImage}>
              <Text style={styles.shareButtonText}>Share Image</Text>
              <FontAwesome name="share-alt" size={16} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6C5BD4',
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C5BD4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loader: {
    marginLeft: 10,
  },
  loading: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 30,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#FF6000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6000',
    marginTop: 10,
    textAlign: 'center',
  },
});

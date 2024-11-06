import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

export default function GalleryScreen() {
  interface GalleryItem {
    imageData: string;
    prompt: string;
  }

  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const galleryData = await AsyncStorage.getItem('gallery');
      const savedGallery = galleryData ? JSON.parse(galleryData) : [];
      setGallery(savedGallery);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const regenerateImage = (prompt: string) => {
    Alert.alert('Regenerate', `Regenerating image for prompt: ${prompt}`);
    // Trigger image regeneration logic here using the prompt
  };

  const deleteImage = async (index: number) => {
    try {
      const updatedGallery = [...gallery];
      updatedGallery.splice(index, 1);
      await AsyncStorage.setItem('gallery', JSON.stringify(updatedGallery));
      setGallery(updatedGallery);
      Alert.alert('Deleted', 'Image has been deleted from the gallery.');
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Could not delete image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {gallery.map((item, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri: `data:image/jpeg;base64,${item.imageData.split(',')[1]}` }} style={styles.image} />
          <Text style={styles.promptText}>{item.prompt}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => regenerateImage(item.prompt)}>
              <FontAwesome name="refresh" size={24} color="#6C5BD4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteImage(index)}>
              <FontAwesome name="trash" size={24} color="red" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#242424',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

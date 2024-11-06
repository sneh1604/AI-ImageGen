import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

export default function ContactUsScreen() {
  const contactInfo = {
    name: 'Sneh Shah',
    email: 'snehpshah5721@gmail.com',
    phone: '+91 9824501807',
    address: 'Ahmedabad, Gujarat, India',
    portfolio: 'https://myportfolio-iota-ashy.vercel.app/', // Replace with your actual portfolio link
    github: 'https://github.com/sneh1604' // Replace with your actual GitHub profile link
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactInfo.email}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${contactInfo.phone}`);
  };

  const handlePortfolioPress = () => {
    Linking.openURL(contactInfo.portfolio);
  };

  const handleGithubPress = () => {
    Linking.openURL(contactInfo.github);
  };

  const renderContactItem = (icon: JSX.Element, label: string, value: string, onPress: (() => void) | null) => (
    <TouchableOpacity style={styles.infoBox} onPress={onPress ?? undefined} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Get in Touch</Text>
      {renderContactItem(<FontAwesome name="user" size={28} color="#fff" />, 'Name', contactInfo.name, null)}
      {renderContactItem(<MaterialIcons name="email" size={28} color="#fff" />, 'Email', contactInfo.email, handleEmailPress)}
      {renderContactItem(<Feather name="phone" size={28} color="#fff" />, 'Phone', contactInfo.phone, handlePhonePress)}
      {renderContactItem(<FontAwesome name="map-marker" size={28} color="#fff" />, 'Address', contactInfo.address, null)}
      {renderContactItem(<FontAwesome name="globe" size={28} color="#fff" />, 'Portfolio', 'View My Work', handlePortfolioPress)}
      {renderContactItem(<FontAwesome name="github" size={28} color="#fff" />, 'GitHub', 'View My Projects', handleGithubPress)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C5BD4',
    marginBottom: 30,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#6C5BD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    backgroundColor: '#6C5BD4',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6000',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
  },
});

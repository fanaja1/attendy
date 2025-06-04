import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setupDatabase } from '../database/db';
import { useLogNavigationStack } from '../utils/hooks';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<any, 'Home'>;

const Home = ({ navigation }: Props) => {
  useLogNavigationStack();

  useEffect(() => {
    setupDatabase();
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleEnter = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('GroupList');
    });
  };

  const handleDeleteDb = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer la base de données ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite/attendy.db`);
              Alert.alert('Succès', 'Base de données supprimée. Redémarrez l\'application.');
            } catch (e) {
              Alert.alert('Erreur', 'Échec de la suppression : ' + e);
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const color1 = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00C6FF', '#FFDEE9'],
  });

  const color2 = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#B5FFFC'],
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#00C6FF', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.settingsRow}>
          <TouchableOpacity style={styles.settingsIconButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsTextButton} onPress={handleSettings}>
            <Text style={styles.settingsText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Rehefa tara dia tara</Text>

        <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleEnter}>
            <Text style={styles.buttonText}>Entrer</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDb}>
          <Text style={styles.deleteButtonText}>Supprimer la base de données</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 20,
  },
  title: {
    fontFamily: 'Exo-Bold',
    fontSize: 24,
    color: '#333',
  },
  animatedButton: {
    width: '80%',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '80%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  settingsText: {
    fontSize: 12,
    color: '#333',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    right: 20,
    gap: 6,
  },
  settingsIconButton: {
    backgroundColor: '#eaeaea',
    padding: 6,
    borderRadius: 12,
    marginRight: 4,
  },
  settingsTextButton: {
    backgroundColor: '#eaeaea',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

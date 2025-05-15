import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setupDatabase, getGroups } from '../database/db';
import { useLogNavigationStack } from '../utils/hooks';

import * as FileSystem from 'expo-file-system'; // Ajoute ceci en haut

type Props = NativeStackScreenProps<any, 'Home'>;

const Home = ({ navigation }: Props) => {
  useLogNavigationStack();

  const handlePress = () => {
    navigation.navigate('GroupList');
  };

  const handleDeleteDb = async () => {
    try {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite/attendy.db`);
      alert('Base de données supprimée. Redémarrez l\'application.');
    } catch (e) {
      alert('Erreur lors de la suppression : ' + e);
    }
  };

  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <View>
      <Text>Welcome to the App</Text>
      <Button title="Enter" onPress={handlePress} />
      <Button title="Supprimer la base de données" color="red" onPress={handleDeleteDb} />
    </View>
  );
}

export default Home;
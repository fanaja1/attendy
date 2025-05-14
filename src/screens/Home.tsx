import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setupDatabase, getGroups } from '../database/db';
import { useLogNavigationStack } from '../utils/hooks';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function Home({ navigation }: Props) {
  useLogNavigationStack();

  const handlePress = () => {
    navigation.navigate('GroupList');
  };

  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <View>
      <Text>Welcome to the App</Text>
      <Button title="Enter" onPress={handlePress} />
    </View>
  );
}

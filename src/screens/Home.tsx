import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setupDatabase, getGroups } from '../database/db';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function Home({ navigation }: Props) {
  const [isFirstRun, setIsFirstRun] = useState<boolean>(false);

  const handlePress = () => {
    const classes = getGroups();
    if (classes.length === 0) {
      navigation.navigate('CreateGroup');
    } else {
      navigation.navigate('GroupList');
    }
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

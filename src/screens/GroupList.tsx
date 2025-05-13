import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getGroups } from '../database/db';

type Props = NativeStackScreenProps<any, 'GroupList'>;

export default function GroupList({ navigation }: Props) {
  const groups = getGroups();

  return (
    <View>
      <Text>Group List:</Text>
      {groups.map((cls, index) => (
        <Text key={index}>{cls.name}</Text>
      ))}
      <Button title="Add New Group" onPress={() => navigation.navigate('CreateGroup')} />
    </View>
  );
}

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addGroup, getMembers } from '../database/db';
import { RootStackParamList } from '../types/navigation';
import uuid from 'react-native-uuid';

type AddGroupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddGroup'>;

export default function AddGroup() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const navigation = useNavigation<AddGroupNavigationProp>();

  const handleAddGroup = () => {
    const newGroup = {
      id: uuid.v4() as string,
      name,
      location,
    };

    addGroup(newGroup.id, newGroup.name, newGroup.location);

    const members = getMembers(newGroup.id);

    if (members.length === 0) {
      navigation.navigate('AddMember', { groupId: newGroup.id });
    } else {
      navigation.navigate('Dashboard', { groupId: newGroup.id });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Save" onPress={handleAddGroup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});

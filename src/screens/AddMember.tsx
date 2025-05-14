import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addMember } from '../database/db';
import { RootStackParamList } from '../types/navigation';
import uuid from 'react-native-uuid';
import { useLogNavigationStack } from '../utils/hooks';

type AddMemberNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddMember'>;
type AddMemberRouteProp = RouteProp<RootStackParamList, 'AddMember'>;

export default function AddMember() {
  useLogNavigationStack();

  const [name, setName] = useState('');
  const navigation = useNavigation<AddMemberNavigationProp>();
  const route = useRoute<AddMemberRouteProp>();
  const { groupId } = route.params;

  const handleAddMember = () => {
    const newMember = {
      id: uuid.v4() as string,
      groupId,
      name,
    };

    addMember(newMember.id, newMember.groupId, newMember.name);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Member Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Add Member" onPress={handleAddMember} />
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

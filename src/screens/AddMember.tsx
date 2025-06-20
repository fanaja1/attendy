import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addMember, incrementTotalMembers } from '../database/db';
import { RootStackParamList } from '../types/navigation';
import { useLogNavigationStack } from '../utils/hooks';
import AppLayout from '../components/AppLayout';

type AddMemberNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddMember'>;
type AddMemberRouteProp = RouteProp<RootStackParamList, 'AddMember'>;

const AddMember = () => {
  useLogNavigationStack();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [designation, setDesignation] = useState('');
  const navigation = useNavigation<AddMemberNavigationProp>();
  const route = useRoute<AddMemberRouteProp>();
  const { groupId } = route.params;

  const handleAddMember = () => {
    // Génère un ID unique pour le membre
    const numero = incrementTotalMembers(groupId) || 0;
    const newMemberId = `${groupId}-${numero?.toString().padStart(3, '0')}`;

    const newMember = {
      id: newMemberId,
      groupId,
      lastName,
      firstName,
      numero,
      designation,
    };
    
    addMember({id: newMember.id, groupId: newMember.groupId, lastName: newMember.lastName, firstName: newMember.firstName, numero: newMember.numero, designation: newMember.designation});
    navigation.goBack();
  };

  return (
    <AppLayout style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Member Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Button title="Add Member" onPress={handleAddMember} />
    </AppLayout>
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

export default AddMember;
import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Group } from '../types/models';
import { deleteGroup, getGroups } from '../database/db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useLogNavigationStack } from '../utils/hooks';

type GroupListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroupList'>;

export default function GroupList() {
  useLogNavigationStack();

  const [groups, setGroups] = useState<Group[]>([]);
  const navigation = useNavigation<GroupListNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      const data = getGroups();
      if (data.length === 0) {
        navigation.navigate('AddGroup');
      } else {
        setGroups(data);
      }
    }, [])
  );

  const handleDelete = (id: string) => {
    try {
      deleteGroup(id);
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
      console.log(`Group ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
    }
  };

  const handlePressGroup = (group: Group) => {
    navigation.navigate('Dashboard', { groupId: group.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressGroup(item)} style={styles.groupItem}>
            <View>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupLocation}>{item.location}</Text>
            </View>
            <Button title="Delete" color="#d00" onPress={() => handleDelete(item.id)} />
          </TouchableOpacity>
        )}
      />
      <Button title="Add Group" onPress={() => navigation.navigate('AddGroup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  groupItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  groupLocation: {
    fontSize: 14,
    color: '#777',
  },
});

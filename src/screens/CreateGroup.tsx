import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addGroup } from '../database/db';

const CreateGroup = () => {
  const [className, setClassName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    addGroup('new_id', className, location);
    setClassName('');
    setLocation('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group Name</Text>
      <TextInput
        style={styles.input}
        value={className}
        onChangeText={setClassName}
        placeholder="Enter group name"
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />
      <Button title="Create Group" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default CreateGroup;

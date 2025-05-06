import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateClassScreen = () => {
    const [className, setClassName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = () => {
        console.log('Class Name:', className);
        console.log('Location:', location);
        // Add your form submission logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Class Name</Text>
            <TextInput
                style={styles.input}
                value={className}
                onChangeText={setClassName}
                placeholder="Enter class name"
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
            />
            <Button title="Submit" onPress={handleSubmit} />
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

export default CreateClassScreen;
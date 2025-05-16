import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, Modal, Switch, TextInput } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Member } from '../types/models';
import { addDate, getDates, getMembersByGroup, getPresenceMap } from '../database/db';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLogNavigationStack } from '../utils/hooks';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

const Dashboard = () => {
  useLogNavigationStack();

  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { groupId } = route.params;

  const [members, setMembers] = useState<Member[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [presenceMap, setPresenceMap] = useState<Record<string, string[]>>({});

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [useTime, setUseTime] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [tolerance, setTolerance] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const data = getMembersByGroup(groupId);
      if (data.length === 0) {
        navigation.navigate('AddMember', { groupId });
        return;
      }

      const presence = getPresenceMap(groupId);

      setMembers(data);
      setPresenceMap(presence);

      // You may want to compute all unique dates dynamically from presence
      const uniqueDates = Array.from(new Set(Object.values(presence).flat()));
      setDates(getDates(groupId));
    }, [groupId])
  );

  const handlePressMember = (memberId: string) => {
    navigation.navigate('MemberInfo', { memberId });
  };

  return (
    <View style={styles.container}>
      <Modal visible={showModal} transparent>
        <View style={styles.modalContainer}>
          <Text>Choisir une date :</Text>
          <Button title="Sélectionner une date" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(e, date) => {
                if (date) setSelectedDate(date);
                setShowDatePicker(false);
              }}
            />
          )}

          <View style={styles.row}>
            <Text>Utiliser l’heure</Text>
            <Switch value={useTime} onValueChange={setUseTime} />
          </View>

          {useTime && (
            <>
              <Text>Heure de début :</Text>
              <Button title="Choisir" onPress={() => setShowStartTimePicker(true)} />
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={(e, time) => {
                    if (time) setStartTime(time);
                    setShowStartTimePicker(false);
                  }}
                />
              )}

              <Text>Heure de fin :</Text>
              <Button title="Choisir" onPress={() => setShowEndTimePicker(true)} />
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={(e, time) => {
                    if (time) setEndTime(time);
                    setShowEndTimePicker(false);
                  }}
                />
              )}

              <Text>Tolérance (minutes) :</Text>
              <TextInput
                keyboardType="numeric"
                value={tolerance}
                onChangeText={setTolerance}
                style={styles.input}
              />
            </>
          )}

          <Button title="Valider" />
          {/* onPress={handleSaveDate} /> */}
        </View>
      </Modal>

      <View style={styles.header}>
        <Button title="Scan Presence" onPress={() => navigation.navigate('ScanPresence', { groupId })} />
        <Button title="Add Date" onPress={() => setShowModal(true)} />
      </View>


      <ScrollView horizontal>
        <View>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            {dates.map((date, index) => (
              <Text key={index} style={[styles.cell, styles.headerCell]}>{date}</Text>
            ))}
          </View>

          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressMember(item.id)}>
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{item.name}</Text>
                  {dates.map((date, index) => {
                    const present = presenceMap[item.id]?.includes(date);
                    return (
                      <Text key={index} style={styles.cell}>
                        {present ? '✔️' : '❌'}
                      </Text>
                    );
                  })}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Add Member" onPress={() => navigation.navigate('AddMember', { groupId })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cell: {
    width: 100,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
  // Styles ajoutés :
  modalContainer: {
    backgroundColor: 'white',
    margin: 32,
    padding: 24,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
    width: 80,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
});

export default Dashboard;
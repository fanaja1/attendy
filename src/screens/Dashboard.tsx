import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, Modal, Switch, TextInput } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DateEntry, Member, Presence } from '../types/models';
import { addDate, getDates, getMembersByGroup, getPresenceMap } from '../database/db';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLogNavigationStack } from '../utils/hooks';
import AppLayout from '../components/AppLayout';
import { handleExportXLSX } from '../utils/exports';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

const Dashboard = () => {
  useLogNavigationStack();

  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { groupId } = route.params;

  const [members, setMembers] = useState<Member[]>([]);
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [presenceMap, setPresenceMap] = useState<Record<string, Presence[]>>({});

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [useTime, setUseTime] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [tolerance, setTolerance] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

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
      setDates(getDates(groupId));
    }, [groupId])
  );

  const handlePressMember = (memberId: string) => {
    navigation.navigate('MemberInfo', { memberId });
  };

  const handleSaveDate = () => {
    let dateStr = selectedDate.toISOString().slice(0, 10);
    if (useTime) {
      const start = startTime.toTimeString().slice(0, 5);
      dateStr += ` ${start}`;
      if (tolerance) {
        dateStr += ` (tolérance: ${tolerance}min)`;
      }
    }

    addDate(
      groupId,
      dateStr, // ta date principale
      useTime ? startTime.toTimeString().slice(0, 5) : null,
      useTime && tolerance ? parseInt(tolerance, 10) : 0
    );

    setDates(getDates(groupId));

    setShowModal(false);

    setUseTime(false);
    setTolerance('');
  };

  const onPressExportButton = async () => {
    handleExportXLSX(dates, members, presenceMap);
  }

  return (
    <AppLayout style={styles.container}>
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

              <Text>Tolérance (minutes) :</Text>
              <TextInput
                keyboardType="numeric"
                value={tolerance}
                onChangeText={setTolerance}
                style={styles.input}
              />
            </>
          )}

          <Button title="Valider" onPress={handleSaveDate} />
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.appTitle}>Attendy</Text>
        </View>
        <Menu>
          <MenuTrigger>
            <Text style={styles.menuIcon}>⋮</Text>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate('AddMember', { groupId })} text="Add Member" />
            <MenuOption onSelect={onPressExportButton} text="Exporter XLSX" />
          </MenuOptions>
        </Menu>
      </View>

      <ScrollView style={styles.table} contentContainerStyle={{ flexDirection: 'row' }}>
        <View>
          <View style={{height: 100}}></View>
          {members.map((item, idx) => (
            <TouchableOpacity key={item.id} onPress={() => handlePressMember(item.id)}>
              <View style={styles.tableRow}>
                <Text style={styles.nameCell}>{item.firstName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scroll horizontal pour les dates et présences */}
        <ScrollView horizontal style={{ flex: 1 }}>
          <View>
            {/* Header dates sur une seule ligne */}
            <View style={styles.tableHeader}>
              {dates.map((dateEntry, index) => {
                const dateOnly = dateEntry.value.slice(0, 10);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('InformationsDate', { groupId, dateEntry })}
                    style={styles.headerCell}
                  >
                    <View style={{ transform: [{ rotate: '-90deg' }]}}>
                      <Text style={[styles.rotatedDate, { width: 100, textAlign: 'center', padding: 0 }]}>
                        {dateOnly}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* Lignes de présences */}
            {members.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                {dates.map((dateEntry, index) => {
                  const presence = presenceMap[item.id]?.find(p => p.date === dateEntry.value);
                  let symbol = '❌';
                  if (presence) {
                    if (presence.status === 'present') symbol = '✔️';
                    else if (presence.status === 'retard') symbol = `⏰${presence.retardMinutes}`;
                    else if (presence.status === 'permission') symbol = '📝';
                    else if (presence.status === 'absent') symbol = '❌';
                  }
                  return (
                    <Text key={index} style={styles.dateCell}>
                      {symbol}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerBtn}>
          <Button title="Add Date" onPress={() => setShowModal(true)} color="#2e86de" />
        </View>
        <View style={styles.footerBtn}>
          <Button title="Scan Presence" onPress={() => navigation.navigate('ScanPresence', { groupId })} color="#2e86de" />
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  menuIcon: {
    fontSize: 28,
    padding: 8,
    color: '#fff',
  },
  footer: {
    marginTop: 16,
    borderColor: '#ddd',
    marginBottom: 16,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 12,
  },
  footerBtn: {
  flex: 1,
  marginHorizontal: 20,
  minWidth: 50, 
  maxWidth: 180, 
  alignSelf: 'stretch', 
},
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    minWidth: '100%',
    padding: 6,
  },
  nameCell: {
    width: 120,
    maxWidth: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  dateCell: {
    width: 30,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
    // borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    // width: '100%',
    alignItems: 'flex-end',
    marginBottom: 0,
  },
  headerCell: {
    width: 30,
    height:100,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  rotatedDate: {
    height: 30,
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 0,
    backgroundColor: '#eee',
    fontWeight: 'bold',
  },
});

export default Dashboard;
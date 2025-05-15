import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Member } from '../types/models';
import { addDate, getDates, getMembersByGroup, getPresenceMap } from '../database/db';
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
      <View style={styles.header}>
        <Button title="Scan Presence" onPress={() => navigation.navigate('ScanPresence', { groupId })} />
        <Button title="Add Date" onPress={() => {
          const newDate = new Date().toISOString().split('T')[0];
          addDate(groupId, newDate);
          setDates(getDates(groupId));
        }} />
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
});

export default Dashboard;
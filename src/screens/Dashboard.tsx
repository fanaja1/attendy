import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Member } from '../types/models';
import { getMembers } from '../database/db';
import { useLogNavigationStack } from '../utils/hooks';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  useLogNavigationStack();

  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { groupId } = route.params;

  const [members, setMembers] = useState<Member[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const data = getMembers(groupId);
      if (data.length === 0) {
        navigation.navigate('AddMember', { groupId });
        return;
      }
      setMembers(data);
      setDates(['2025-05-01', '2025-05-05', '2025-05-10']);
    }, [groupId])
  );

  const handlePressMember = (memberId: string) => {
    navigation.navigate('MemberInfo', { memberId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Take manually" onPress={() => {}} />
        <Button title="Scan Presence" onPress={() => navigation.navigate('ScanPresence', { groupId })} />
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
                  {dates.map((_, index) => (
                    <Text key={index} style={styles.cell}></Text>
                  ))}
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
}

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

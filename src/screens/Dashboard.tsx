import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Member } from '../types/models';
import { getMembers } from '../database/db'; // Assurez-vous d'avoir une fonction pour récupérer les membres

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { groupId } = route.params;  // Utilisation du groupId passé via les params de la route

  const [members, setMembers] = useState<Member[]>([]); 
  const [dates, setDates] = useState<string[]>([]); 

  useEffect(() => {
    // Récupérer les membres du groupe et les dates de présence
    const fetchMembers = () => {
      // Récupérer les membres et dates depuis la base de données
      const fetchedMembers = getMembers(groupId);
      setMembers(fetchedMembers);

      // Vous pouvez aussi récupérer les dates de présence depuis la base de données
      // pour l'instant je vais ajouter des dates fictives
      setDates(['2025-05-01', '2025-05-05', '2025-05-10']);
    };
    fetchMembers();
  }, [groupId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="Add Member" onPress={() => navigation.navigate('AddMember', { groupId })} />
        <Button title="Take Presence" onPress={() => {}} />
      </View>

      {/* Tableau de présence */}
      <ScrollView horizontal>
        <View>
          {/* En-tête */}
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            {dates.map((date, index) => (
              <Text key={index} style={[styles.cell, styles.headerCell]}>{date}</Text>
            ))}
          </View>

          {/* Lignes de membres */}
          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.cell}>{item.name}</Text>
                {dates.map((_, index) => (
                  <Text key={index} style={styles.cell}></Text> // Cellules vides pour le moment
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Footer */}
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

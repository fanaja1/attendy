import React, { useState } from 'react';
import { View, Text, Button, Modal, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { DateEntry, Member } from '../types/models';
import { getMembersByGroup, getPresenceMap, addPresence } from '../database/db';

type InformationsDateRouteProp = RouteProp<RootStackParamList, 'InformationsDate'>;

const InformationsDate = () => {
  const navigation = useNavigation();
  const route = useRoute<InformationsDateRouteProp>();
  console.log('route', route.params);
  const { groupId, dateEntry } = route.params as { groupId: string, dateEntry: DateEntry };

  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [showEditPresenceModal, setShowEditPresenceModal] = useState<{ memberId: string } | null>(null);

  const members = getMembersByGroup(groupId);
  const presenceMap = getPresenceMap(groupId);
  console.log('members', members);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={() => setShowEditDateModal(true)}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
          {dateEntry.value}
        </Text>
      </TouchableOpacity>
      <Modal visible={showEditDateModal} transparent>
        {/* Ajoute ici ton UI pour éditer la date */}
        <View style={{ backgroundColor: 'white', margin: 32, padding: 24, borderRadius: 12 }}>
          <Text>Édition de la date (à implémenter)</Text>
          <Button title="Fermer" onPress={() => setShowEditDateModal(false)} />
        </View>
      </Modal>

      <FlatList
        data={members}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const present = presenceMap[item.id]?.includes(dateEntry.value);
          return (
            <TouchableOpacity onPress={() => setShowEditPresenceModal({ memberId: item.id })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ flex: 1 }}>{item.name}</Text>
                <Text>{present ? '✔️' : '❌'}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={!!showEditPresenceModal} transparent>
        {/* Ajoute ici ton UI pour éditer la présence */}
        <View style={{ backgroundColor: 'white', margin: 32, padding: 24, borderRadius: 12 }}>
          <Text>Édition de la présence (à implémenter)</Text>
          <Button title="Fermer" onPress={() => setShowEditPresenceModal(null)} />
        </View>
      </Modal>
    </View>
  );
};

export default InformationsDate;
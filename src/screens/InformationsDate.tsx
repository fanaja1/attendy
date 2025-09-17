import React, { useState } from 'react';
import { View, Text, Button, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { DateEntry, Member } from '../types/models';
import { getMembersByGroup, getPresenceMap, updateDate, setPresence } from '../database/db';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLayout from '../components/AppLayout';

type InformationsDateRouteProp = RouteProp<RootStackParamList, 'InformationsDate'>;

const InformationsDate = () => {
  const navigation = useNavigation();
  const route = useRoute<InformationsDateRouteProp>();
  const { groupId, dateEntry } = route.params as { groupId: string, dateEntry: DateEntry };

  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [showEditPresenceModal, setShowEditPresenceModal] = useState<{ memberId: string } | null>(null);
  const [retardMinutes, setRetardMinutes] = useState('0');

  // Pour l'édition de la date
  const [editDate, setEditDate] = useState<Date>(new Date(dateEntry.value));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Pour l'édition de l'heure et tolérance si besoin
  const [editStartTime, setEditStartTime] = useState<Date | null>(
    dateEntry.startTime ? new Date(`1970-01-01T${dateEntry.startTime}:00`) : null
  );
  const [editTolerance, setEditTolerance] = useState<string>(
    dateEntry.tolerance ? dateEntry.tolerance.toString() : '0'
  );
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const members = getMembersByGroup(groupId);
  const presenceMap = getPresenceMap(groupId);

  // Fonction pour sauvegarder la date éditée (à adapter selon ta logique de DB)
  const handleSaveEditDate = () => {
    // Ici tu dois mettre à jour la date dans la base (ex: updateDate)
    updateDate(dateEntry.id, editDate, editStartTime, editTolerance)
    // Puis éventuellement rafraîchir la page ou naviguer
    setShowEditDateModal(false);
    // Tu peux ajouter une alerte ou un toast ici
  };


  return (
    <AppLayout style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={() => setShowEditDateModal(true)}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
          {dateEntry.value}
        </Text>
      </TouchableOpacity>
      <Modal visible={showEditDateModal} transparent>
        <View style={{ backgroundColor: 'white', margin: 32, padding: 24, borderRadius: 12 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Éditer la date</Text>
          <Button title={editDate.toISOString().slice(0, 10)} onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={editDate}
              mode="date"
              display="default"
              onChange={(e, date) => {
                if (date) setEditDate(date);
                setShowDatePicker(false);
              }}
            />
          )}

          <Text style={{ marginTop: 16 }}>Heure de début :</Text>
          <Button
            title={editStartTime ? editStartTime.toTimeString().slice(0, 5) : 'Non défini'}
            onPress={() => setShowStartTimePicker(true)}
          />
          {showStartTimePicker && (
            <DateTimePicker
              value={editStartTime || new Date()}
              mode="time"
              display="default"
              onChange={(e, time) => {
                if (time) setEditStartTime(time);
                setShowStartTimePicker(false);
              }}
            />
          )}

          <Text style={{ marginTop: 16 }}>Tolérance (minutes) :</Text>
          <TextInput
            keyboardType="numeric"
            value={editTolerance}
            onChangeText={setEditTolerance}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 6,
              padding: 8,
              marginVertical: 8,
              width: 80,
              alignSelf: 'flex-start',
              backgroundColor: '#fff',
            }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button title="Annuler" onPress={() => setShowEditDateModal(false)} />
            <Button
              title="Enregistrer"
              onPress={() => {
                handleSaveEditDate();
                // Rafraîchir la date affichée après sauvegarde
                dateEntry.value = editDate.toISOString().slice(0, 10);
                if (editStartTime) dateEntry.startTime = editStartTime.toTimeString().slice(0, 5);
                dateEntry.tolerance = parseInt(editTolerance, 10) || 0;
              }}
            />
          </View>
        </View>
      </Modal>

      <FlatList
        data={members}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const presence = presenceMap[item.id]?.find(p => p.date === dateEntry.value);
          let symbol = '❌';
          if (presence) {
            if (presence.status === 'present') symbol = '✔️';
            else if (presence.status === 'retard') symbol = `⏰${presence.retardMinutes}`;
            else if (presence.status === 'permission') symbol = '📝';
            else if (presence.status === 'absent') symbol = '❌';
          }
          return (
            <TouchableOpacity onPress={() => setShowEditPresenceModal({ memberId: item.id })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ flex: 1 }}>{item.firstName}</Text>
                <Text>{symbol}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Modal visible={!!showEditPresenceModal} transparent>
        <View style={{ backgroundColor: 'white', margin: 32, padding: 24, borderRadius: 12 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Édition de la présence</Text>
          {showEditPresenceModal && (
            <View>
              <Button
                title="Présent"
                onPress={() => {
                  setPresence(showEditPresenceModal.memberId, dateEntry.value, 'present');
                  setShowEditPresenceModal(null);
                  setRetardMinutes('0');
                }}
              />
              <View style={{ height: 8 }} />
              <Button
                title="Absent"
                onPress={() => {
                  setPresence(showEditPresenceModal.memberId, dateEntry.value, 'absent');
                  setShowEditPresenceModal(null);
                  setRetardMinutes('0');
                }}
              />
              <View style={{ height: 8 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  title="Retard"
                  onPress={() => {
                    setPresence(
                      showEditPresenceModal.memberId,
                      dateEntry.value,
                      'retard',
                      parseInt(retardMinutes, 10) || 0
                    );
                    setShowEditPresenceModal(null);
                    setRetardMinutes('0');
                  }}
                />
                <TextInput
                  placeholder="minutes"
                  keyboardType="numeric"
                  value={retardMinutes}
                  onChangeText={setRetardMinutes}
                  style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6, width: 60, marginLeft: 8 }}
                />
              </View>
              <View style={{ height: 8 }} />
              <Button
                title="Permission"
                onPress={() => {
                  setPresence(showEditPresenceModal.memberId, dateEntry.value, 'permission');
                  setShowEditPresenceModal(null);
                  setRetardMinutes('0');
                }}
              />
              <View style={{ height: 16 }} />
              <Button
                title="Fermer"
                onPress={() => {
                  setShowEditPresenceModal(null);
                  setRetardMinutes('0');
                }}
              />
            </View>
          )}
        </View>
      </Modal>
    </AppLayout>
  );
};

export default InformationsDate;
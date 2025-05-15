import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Member } from '../types/models';
import { getMemberById } from '../database/db';
import QRCodeCustom from '../components/QRCodeCustom';

type MemberInfoRouteProp = RouteProp<RootStackParamList, 'MemberInfo'>;

export const MemberInfo = () => {
  const route = useRoute<MemberInfoRouteProp>();
  const { memberId } = route.params;

  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const found = getMemberById(memberId);
    if (found) {
      setMember(found);
    }
  }, [memberId]);

  if (!member) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{member.name}</Text>
      <Text style={styles.subtitle}>ID: {member.id}</Text>
      <View style={styles.qrCode}>
        <QRCodeCustom value={member.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  qrCode: {
    marginTop: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default MemberInfo;
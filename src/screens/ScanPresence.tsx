import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { addPresence, isAlreadyPresent, memberExists, getDates } from '../database/db';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScanPresence'>;
type RouteProps = RouteProp<RootStackParamList, 'ScanPresence'>;

const ScanPresence = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { groupId } = route.params;

  const [facing, setFacing] = useState<CameraType>('back');


  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const [isDateModalVisible, setDateModalVisible] = useState(true);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isScanConfirmVisible, setScanConfirmVisible] = useState(false);

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedList, setScannedList] = useState<string[]>([]);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useFocusEffect(
  useCallback(() => {
    const dates = getDates(groupId);
    setAvailableDates(dates);
    if (dates.length > 0) {
      setAlertVisible(false);
      setSelectedDate(dates[0]);
    } else {
      setAlertVisible(true);
      setDateModalVisible(false);
      Alert.alert(
        'Aucune date disponible',
        'Veuillez ajouter une date avant de scanner.',
        [
          {
            text: 'Fermer',
            style: 'destructive',
            onPress: () => {
              setAlertVisible(false);
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [groupId])
);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
  if (!selectedDate) return;

  try {
    if (!memberExists(data)) {
      setAlertVisible(true);
      Alert.alert('Erreur', 'QR code invalide : membre non trouvé.', [
        {
          text: 'Fermer',
          style: 'destructive',
          onPress: () => setAlertVisible(false),
        },
      ]);
      return;
    }

    if (isAlreadyPresent(data, selectedDate)) {
      setAlertVisible(true);
      Alert.alert('Info', 'Ce membre a déjà été scanné pour cette date.', [
        {
          text: 'Fermer',
          style: 'default',
          onPress: () => setAlertVisible(false),
        },
      ]);
      return;
    }

    addPresence(data, selectedDate);
    setScannedList(prev => [...prev, data]);
    setScannedData(data);
    setScanConfirmVisible(true);
  } catch (error) {
    setAlertVisible(true);
    Alert.alert('Erreur', 'Une erreur est survenue pendant le scan.', [
      {
        text: 'Fermer',
        style: 'destructive',
        onPress: () => setAlertVisible(false),
      },
    ]);
  }
};  

  const confirmScan = () => {
    setScannedData(null);
    setScanConfirmVisible(false);
  };

  const handleDone = () => {
    navigation.goBack();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setDateModalVisible(false);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de la permission pour accéder à la caméra</Text>
        <Button title="Accorder la permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal isVisible={isDateModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Choisir une date :</Text>
          <FlatList
            data={availableDates}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleDateSelect(item)}>
                <Text style={styles.dateItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Retour" onPress={() => navigation.goBack()} />
        </View>
      </Modal>

      {!isAlertVisible && !isDateModalVisible && !isScanConfirmVisible &&
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Changer caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDone}>
              <Text style={styles.text}>Terminé</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      }
      <Modal isVisible={isScanConfirmVisible}>
        <View style={styles.modal}>
          <Text>Scanné : {scannedData}</Text>
          <Button title="Confirmer" onPress={confirmScan} />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row', 
    gap: 12, 
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#00000080',
    borderRadius: 6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateItem: {
    padding: 12,
    fontSize: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: 200,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default ScanPresence;

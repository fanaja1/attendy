import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const ScanPresence = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isDateModalVisible, setDateModalVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isScanConfirmVisible, setScanConfirmVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedList, setScannedList] = useState<string[]>([]);

  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de la permission pour accéder à la caméra</Text>
        <Button title="Accorder la permission" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scannedList.includes(data)) {
      setScannedData(data);
      setScanConfirmVisible(true);
    }
  };

  const confirmScan = () => {
    if (scannedData) {
      setScannedList(prev => [...prev, scannedData]);
      setScannedData(null);
      setScanConfirmVisible(false);
    }
  };

  const handleDone = () => {
    // TODO: enregistrer scannedList + selectedDate en base si besoin
    navigation.goBack();
  };

  const onDateChange = (event: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setDateModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isDateModalVisible} backdropOpacity={0.6}>
        <View style={styles.modal}>
          <Text>Choisir une date :</Text>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        </View>
      </Modal>

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
        </View>
      </CameraView>

      <Modal isVisible={isScanConfirmVisible} backdropOpacity={0.6}>
        <View style={styles.modal}>
          <Text>Donnée scannée : {scannedData}</Text>
          <Button title="Confirmer" onPress={confirmScan} />
        </View>
      </Modal>

      <View style={styles.footer}>
        <Button title="Terminé" onPress={handleDone} />
      </View>
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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

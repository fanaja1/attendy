import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';

interface QRCodeCustomProps {
  value: string;
  size: number;
}

const QRCodeCustom: React.FC<QRCodeCustomProps> = ({ value, size }) => {
  return (
    <View style={styles.container}>
      <QRCodeStyled
        data={value}
        style={{ backgroundColor: 'white' }}
        padding={10}
        pieceSize={5}
        errorCorrectionLevel="H"
        color="black"
        logo={{
          uri: 'https://example.com/my-logo.png', // Remplacez par votre URL de logo
          width: 40,
          height: 40,
        }}
        // size={size} // Utilisez la taille définie en props
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRCodeCustom;

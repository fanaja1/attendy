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
        pieceSize={10}
        pieceBorderRadius={2}
        pieceStroke=''
        errorCorrectionLevel="H"
        color="black"
        // size={size} // Utilisez la taille définie en props
      />
    </View>
  );
};

export function CirclePieces() {
  return (
    <QRCodeStyled
      data={'Styling Pieces'}
      style={styles.svg1}
      padding={25}
      pieceSize={8}
      pieceBorderRadius={4}
      color={'#F57F17'}
    />
  );
}

export function CustomEyes() {
  return (
    <QRCodeStyled
      data={'Custom Corners'}
      style={styles.svg2}
      padding={20}
      pieceSize={8}
      pieceBorderRadius={4}
      gradient={{
        type: 'radial',
        options: {
          center: [0.5, 0.5],
          radius: [1, 1],
          colors: ['#ff7bc6', '#0f0080'],
          locations: [0, 1],
        },
      }}
      outerEyesOptions={{
        topLeft: {
          borderRadius: [20, 20, 0, 20],
        },
        topRight: {
          borderRadius: [20, 20, 20],
        },
        bottomLeft: {
          borderRadius: [20, 0, 20, 20],
        },
      }}
      innerEyesOptions={{
        borderRadius: 12,
        scale: 0.85,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  svg1: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },

  svg2: {
    backgroundColor: 'white',
    borderRadius: 36,
    overflow: 'hidden',
  },
});

export default CustomEyes;

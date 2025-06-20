import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import TopWaveReversed from '../../assets/TopWaveReversed.svg';
import BottomWaveReversed from '../../assets/BottomWaveReversed.svg';

type ReversedLightBackgroundProps = React.PropsWithChildren<{}>;

const ReversedLightBackground: React.FC<ReversedLightBackgroundProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: '#00c6ff' }}>
      <TopWaveReversed
        width={width}
        // height={height * 0.3}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <BottomWaveReversed
        width={width}
        // height={height * 0.3}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', bottom: -90, left: 0 }}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

export default ReversedLightBackground;
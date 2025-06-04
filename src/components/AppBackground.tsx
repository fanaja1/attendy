import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Background from '../../assets/bg.svg';
import TopWave from '../../assets/TopWave.svg';
import WavesTop from '../../assets/waves_top.svg';
import BottomWave from '../../assets/BottomWave.svg';

type AppBackgroundProps = React.PropsWithChildren<{}>;

const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      <TopWave
        width={width}
        // height={height * 0.3}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <BottomWave
        width={width}
        // height={height * 0.3}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', bottom: -90, left: 0 }}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

export default AppBackground;
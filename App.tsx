import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';

// Garde l'écran de démarrage visible jusqu'à ce que la police soit chargée
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Charger la police
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat-Regular': require('./assets/fonts/Montserrat/Montserrat-Regular.otf'),
        'Montserrat-Bold': require('./assets/fonts/Montserrat/Montserrat-Bold.otf'),
        'Exo-Regular': require('./assets/fonts/Exo/Exo-Regular.otf'),
        'Exo-Bold': require('./assets/fonts/Exo/Exo-Bold.otf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  // Cacher le splash screen quand tout est prêt
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <MenuProvider>
        <AppNavigator />
      </MenuProvider>
    </View>
  );
};

export default App;

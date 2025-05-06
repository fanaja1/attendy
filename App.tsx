import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { setupDatabase } from './src/database/db';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return <AppNavigator />;
}

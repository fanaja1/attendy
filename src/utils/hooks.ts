import { useNavigationState } from '@react-navigation/native';
import { useEffect } from 'react';

export const useLogNavigationStack = () => {
  const navigationState = useNavigationState((state) => state);

  useEffect(() => {
    if (navigationState) {
      const routeNames = navigationState.routes.map((r) => r.name);
      console.log('🧭 Current navigation stack:', routeNames);
    }
  }, [navigationState]);
};
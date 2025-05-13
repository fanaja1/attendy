import { NavigationContainer } from '@react-navigation/native';
import GroupList from '../screens/GroupList';
import CreateGroup from '../screens/CreateGroup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GroupList" component={GroupList} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import GroupList from '../screens/GroupList';
import AddGroup from '../screens/AddGroup';
import Dashboard from '../screens/Dashboard';
import AddMember from '../screens/AddMember';
import MemberInfo from '../screens/MemberInfo';
import ScanPresence from '../screens/ScanPresence';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GroupList" component={GroupList} />
        <Stack.Screen name="AddGroup" component={AddGroup} />
        <Stack.Screen name="Dashboard" component={Dashboard} /> 
        <Stack.Screen name="AddMember" component={AddMember} /> 
        <Stack.Screen name="MemberInfo" component={MemberInfo} />
        <Stack.Screen name="ScanPresence" component={ScanPresence} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

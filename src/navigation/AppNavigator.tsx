import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppBackground from '../components/AppBackground'

import Home from '../screens/Home'
import GroupList from '../screens/GroupList'
import AddGroup from '../screens/AddGroup'
import Dashboard from '../screens/Dashboard'
import AddMember from '../screens/AddMember'
import MemberInfo from '../screens/MemberInfo'
import ScanPresence from '../screens/ScanPresence'
import InformationsDate from '../screens/InformationsDate'

const withBackground = <P extends object>(ScreenComponent: React.ComponentType<P>) =>
  (props: P) => (
    <AppBackground>
      <ScreenComponent {...props} />
    </AppBackground>
  )

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={withBackground(Home)} />
        <Stack.Screen name="GroupList" component={withBackground(GroupList)} />
        <Stack.Screen name="AddGroup" component={withBackground(AddGroup)} />
        <Stack.Screen name="Dashboard" component={withBackground(Dashboard)} />
        <Stack.Screen name="AddMember" component={withBackground(AddMember)} />
        <Stack.Screen name="MemberInfo" component={withBackground(MemberInfo)} />
        <Stack.Screen name="ScanPresence" component={withBackground(ScanPresence)} />
        <Stack.Screen name="InformationsDate" component={withBackground(InformationsDate)} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

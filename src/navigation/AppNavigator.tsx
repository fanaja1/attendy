import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import GroupList from '../screens/GroupList'
import AddGroup from '../screens/AddGroup'
import Dashboard from '../screens/Dashboard'
import AddMember from '../screens/AddMember'
import MemberInfo from '../screens/MemberInfo'
import ScanPresence from '../screens/ScanPresence'
import InformationsDate from '../screens/InformationsDate'
import LightBackground from '../components/LightBackground'
import ReversedLightBackground from '../components/ReversedLightBackground'

const backgrounder = <P extends object>(ScreenComponent: React.ComponentType<P>, index: number) =>
  (props: P) => {
    switch (index) {
      case 1:
        return (
          <LightBackground>
            <ScreenComponent {...props} />
          </LightBackground>
        )
      case 2:
        return (
          <ReversedLightBackground>
            <ScreenComponent {...props} />
          </ReversedLightBackground>
        )
      default:
        return <ScreenComponent {...props} />
    }
  }

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={backgrounder(Home, 1)} />
        <Stack.Screen name="GroupList" component={backgrounder(GroupList, 2)} />
        <Stack.Screen name="AddGroup" component={backgrounder(AddGroup, 1)} />
        <Stack.Screen name="Dashboard" component={backgrounder(Dashboard, 1)} />
        <Stack.Screen name="AddMember" component={backgrounder(AddMember, 1)} />
        <Stack.Screen name="MemberInfo" component={backgrounder(MemberInfo, 1)} />
        <Stack.Screen name="ScanPresence" component={backgrounder(ScanPresence, 1)} />
        <Stack.Screen name="InformationsDate" component={backgrounder(InformationsDate, 1)} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

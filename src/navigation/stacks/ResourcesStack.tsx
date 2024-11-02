import Feeds from '@/views/resources/Feeds'
import Medications from '@/views/resources/Medications'
import Resources from '@/views/resources/Resources'
import { createStackNavigator } from '@react-navigation/stack'
import { ResourcesStackParamList } from '../types'

const Stack = createStackNavigator<ResourcesStackParamList>()

const ResourcesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='ResourcesView'
        component={Resources}
      />
      <Stack.Screen
        name='FeedsView'
        component={Feeds}
      />
      <Stack.Screen
        name='MedicationsView'
        component={Medications}
      />
    </Stack.Navigator>
  )
}

export default ResourcesStack

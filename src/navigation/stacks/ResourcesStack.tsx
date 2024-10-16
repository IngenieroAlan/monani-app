import Feeds from '@/views/resources/Feeds'
import Medications from '@/views/resources/Medications'
import Resources from '@/views/resources/Resources'
import { createStackNavigator } from '@react-navigation/stack'

export type ResourcesStackParams = {
  ResourcesView: undefined
  FeedsView: undefined
  MedicationsView: undefined
}

const Stack = createStackNavigator<ResourcesStackParams>()

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

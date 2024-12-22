import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import FeedsView from '@/views/feeds/FeedsView'
import MedicationsView from '@/views/medications/MedicationsView'
import ResourcesView from '@/views/resources/ResourcesView'
import { createStackNavigator } from '@react-navigation/stack'
import { ResourcesStackParamList } from './types'

const Stack = createStackNavigator<ResourcesStackParamList>()

const ResourcesStack = () => {
  const dispatch = useAppDispatch()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        blur: () => dispatch(reset())
      }}
    >
      <Stack.Screen
        name='ResourcesView'
        component={ResourcesView}
      />
      <Stack.Screen
        name='FeedsView'
        component={FeedsView}
      />
      <Stack.Screen
        name='MedicationsView'
        component={MedicationsView}
      />
    </Stack.Navigator>
  )
}

export default ResourcesStack

import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import FeedsView from '@/screens/feeds/FeedsView'
import MedicationsView from '@/screens/medications/MedicationsView'
import ResourcesView from '@/screens/resources/ResourcesView'
import { createStackNavigator } from '@react-navigation/stack'
import { ResourcesStackParamList } from './types'

const Stack = createStackNavigator<ResourcesStackParamList>()

export const ResourcesStack = () => {
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

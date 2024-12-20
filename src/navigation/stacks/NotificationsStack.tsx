import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import NotificationsView from '@/views/notifications/NotificationsView'
import { createStackNavigator } from '@react-navigation/stack'

export type NotificationsStackParams = {
  NotificationsView: undefined
  NotificationsDetailsView: undefined
}
const Stack = createStackNavigator<NotificationsStackParams>()

export const NotificationsStack = () => {
  const dispatch = useAppDispatch()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        blur: () => dispatch(reset())
      }}
    >
      <Stack.Screen
        name='NotificationsView'
        component={NotificationsView}
      />
    </Stack.Navigator>
  )
}

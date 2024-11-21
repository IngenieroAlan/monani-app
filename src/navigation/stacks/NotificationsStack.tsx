import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { NotificationsView } from '../../views/notifications/Notifications'

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

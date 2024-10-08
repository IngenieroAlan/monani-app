
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationsView } from '../../views/notifications/Notifications';

export type NotificationsStackParams = {
  NotificationsView: undefined;
}
const Stack = createStackNavigator<NotificationsStackParams>();

export const NotificationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='NotificationsView' component={NotificationsView} />
    </Stack.Navigator>
  )
}
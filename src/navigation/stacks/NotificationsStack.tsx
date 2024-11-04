
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationsView } from '../../views/notifications/Notifications';
import { NotificationsDetailsView } from '@/views/notifications/NotificationsDetails';

export type NotificationsStackParams = {
  NotificationsView: undefined;
  NotificationsDetailsView:undefined;
}
const Stack = createStackNavigator<NotificationsStackParams>();

export const NotificationsStack = () => {
  const cattleNumber="No. 6603";
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='NotificationsView' component={NotificationsView} />
      <Stack.Screen name='NotificationsDetailsView' options={{headerShown:true, headerTitle:`${cattleNumber}`}} component={NotificationsDetailsView} />
    </Stack.Navigator>
  )
}
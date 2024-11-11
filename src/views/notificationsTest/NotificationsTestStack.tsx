import useNotifications from '@/hooks/collections/useNotifications'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import { NotificationsView } from '../notifications/Notifications'
import PlaygroundView from './views/PlaygroundView'
import ScheduledView from './views/ScheduledView'

export type NotificationsTestParamList = {
  playground: undefined
  notifications: undefined
  scheduled: undefined
}

const Tab = createMaterialBottomTabNavigator<NotificationsTestParamList>()

const NotificationsTestStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='playground'
        component={PlaygroundView}
        options={{
          tabBarLabel: 'Playground',
          tabBarIcon: 'toy-brick-outline'
        }}
      />
      <Tab.Screen
        name='notifications'
        component={NotificationsView}
        options={() => {
          const { notifications } = useNotifications({ isMarkedAsRead: false })

          return {
            tabBarLabel: 'Entregadas',
            tabBarBadge: notifications.length || undefined,
            tabBarIcon: 'bell-outline'
          }
        }}
      />
      <Tab.Screen
        name='scheduled'
        component={ScheduledView}
        options={{
          tabBarLabel: 'En cola',
          tabBarIcon: 'tray-full'
        }}
      />
    </Tab.Navigator>
  )
}

export default NotificationsTestStack

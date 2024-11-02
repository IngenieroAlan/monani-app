import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { getNotifications } from '@/redux/slices/notificationsSlice'
import { HomeView } from '@/views/home/Home'
import { useDatabase } from '@nozbe/watermelondb/react'
import React, { useEffect } from 'react'
import { Icon, Portal } from 'react-native-paper'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import { EarningsStack } from './stacks/EarningsStack'
import { MilkProductionStack } from './stacks/MilkProductionStack'
import { NotificationsStack } from './stacks/NotificationsStack'
import { BottomTabsParamList } from './types'

const Tab = createMaterialBottomTabNavigator<BottomTabsParamList>()

const BottomTabsStack = () => {
  const database = useDatabase()
  const dispatch = useAppDispatch()
  const { notificationsCount } = useAppSelector((state) => state.notifications)
  useEffect(() => {
    dispatch(getNotifications(database))
  }, [dispatch])

  return (
    <Portal.Host>
      <Tab.Navigator>
        <Tab.Screen
          name='Ganado'
          component={HomeView}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                source='cow'
                color={color}
                size={24}
              />
            )
          }}
        />
        <Tab.Screen
          name='Prod. lechera'
          component={MilkProductionStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                source='beer-outline'
                color={color}
                size={24}
              />
            )
          }}
        />
        <Tab.Screen
          name='Ganancias'
          component={EarningsStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                source='cash-multiple'
                color={color}
                size={24}
              />
            )
          }}
        />
        <Tab.Screen
          name='Notificaciones'
          component={NotificationsStack}
          options={{
            tabBarBadge: notificationsCount > 0 ? notificationsCount : undefined,
            tabBarIcon: ({ color }) => (
              <Icon
                source='bell-outline'
                color={color}
                size={24}
              />
            )
          }}
        />
      </Tab.Navigator>
    </Portal.Host>
  )
}

export default BottomTabsStack

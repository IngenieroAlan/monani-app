import React, { useEffect, useState } from 'react';
import { Icon, Portal } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { EarningsStack } from './stacks/EarningsStack';
import LivestockStack from './stacks/LivestockStack';
import { MilkProductionStack } from './stacks/MilkProductionStack';
import { NotificationsStack } from './stacks/NotificationsStack';
import { useDatabase } from '@nozbe/watermelondb/react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getNotifications } from '@/redux/slices/notificationsSlice';
const Tab = createMaterialBottomTabNavigator();

const BottomTabsStack = () => {
  const database = useDatabase();
  const dispatch = useAppDispatch();
  const {notifications} = useAppSelector(state=>state.notifications)
  const [notisCount, setNotisCount] = useState(0);
  useEffect(() => {
    setNotisCount(notifications.filter(noti=>noti.isMarkedAsRead===false).length)
  }, [notifications])
  useEffect(() => {
    dispatch(getNotifications(database))
  }, [dispatch])
  


  return (
    <Portal.Host>
      <Tab.Navigator>
        <Tab.Screen
          name="Ganado"
          component={LivestockStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="cow" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Prod.lechera"
          component={MilkProductionStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="beer-outline" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Ganancias"
          component={EarningsStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="cash-multiple" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Notificaciones"
          component={NotificationsStack}
          options={{
            tabBarBadge: notisCount,
            tabBarIcon: ({ color }) => (
              <Icon source="bell-outline" color={color} size={24} ></Icon>
            ),
          }}
        />
      </Tab.Navigator>
    </Portal.Host>
  );
}

export default BottomTabsStack;
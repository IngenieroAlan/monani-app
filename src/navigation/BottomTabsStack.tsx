import React from 'react';
import { Icon, Portal } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { EarningsStack } from './stacks/EarningsStack';
import LivestockStack from './stacks/LivestockStack';
import { MilkProductionStack } from './stacks/MilkProductionStack';
import { NotificationsStack } from './stacks/NotificationsStack';

const Tab = createMaterialBottomTabNavigator();

const BottomTabsStack = () => {
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
            tabBarBadge: 3,
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
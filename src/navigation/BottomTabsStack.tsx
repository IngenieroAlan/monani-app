import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon } from 'react-native-paper';
import { HomeView } from '../views/home/Home';
import { MilkProductionView } from '../views/milkProduction/MilkProduction';
import LivestockStack from './stacks/LivestockStack';
import { MilkProductionStack } from './stacks/MilkProductionStack';
import { EarningsStack } from './stacks/EarningsStack';
import { NotificationsStack } from './stacks/NotificationsStack';

const Tab = createMaterialBottomTabNavigator();

const BottomTabsStack = () => {
  return (
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
          tabBarIcon: ({ color }) => (
            <Icon source="bell-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsStack;
import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon } from 'react-native-paper';
import { HomeView } from '../views/home/Home';
import { MilkProductionView } from '../views/milkProduction/MilkProduction';

const Tab = createMaterialBottomTabNavigator();

const BottomTabsStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Ganado"
        component={HomeView}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="account-group-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Prod.lechera"
        component={MilkProductionView}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="train-car" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Ganancias"
        component={HomeView}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="bookmark-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={HomeView}
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

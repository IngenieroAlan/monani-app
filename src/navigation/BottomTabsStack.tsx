import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { HomeView } from '../views/Home';
import { Icon } from 'react-native-paper';

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
        component={HomeView}
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

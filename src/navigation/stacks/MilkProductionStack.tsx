import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon } from 'react-native-paper';
import { MilkProductionView } from "../../views/milkProduction/MilkProduction";
import { MilkProductionResumeView } from '../../views/milkProduction/MilkProductionResume';

export type MilkProductionStackParams = {
  MilkProductionView: undefined;
  MilkProductionResumeView: undefined;
};

const Stack = createMaterialTopTabNavigator<MilkProductionStackParams>();

export const MilkProductionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ tabBarStyle: { backgroundColor: "#FEF7FF" }, tabBarActiveTintColor: "#65558F", tabBarInactiveTintColor: "#49454F" }}>
      <Stack.Screen
        name="MilkProductionView"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="cup-water" color={color} size={24} />
          ),
          tabBarLabel: "Producción diaria"
        }}
        component={MilkProductionView} />
      <Stack.Screen
        name="MilkProductionResumeView"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="script-text-outline" color={color} size={24} />
          ),
          tabBarLabel: "Resumen"
        }}
        component={MilkProductionResumeView} />
    </Stack.Navigator>
  );
};

import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EarningsView } from '../../views/earnings/Earnings';
import { EarningsResumeView } from '../../views/earnings/EarningsResume';
import { Icon } from 'react-native-paper';

export type EarningsStackParams = {
  EarningsView: undefined;
  EarningsResumeView: undefined;
}
const Stack = createMaterialTopTabNavigator<EarningsStackParams>();

export const EarningsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ tabBarStyle: { backgroundColor: "#FEF7FF" }, tabBarActiveTintColor: "#65558F", tabBarInactiveTintColor: "#49454F" }}>
      <Stack.Screen name='EarningsView' options={{
        tabBarIcon: ({ color }) => (
          <Icon source="currency-usd" color={color} size={24} />
        ),
        tabBarLabel: "Transacciones"
      }} component={EarningsView} />
      <Stack.Screen name='EarningsResumeView' options={{
        tabBarIcon: ({ color }) => (
          <Icon source="script-text-outline" color={color} size={24} />
        ),
        tabBarLabel: "Resumen"
      }} component={EarningsResumeView} />
    </Stack.Navigator>
  )
}

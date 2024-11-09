import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon, useTheme } from 'react-native-paper';
import { MilkProductionView } from "../../views/milkProduction/MilkProduction";
import { MilkProductionResumeView } from '../../views/milkProduction/MilkProductionResume';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MilkProductionStackParams = {
  MilkProductionView: undefined;
  MilkProductionResumeView: undefined;
};

const Stack = createMaterialTopTabNavigator<MilkProductionStackParams>();

export const MilkProductionStack = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets()
  return (
    <Stack.Navigator
    style={{ paddingTop: insets.top }}
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.onSurface,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceVariant
      },
      tabBarLabelStyle:{
        textTransform:"none"
      },
      tabBarIndicatorStyle: {
        backgroundColor: theme.colors.primary,
        height: 3,
        borderRadius: 5
      },
      tabBarAndroidRipple: { borderless: false }
    }}
      >
      <Stack.Screen
        name="MilkProductionView"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon source="beer-outline" color={color} size={24} />
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
          tabBarLabel: "Resumen",
        }}
        component={MilkProductionResumeView} />
    </Stack.Navigator>
  );
};

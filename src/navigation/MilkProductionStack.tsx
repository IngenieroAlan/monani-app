import { useAppDispatch } from "@/hooks/useRedux";
import { setShowBottomStack } from "@/redux/slices/ui";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MilkProductionView } from "../views/milkProduction/MilkProduction";
import { MilkProductionResumeView } from '../views/milkProduction/MilkProductionResume';

export type MilkProductionStackParams = {
  MilkProductionView: undefined;
  MilkProductionResumeView: undefined;
};

const Stack = createMaterialTopTabNavigator<MilkProductionStackParams>();

export const MilkProductionStack = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets()
  return (
    <Stack.Navigator
      style={{ paddingTop: insets.top }}
      screenListeners={{ blur: () => { dispatch(setShowBottomStack(true)) } }}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.surfaceVariant
        },
        tabBarLabelStyle: {
          textTransform: "none"
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

import { NavigationProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import BottomTabsStack from "./BottomTabsStack";
//import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParams = {
  HomeView: undefined;
  BottomTabsStack: undefined;
};

export type StackNavigation = NavigationProp<RootStackParams>;

const Stack = createStackNavigator<RootStackParams>();

export const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTabsStack" component={BottomTabsStack} />
    </Stack.Navigator>
  );
};

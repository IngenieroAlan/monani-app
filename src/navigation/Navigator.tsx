import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabsStack from "./BottomTabsStack";
//import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParams = {
  HomeView: undefined;
  BottomTabsStack: undefined;
};

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

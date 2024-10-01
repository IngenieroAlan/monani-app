import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabsStack from "./BottomTabsStack";
import { NavigationProp } from "@react-navigation/native";
import { AddCattleView } from "../views/addCattle/addCattle";
//import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParams = {
  HomeView: undefined;
  BottomTabsStack: undefined;
  AddCattle: undefined;
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
      <Stack.Screen
        name="AddCattle"
        component={AddCattleView}
        options={{
          headerShown: true,
          headerTitle: "Información general",
          presentation: "modal",
        }} />
    </Stack.Navigator>
  );
};

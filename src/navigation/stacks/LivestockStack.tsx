import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeView } from '../../views/home/Home';
import { CattleForm } from '../../views/addCattle/CattleForm';
import AddCattleStack from "./AddCattleStack";

export type LivestockStackParams = {
  HomeView: undefined;
  AddCattleStack: undefined;
}

const Stack = createStackNavigator<LivestockStackParams>();

const LivestockStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeView" component={HomeView} />
      <Stack.Screen name="AddCattleStack" component={AddCattleStack} />
    </Stack.Navigator>
  );
};

export default LivestockStack;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeView } from '../../views/home/Home';
import { AddCattleView } from '../../views/addCattle/addCattle';

export type LivestockStackParams = {
  HomeView: undefined;
  AddCattleView: undefined;
}

const Stack = createStackNavigator<LivestockStackParams>();

const LivestockStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeView" options={{ headerShown: false }} component={HomeView} />
      <Stack.Screen name="AddCattleView" component={AddCattleView} />
    </Stack.Navigator>
  );
};

export default LivestockStack;

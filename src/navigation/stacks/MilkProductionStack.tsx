import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { MilkProductionView } from "../../views/milkProduction/MilkProduction";

export type MilkProductionStackParams = {
  MilkProductionView: undefined;
};

const Stack = createStackNavigator<MilkProductionStackParams>();

export const MilkProductionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MilkProductionView" component={MilkProductionView} />
    </Stack.Navigator>
  );
};

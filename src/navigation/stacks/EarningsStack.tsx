import React from 'react'
import { EarningsView } from '../../views/earnings/Earnings';
import { createStackNavigator } from '@react-navigation/stack';

export type EarningsStackParams = {
    EarningsView: undefined;
  }
  const Stack = createStackNavigator<EarningsStackParams>();

export const EarningsStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name='EarningsView' component={EarningsView} />
    </Stack.Navigator>
  )
}

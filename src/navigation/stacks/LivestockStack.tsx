import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { HomeView } from '../../views/home/Home'

export type LivestockStackParams = {
  HomeView: undefined
  SearchCattleView: undefined
  ResourcesStack: undefined
}

const Stack = createStackNavigator<LivestockStackParams>()

const LivestockStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='HomeView'
        component={HomeView}
      />
    </Stack.Navigator>
  )
}

export default LivestockStack

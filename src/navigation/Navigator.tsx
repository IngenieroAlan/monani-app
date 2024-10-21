import SearchCattle from '@/views/home/SearchCattle'
import { NavigationProp } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import BottomTabsStack from './BottomTabsStack'
import AddCattleStack from './stacks/AddCattleStack'
import ResourcesStack from './stacks/ResourcesStack'

export type RootStackParams = {
  HomeView: undefined
  BottomTabsStack: undefined
  AddCattleStack: undefined
  ResourcesStack: undefined
  SearchCattleView: undefined
}

export type StackNavigation = NavigationProp<RootStackParams>

const Stack = createStackNavigator<RootStackParams>()

export const Navigator = () => {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='BottomTabsStack'
          component={BottomTabsStack}
        />
        <Stack.Screen
          name='SearchCattleView'
          component={SearchCattle}
        />
        <Stack.Screen
          name='AddCattleStack'
          component={AddCattleStack}
        />
        <Stack.Screen
          name='ResourcesStack'
          component={ResourcesStack}
        />
      </Stack.Navigator>
    </View>
  )
}

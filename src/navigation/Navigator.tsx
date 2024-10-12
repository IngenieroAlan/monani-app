import SearchCattle from '@/views/home/SearchCattle'
import { NavigationProp } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import BottomTabsStack from './BottomTabsStack'

export type RootStackParams = {
  HomeView: undefined
  BottomTabsStack: undefined
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
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
          }}
        />
      </Stack.Navigator>
    </View>
  )
}

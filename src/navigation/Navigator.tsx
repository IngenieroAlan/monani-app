import { Cattle } from '@/components/layout/cattleDetails/Cattle'
import AnnualEarningsView from '@/views/earnings/AnnualEarnings'
import SearchCattle from '@/views/home/SearchCattle'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import BottomTabsStack from './BottomTabsStack'
import AddCattleStack from './stacks/AddCattleStack'
import ResourcesStack from './stacks/ResourcesStack'
import { RootStackParamList } from './types'

const Stack = createStackNavigator<RootStackParamList>()

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
        <Stack.Screen
          name='AnnualEarningsView'
          component={AnnualEarningsView}
        />
        <Stack.Screen
          name='CattleDetailsLayout'
          component={Cattle}
        />
      </Stack.Navigator>
    </View>
  )
}

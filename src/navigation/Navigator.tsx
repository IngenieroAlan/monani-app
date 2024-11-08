import SearchMother from '@/components/genealogyRoute/SearchMother'
import SearchOffspring from '@/components/genealogyRoute/SearchOffspring'
import database from '@/database'
import { useAppDispatch } from '@/hooks/useRedux'
import { CattleTopStack } from '@/navigation/stacks/CattleTopStack'
import { getCattles } from '@/redux/slices/cattles'
import AnnualEarningsView from '@/views/earnings/AnnualEarnings'
import SearchCattle from '@/views/home/SearchCattle'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import BottomTabsStack from './BottomTabsStack'
import AddCattleStack from './stacks/AddCattleStack'
import ResourcesStack from './stacks/ResourcesStack'
import { RootStackParamList } from './types'

const Stack = createStackNavigator<RootStackParamList>()

export const Navigator = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCattles(database))
  }, [dispatch])

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
          component={CattleTopStack}
        />
        <Stack.Screen
          name='SearchMotherView'
          component={SearchMother}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name='SearchOffspringView'
          component={SearchOffspring}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </View>
  )
}

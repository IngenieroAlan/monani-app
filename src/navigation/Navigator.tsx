import DietFeedRoute from '@/components/layout/cattleDetails/Components/dietFeed/DietFeedRoute'
import DietSettingsRoute from '@/components/layout/cattleDetails/Components/dietFeed/DietSettingsRoute'
import SearchMother from '@/components/layout/cattleDetails/Components/genealogy/SearchMother'
import SearchOffspring from '@/components/layout/cattleDetails/Components/genealogy/SearchOffspring'
import MedicationScheduleRoute from '@/components/layout/cattleDetails/Components/medicationSchedules/MedicationScheduleRoute'
import { useAppDispatch } from '@/hooks/useRedux'
import { CattleTopStack } from '@/navigation/stacks/CattleTopStack'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import CreateCattleArchiveView from '@/views/cattleInfo/cattleArchive/CreateCattleArchiveView'
import EditCattleArchiveView from '@/views/cattleInfo/cattleArchive/EditCattleArchiveView'
import CreateCattleSaleView from '@/views/cattleInfo/CreateCattleSaleView'
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
  const dispatch = useAppDispatch()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenListeners={{
          blur: () => dispatch(reset())
        }}
      >
        <Stack.Screen
          name='BottomTabsStack'
          component={BottomTabsStack}
        />
        <Stack.Screen
          name='AddCattleStack'
          component={AddCattleStack}
        />
        <Stack.Screen
          name='CattleDetailsLayout'
          component={CattleTopStack}
        />
        <Stack.Screen
          name='ResourcesStack'
          component={ResourcesStack}
        />
        <Stack.Screen
          name='AnnualEarningsView'
          component={AnnualEarningsView}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name='SearchCattleView'
            component={SearchCattle}
          />
          <Stack.Screen
            name='DietSettingsRoute'
            component={DietSettingsRoute}
          />
          <Stack.Screen
            name='DietFeedRoute'
            component={DietFeedRoute}
          />
          <Stack.Screen
            name='MedicationScheduleRoute'
            component={MedicationScheduleRoute}
          />
          <Stack.Screen
            name='SearchMotherView'
            component={SearchMother}
          />
          <Stack.Screen
            name='SearchOffspringView'
            component={SearchOffspring}
          />
          <Stack.Screen
            name='CreateCattleArchiveView'
            component={CreateCattleArchiveView}
          />
          <Stack.Screen
            name='EditCattleArchiveView'
            component={EditCattleArchiveView}
          />
          <Stack.Screen 
            name='CreateCattleSaleView'
            component={CreateCattleSaleView}
          />
        </Stack.Group>
      </Stack.Navigator>
    </View>
  )
}

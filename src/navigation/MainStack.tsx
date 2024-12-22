import DietFeedRoute from '@/components/layout/cattleDetails/Components/dietFeed/DietFeedRoute'
import DietSettingsRoute from '@/components/layout/cattleDetails/Components/dietFeed/DietSettingsRoute'
import SearchMother from '@/components/layout/cattleDetails/Components/genealogy/SearchMother'
import SearchOffspring from '@/components/layout/cattleDetails/Components/genealogy/SearchOffspring'
import EditCattleInfoView from '@/components/layout/cattleDetails/Components/info/EditCattleInfoView'
import MedicationScheduleRoute from '@/components/layout/cattleDetails/Components/medicationSchedules/MedicationScheduleRoute'
import { useAppDispatch } from '@/hooks/useRedux'
import { CattleInfoTabsStack } from '@/navigation/CattleInfoTabsStack'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import CreateCattleArchiveView from '@/views/cattleInfo/cattleArchive/CreateCattleArchiveView'
import EditCattleArchiveView from '@/views/cattleInfo/cattleArchive/EditCattleArchiveView'
import CreateCattleSaleView from '@/views/cattleInfo/CreateCattleSaleView'
import CreateMilkReportView from '@/views/cattleInfo/CreateMilkReportView'
import EarningsAnnualSummaryView from '@/views/earningsAnnualSummary/EarningsAnnualSummary'
import SearchCattleView from '@/views/searchCattle/SearchCattleView'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import CreateCattleStack from './CreateCattleStack'
import HomeTabsStack from './HomeTabsStack'
import ResourcesStack from './ResourcesStack'
import { MainStackParamList } from './types'

const Stack = createStackNavigator<MainStackParamList>()

export const MainStack = () => {
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
          name='HomeTabsStack'
          component={HomeTabsStack}
        />
        <Stack.Screen
          name='CreateCattleStack'
          component={CreateCattleStack}
        />
        <Stack.Screen
          name='CattleInfoTabsStack'
          component={CattleInfoTabsStack}
        />
        <Stack.Screen
          name='ResourcesStack'
          component={ResourcesStack}
        />
        <Stack.Screen
          name='EarningsAnnualSummaryView'
          component={EarningsAnnualSummaryView}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name='SearchCattleView'
            component={SearchCattleView}
          />
          <Stack.Screen
            name='EditCattleInfoView'
            component={EditCattleInfoView}
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
          <Stack.Screen
            name='CreateMilkReportView'
            component={CreateMilkReportView}
          />
        </Stack.Group>
      </Stack.Navigator>
    </View>
  )
}

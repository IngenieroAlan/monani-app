import DietFeedRoute from '@/components/layout/cattleDetails/Components/dietFeed/DietFeedRoute'
import { DietSettingsRoute } from '@/components/layout/cattleDetails/Components/dietFeed/DietSettingsRoute'
import SearchMother from '@/components/layout/cattleDetails/Components/genealogy/SearchMother'
import SearchOffspring from '@/components/layout/cattleDetails/Components/genealogy/SearchOffspring'
import EditCattleInfoView from '@/components/layout/cattleDetails/Components/info/EditCattleInfoView'
import MedicationScheduleRoute from '@/components/layout/cattleDetails/Components/medicationSchedules/MedicationScheduleRoute'
import CreateCattleArchiveView from '@/views/cattleInfo/cattleArchive/CreateCattleArchiveView'
import EditCattleArchiveView from '@/views/cattleInfo/cattleArchive/EditCattleArchiveView'
import CreateCattleSaleView from '@/views/cattleInfo/CreateCattleSaleView'
import CreateMilkReportView from '@/views/cattleInfo/CreateMilkReportView'
import { createStackNavigator } from '@react-navigation/stack'
import { CattleInfoTabsStack } from './CattleInfoTabsStack'
import { CattleStackParamList } from './types'

const Stack = createStackNavigator<CattleStackParamList>()

export const CattleStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='CattleInfoTabsStack'
        component={CattleInfoTabsStack}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name='EditCattleInfoView'
          component={EditCattleInfoView}
        />
        <Stack.Screen
          name='EditDietProportionsView'
          component={DietSettingsRoute}
        />
        <Stack.Screen
          name='CreateDietFeedView'
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
  )
}

import { SurfaceContainer } from '@/components/SurfaceContainer'
import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import EarningsAnnualSummaryView from '@/views/earnings/earningsAnnualSummary/EarningsAnnualSummary'
import SearchCattleView from '@/views/searchCattle/SearchCattleView'
import { createStackNavigator } from '@react-navigation/stack'
import { CattleStack } from './CattleStack'
import { CreateCattleStack } from './CreateCattleStack'
import { HomeTabsStack } from './HomeTabsStack'
import { ResourcesStack } from './ResourcesStack'
import { MainStackParamList } from './types'

const Stack = createStackNavigator<MainStackParamList>()

export const MainStack = () => {
  const dispatch = useAppDispatch()

  return (
    <SurfaceContainer>
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
          name='CattleStack'
          component={CattleStack}
        />
        <Stack.Screen
          name='CreateCattleStack'
          component={CreateCattleStack}
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
        </Stack.Group>
      </Stack.Navigator>
    </SurfaceContainer>
  )
}

import BottomTabsSnackbarContainer from '@/components/BottomTabsSnackbarContainer'
import { CattleFiltersProvider } from '@/contexts/CattleFiltersContext'
import { useNotificationsCount } from '@/hooks/collections/useNotificationsCount'
import { useAppDispatch } from '@/hooks/useRedux'
import { setShowBottomStack } from '@/redux/slices/ui'
import { HomeView } from '@/screens/home/HomeView'
import NotificationsView from '@/screens/notifications/NotificationsView'
import { Icon, Portal } from 'react-native-paper'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import { EarningsStack } from './EarningsStack'
import { MilkProductionStack } from './MilkProductionStack'
import { HomeTabsStackParamList, MaterialBottomTabNavigator } from './types'

const Tab: MaterialBottomTabNavigator<HomeTabsStackParamList> = createMaterialBottomTabNavigator()

export const HomeTabsStack = () => {
  const dispatch = useAppDispatch()

  return (
    <CattleFiltersProvider flags={{ isActive: true }}>
      <Portal.Host>
        <Tab.Navigator
          screenListeners={{
            blur: () => {
              dispatch(setShowBottomStack(true))
            }
          }}
        >
          <Tab.Screen
            name='Cattle'
            component={HomeView}
            options={{
              tabBarLabel: 'Ganado',
              tabBarIcon: ({ color }) => (
                <Icon
                  source='cow'
                  color={color}
                  size={24}
                />
              )
            }}
          />
          <Tab.Screen
            name='MilkProduction'
            component={MilkProductionStack}
            options={{
              tabBarLabel: 'Prod. lechera',
              tabBarIcon: ({ color }) => (
                <Icon
                  source='beer-outline'
                  color={color}
                  size={24}
                />
              )
            }}
          />
          <Tab.Screen
            name='Earnings'
            component={EarningsStack}
            options={{
              tabBarLabel: 'Ganancias',
              tabBarIcon: ({ color }) => (
                <Icon
                  source='cash-multiple'
                  color={color}
                  size={24}
                />
              )
            }}
          />
          <Tab.Screen
            name='Notifications'
            component={NotificationsView}
            options={() => {
              // To prevent re rendering the whole bottom tab.
              const { notificationsCount } = useNotificationsCount()

              return {
                tabBarLabel: 'Notificaciones',
                tabBarBadge: notificationsCount || undefined,
                tabBarIcon: ({ color }) => (
                  <Icon
                    source='bell-outline'
                    color={color}
                    size={24}
                  />
                )
              }
            }}
          />
        </Tab.Navigator>

        <BottomTabsSnackbarContainer />
      </Portal.Host>
    </CattleFiltersProvider>
  )
}

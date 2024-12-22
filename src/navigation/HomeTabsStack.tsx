import BottomTabsSnackbarContainer from '@/components/BottomTabsSnackbarContainer'
import { CattleFiltersProvider } from '@/contexts/CattleFiltersContext'
import useSentNotifications from '@/hooks/collections/useSentNotifications'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setShowBottomStack } from '@/redux/slices/ui'
import { HomeView } from '@/views/home/Home'
import NotificationsView from '@/views/notifications/NotificationsView'
import React from 'react'
import { Icon, Portal } from 'react-native-paper'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import { EarningsStack } from './EarningsStack'
import { MilkProductionStack } from './MilkProductionStack'
import { HomeTabsParamList, MaterialBottomTabNavigator } from './types'

const Tab: MaterialBottomTabNavigator<HomeTabsParamList> = createMaterialBottomTabNavigator<HomeTabsParamList>()

const HomeTabsStack = () => {
  const dispatch = useAppDispatch()
  const { showBottomStack } = useAppSelector((state) => state.ui)

  return (
    <CattleFiltersProvider flags={{ isActive: true }}>
      <Portal.Host>
        <Tab.Navigator
          barStyle={{ display: showBottomStack ? 'flex' : 'none' }}
          screenListeners={{
            blur: () => {
              dispatch(setShowBottomStack(true))
            }
          }}
        >
          <Tab.Screen
            name='Ganado'
            component={HomeView}
            options={{
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
            name='Prod. lechera'
            component={MilkProductionStack}
            options={{
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
            name='Ganancias'
            component={EarningsStack}
            options={{
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
            name='Notificaciones'
            component={NotificationsView}
            options={() => {
              // To prevent re rendering the whole bottom tab.
              const { notifications } = useSentNotifications({ isMarkedAsRead: false })

              return {
                tabBarBadge: notifications.length || undefined,
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

export default HomeTabsStack

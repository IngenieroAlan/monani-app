import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import EarningsSummaryView from '@/screens/earnings/earningsSummary/EarningsSummaryView'
import EarningsTransactionsView from '@/screens/earnings/earningsTransactions/EarningsTransactionsView'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Icon, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EarningsStackParamList } from './types'

const Stack = createMaterialTopTabNavigator<EarningsStackParamList>()

export const EarningsStack = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  return (
    <Stack.Navigator
      screenListeners={{
        blur: () => dispatch(reset())
      }}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.surfaceVariant
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
          borderRadius: 5
        },
        tabBarAndroidRipple: { borderless: false }
      }}
      style={{ paddingTop: insets.top }}
    >
      <Stack.Screen
        name='EarningsTransactionsView'
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              source='currency-usd'
              color={color}
              size={24}
            />
          ),
          tabBarLabel: 'Transacciones'
        }}
        component={EarningsTransactionsView}
      />
      <Stack.Screen
        name='EarningsSummaryView'
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              source='script-text-outline'
              color={color}
              size={24}
            />
          ),
          tabBarLabel: 'Resumen'
        }}
        component={EarningsSummaryView}
      />
    </Stack.Navigator>
  )
}

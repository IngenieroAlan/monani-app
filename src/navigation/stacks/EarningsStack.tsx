import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Icon, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EarningsView from '../../views/earnings/Earnings'
import EarningsResumeView from '../../views/earnings/EarningsResume'
import { EarningsStackParamList } from '../types'

const Stack = createMaterialTopTabNavigator<EarningsStackParamList>()

export const EarningsStack = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Stack.Navigator
      style={{ paddingTop: insets.top }}
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
    >
      <Stack.Screen
        name='EarningsView'
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              source='currency-usd'
              color={color}
              size={24}
            />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Transacciones</Text>
        }}
        component={EarningsView}
      />
      <Stack.Screen
        name='EarningsResumeView'
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              source='script-text-outline'
              color={color}
              size={24}
            />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Resumen</Text>
        }}
        component={EarningsResumeView}
      />
    </Stack.Navigator>
  )
}

import { useAppDispatch } from '@/hooks/useRedux'
import { setShowBottomStack } from '@/redux/slices/ui'
import { DailyMilkProductionView } from '@/screens/milkProduction/dailyMilkProduction/DailyMilkProductionView'
import { MilkProductionSummaryView } from '@/screens/milkProduction/milkProductionSummary/MilkProductionSummaryView'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Icon, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MilkProductionStackParamList } from './types'

const Stack = createMaterialTopTabNavigator<MilkProductionStackParamList>()

export const MilkProductionStack = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  return (
    <Stack.Navigator
      screenListeners={{
        blur: () => {
          dispatch(setShowBottomStack(true))
        }
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
        name='DailyMilkProductionView'
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              source='beer-outline'
              color={color}
              size={24}
            />
          ),
          tabBarLabel: 'Producción diaria'
        }}
        component={DailyMilkProductionView}
      />
      <Stack.Screen
        name='MilkProductionSummaryView'
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
        component={MilkProductionSummaryView}
      />
    </Stack.Navigator>
  )
}

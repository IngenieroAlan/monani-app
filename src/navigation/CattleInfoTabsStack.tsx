import CattleBottomAppBar from '@/components/layout/cattleDetails/Components/CattleTopStack/CattleBottomAppBar'
import CattleSaleSnackbarContainer from '@/components/layout/cattleDetails/Components/CattleTopStack/CattleSaleSnackbarContainer'
import CattleStackSnackbarContainer from '@/components/layout/cattleDetails/Components/CattleTopStack/CattleStackSnackbarContainer'
import { GenealogyRoute } from '@/components/layout/cattleDetails/routes/Genealogy'
import MilkProductionRoute from '@/components/layout/cattleDetails/routes/MilkProduction'
import { WeightRoute } from '@/components/layout/cattleDetails/routes/Weight'
import Cattle from '@/database/models/Cattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { CattleInfoTabsStackParamList } from '@/navigation/types'
import { unnestOneCattle } from '@/redux/slices/cattles'
import { setScreen } from '@/redux/slices/ui'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { Appbar, Icon, Portal, Text, useTheme } from 'react-native-paper'
import { DietRoute } from '../components/layout/cattleDetails/routes/Diet'
import { InfoRoute } from '../components/layout/cattleDetails/routes/Info'
import { MedicationRoute } from '../components/layout/cattleDetails/routes/Medication'

const ICON_SIZE = 24

const StackAppBar = ({ cattle }: { cattle: Cattle }) => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const nestedCattles = useAppSelector((state) => state.cattles.nestedCattles)

  const onPress = useCallback(() => {
    if (nestedCattles.length > 0) {
      dispatch(unnestOneCattle())
      navigation.navigate('CattleInfoTabsStack', { screen: 'InfoRoute' })
    } else {
      navigation.goBack()
    }
  }, [nestedCattles])

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={onPress} />
      <Appbar.Content title={`No. ${cattle.tagId || 'Sin ID'}`} />
    </Appbar.Header>
  )
}

const Stack = createMaterialTopTabNavigator<CattleInfoTabsStackParamList>()

export const CattleInfoTabsStack = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const cattleInfo = useAppSelector((state) => state.cattles.cattleInfo)!

  return (
    <Portal.Host>
      <StackAppBar cattle={cattleInfo} />
      <Stack.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurface,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.surfaceVariant
          },
          tabBarItemStyle: { width: 'auto', paddingHorizontal: 24 },
          tabBarIndicatorContainerStyle: {
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: theme.colors.surface
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
            borderRadius: 3
          },
          tabBarAndroidRipple: { borderless: false },
          tabBarScrollEnabled: true
        }}
      >
        <Stack.Screen
          name={'InfoRoute'}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                size={ICON_SIZE}
                color={color}
                source='file-document-outline'
              />
            ),
            tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Información</Text>
          }}
          component={InfoRoute}
          listeners={{
            focus: () => dispatch(setScreen('InfoRoute'))
          }}
        />
        <Stack.Screen
          name={'DietRoute'}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                size={ICON_SIZE}
                color={color}
                source='nutrition'
              />
            ),
            tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Dieta</Text>
          }}
          component={DietRoute}
          listeners={{
            focus: () => dispatch(setScreen('DietRoute'))
          }}
        />
        <Stack.Screen
          name={'MedicationRoute'}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                size={ICON_SIZE}
                color={color}
                source='needle'
              />
            ),
            tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Medicación</Text>
          }}
          component={MedicationRoute}
          listeners={{
            focus: () => dispatch(setScreen('MedicationRoute'))
          }}
        />
        <Stack.Screen
          name={'WeightRoute'}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                size={ICON_SIZE}
                color={color}
                source='scale'
              />
            ),
            tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Pesaje</Text>
          }}
          component={WeightRoute}
          listeners={{
            focus: () => dispatch(setScreen('WeightRoute'))
          }}
        />
        {cattleInfo?.productionType === 'Lechera' && (
          <Stack.Screen
            name={'MilkyRoute'}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon
                  size={ICON_SIZE}
                  color={color}
                  source='beer-outline'
                />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Prod. Lechera</Text>
            }}
            component={MilkProductionRoute}
            listeners={{
              focus: () => dispatch(setScreen('MilkyRoute'))
            }}
          />
        )}
        <Stack.Screen
          name={'GenealogyRoute'}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                size={ICON_SIZE}
                color={color}
                source='family-tree'
              />
            ),
            tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Genealogía</Text>
          }}
          component={GenealogyRoute}
          listeners={{
            focus: () => dispatch(setScreen('GenealogyRoute'))
          }}
        />
      </Stack.Navigator>
      <CattleBottomAppBar cattle={cattleInfo!} />
      <CattleStackSnackbarContainer />
      <CattleSaleSnackbarContainer />
    </Portal.Host>
  )
}

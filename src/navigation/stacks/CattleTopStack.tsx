import Footer from '@/components/CattleTopStack/Footer';
import { GenealogyRoute } from '@/components/layout/cattleDetails/routes/Genealogy';
import { WeightRoute } from '@/components/layout/cattleDetails/routes/Weight';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { CattleInfoParamsList } from '@/navigation/types';
import { setScreen } from '@/redux/slices/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Icon, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DietRoute } from '../../components/layout/cattleDetails/routes/Diet';
import { InfoRoute } from "../../components/layout/cattleDetails/routes/Info";
import { MedicationRoute } from '../../components/layout/cattleDetails/routes/Medication';

const iconSize = 20;
const Stack = createMaterialTopTabNavigator<CattleInfoParamsList>()

export const CattleTopStack = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { cattleInfo } = useAppSelector(state => state.cattles);
  const navigator = useNavigation();
  const dispatch = useAppDispatch();

  const renderHeader = () => (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigator.goBack()} />
      <Appbar.Content title={`No. ${cattleInfo?.tagId || 'Sin ID'}`} />
    </Appbar.Header>
  );

  return (
    <>
      <Portal.Host>
        {renderHeader()}
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
            tabBarItemStyle: {
              width: "auto",
            },
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.primary,
              height: 3,
              borderRadius: 5
            },
            tabBarAndroidRipple: { borderless: false },
            tabBarScrollEnabled: true,
          }}
        >
          <Stack.Screen
            name={"InfoRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'file-document-outline'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Información</Text>
            }}
            component={InfoRoute}
            listeners={{
              focus: () => dispatch(setScreen('InfoRoute'))
            }}
          />
          <Stack.Screen
            name={"DietRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'food-apple-outline'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Dieta</Text>
            }}
            component={DietRoute}
            listeners={{
              focus: () => dispatch(setScreen('DietRoute'))
            }}
          />
          <Stack.Screen
            name={"MedicationRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'clipboard-text-outline'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Medicación</Text>
            }}
            component={MedicationRoute}
            listeners={{
              focus: () => dispatch(setScreen('MedicationRoute'))
            }}
          />
          <Stack.Screen
            name={"WeightRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'scale'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Pesaje</Text>
            }}
            component={WeightRoute}
            listeners={{
              focus: () => dispatch(setScreen('WeightRoute'))
            }}
          />
          <Stack.Screen
            name={"MilkyRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'beer-outline'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Prod. Lechera</Text>
            }}
            component={InfoRoute}
            listeners={{
              focus: () => dispatch(setScreen('MilkyRoute'))
            }}
          />
          <Stack.Screen
            name={"GenealogyRoute"}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={iconSize} color={color} source={'family-tree'} />
              ),
              tabBarLabel: ({ color }) => <Text style={{ color: color, textAlign: 'center' }}>Genealogía</Text>
            }}
            component={GenealogyRoute}
            listeners={{
              focus: () => dispatch(setScreen('GenealogyRoute'))
            }}
          />
        </Stack.Navigator>
        <Footer />
      </Portal.Host>
    </>
  )
}

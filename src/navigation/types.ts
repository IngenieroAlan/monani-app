import {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationState,
  NavigatorScreenParams,
  ParamListBase,
  RouteConfig,
  RouteGroupConfig,
  TabNavigationState
} from '@react-navigation/native'
import { MaterialBottomTabNavigationEventMap, MaterialBottomTabNavigationOptions } from 'react-native-paper'
import { MaterialBottomTabNavigatorProps } from 'react-native-paper/lib/typescript/react-navigation/navigators/createMaterialBottomTabNavigator'

export type MainStackParamList = {
  HomeTabsStack: NavigatorScreenParams<HomeTabsParamList>
  CattleInfoTabsStack: NavigatorScreenParams<CattleInfoTabsStackParamList>
  CreateCattleStack: undefined
  ResourcesStack: undefined
  SearchCattleView: undefined
  EarningsAnnualSummaryView: {
    year: number
    totalEarnings: number
    totalCattleEarnings: number
    totalMilkEarnings: number
    difference: number
  }
  EditCattleInfoView: undefined
  DietSettingsRoute: undefined
  DietFeedRoute?: {
    dietFeedId: string
    modify: boolean
  }
  MedicationScheduleRoute?: {
    medicationScheduleId: string
    modify: boolean
  }
  SearchMotherView: { edit: boolean } | undefined
  SearchOffspringView: undefined
  CreateCattleArchiveView: undefined
  EditCattleArchiveView: undefined
  CreateCattleSaleView: undefined
  CreateMilkReportView: undefined
}

export type HomeTabsParamList = {
  Ganado: undefined
  'Prod. lechera': undefined
  Ganancias: undefined
  Notificaciones: undefined
}

export type EarningsStackParamList = {
  EarningsTransactionsView: undefined
  EarningsSummaryView: undefined
}

export type ResourcesStackParamList = {
  ResourcesView: undefined
  FeedsView: undefined
  MedicationsView: undefined
}

export type CreateCattleStackParamList = {
  CattleInfo: undefined
  Diet: undefined
  DietSettings: undefined
  DietFeed:
    | {
        dietFeedId: string
        modify: boolean
      }
    | undefined
  Medications: undefined
  Medication:
    | {
        medicationScheduleId: string
        modify: boolean
      }
    | undefined
}
export type CattleInfoTabsStackParamList = {
  InfoRoute: undefined
  DietRoute: undefined
  MedicationRoute: undefined
  WeightRoute: undefined
  MilkyRoute: undefined
  GenealogyRoute: undefined
  FirstRoute: undefined
}

type LegacyTypedNavigator<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigator extends React.ComponentType<any>
> = {
  Navigator: React.ComponentType<
    Omit<React.ComponentProps<Navigator>, keyof DefaultNavigatorOptions<any, any, any, any, any, any>> &
      DefaultNavigatorOptions<ParamList, any, State, ScreenOptions, EventMap, any>
  >
  Group: React.ComponentType<RouteGroupConfig<ParamList, ScreenOptions, any>>
  Screen: <RouteName extends keyof ParamList>(
    _: RouteConfig<ParamList, RouteName, State, ScreenOptions, EventMap, any>
  ) => null
}

export type MaterialBottomTabNavigator<T extends ParamListBase> = LegacyTypedNavigator<
  T,
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  ({
    id,
    initialRouteName,
    backBehavior,
    children,
    screenListeners,
    screenOptions,
    ...rest
  }: MaterialBottomTabNavigatorProps) => React.JSX.Element
>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}

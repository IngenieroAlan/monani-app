import { NavigatorScreenParams } from '@react-navigation/native'

export type RootStackParamList = {
  BottomTabsStack: NavigatorScreenParams<BottomTabsParamList>
  SearchCattleView: undefined
  AddCattleStack: undefined
  ResourcesStack: undefined
  AnnualEarningsView: { year: number }
}

export type BottomTabsParamList = {
  "Ganado": undefined
  "Prod. lechera": undefined
  "Ganancias": undefined
  "Notificaciones": undefined
}

export type EarningsStackParamList = {
  EarningsView: undefined
  EarningsResumeView: undefined
}

export type ResourcesStackParamList = {
  ResourcesView: undefined
  FeedsView: undefined
  MedicationsView: undefined
}

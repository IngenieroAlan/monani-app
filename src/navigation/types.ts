import { NavigatorScreenParams } from '@react-navigation/native'

export type RootStackParamList = {
  BottomTabsStack: NavigatorScreenParams<BottomTabsParamList>
  SearchCattleView: undefined
  AddCattleStack: undefined
  ResourcesStack: undefined
  AnnualEarningsView: { year: number }
}

export type BottomTabsParamList = {
  Ganado: undefined
  'Prod. lechera': undefined
  Ganancias: undefined
  Notificaciones: undefined
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

export type AddCattleStackParamsList = {
  CattleInfo: undefined;
  Diet: undefined;
  DietSettings: undefined;
  DietFeed: {
    medicationScheduleId: string;
    modify: boolean;
  }
  | undefined;
  Medications: undefined;
  Medication: {
    medicationScheduleId: string;
    modify: boolean;
  }
  | undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

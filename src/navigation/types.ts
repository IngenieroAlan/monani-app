import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  BottomTabsStack: NavigatorScreenParams<BottomTabsParamList>;
  SearchCattleView: undefined;
  AddCattleStack: undefined;
  ResourcesStack: undefined;
  AnnualEarningsView: {
    year: number;
    totalEarnings: number;
    totalCattleEarnings: number;
    totalMilkEarnings: number;
    difference: number;
  };

  CattleDetailsLayout: NavigatorScreenParams<CattleInfoParamsList>;
  DietSettingsRoute: undefined;
  DietFeedRoute: {
    dietFeedId: string;
    modify: boolean;
  } | undefined;
  MedicationScheduleRoute: {
    medicationScheduleId: string;
    modify: boolean;
  } | undefined;
  SearchMotherView: { edit: boolean } | undefined;
  SearchOffspringView: undefined;
  NotificationsTest: undefined
};

export type BottomTabsParamList = {
  Ganado: undefined;
  "Prod. lechera": undefined;
  Ganancias: undefined;
  Notificaciones: undefined;
};

export type EarningsStackParamList = {
  EarningsView: undefined;
  EarningsResumeView: undefined;
};

export type ResourcesStackParamList = {
  ResourcesView: undefined;
  FeedsView: undefined;
  MedicationsView: undefined;
};

export type AddCattleStackParamsList = {
  CattleInfo: undefined;
  Diet: undefined;
  DietSettings: undefined;
  DietFeed: {
    dietFeedId: string;
    modify: boolean;
  } | undefined;
  Medications: undefined;
  Medication: {
    medicationScheduleId: string;
    modify: boolean;
  } | undefined;
};
export type CattleInfoParamsList = {
  InfoRoute: undefined;
  DietRoute: undefined;
  MedicationRoute: undefined;
  WeightRoute: undefined;
  MilkyRoute: undefined;
  GenealogyRoute: undefined;
  FirstRoute: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

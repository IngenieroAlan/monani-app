import { createContext, Dispatch } from "react";
import { Cattle, Diet, DietFeed, Genealogy } from "../interfaces/cattleInterfaces";
import { CattlesActions, CattleState } from "./CattleReducer";
import { MatterProportion } from "@/database/models/Diet";
import { CattleStatus, ProductionType } from "@/database/models/Cattle";

type CattleContextProps = {
  //Tus Props
  cattle: Cattle;
  genealogy: Genealogy;
  diet: Diet;
  dietFeeds: DietFeed[];
}

export const CattleInitialState: CattleState = {
  cattle: {
    cattleId: '',
    name: '',
    weight: 500, // temporary value
    bornAt: new Date(),
    tagId: '',
    tagCattleNumber: '',
    admittedAt: new Date(),
    cattleStatus: '' as CattleStatus,
    productionType: '' as ProductionType,
    quarantineDaysLeft: 0,
    pregnantAt: undefined,
    isActive: false,
    isArchived: false,
    isSold: false,
    dietId: '',
  },

  genealogy: {
    motherId: '',
    offspringId: '',
  },

  diet: {
    dietId: '0',
    waterAmount: 0,
    matterAmount: 0,
    percentage: 0,
    matterProportion: '' as MatterProportion,
    isConcentrateExcluded: false,
  },

  dietFeeds: [],
};

export const CattleContext = createContext({} as CattleContextProps);
export const CattleDispatchContext = createContext<Dispatch<CattlesActions>>({} as Dispatch<CattlesActions>);
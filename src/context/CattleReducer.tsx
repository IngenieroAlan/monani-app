import { Cattle, Diet, DietFeed, Feed, Genealogy } from "../interfaces/cattleInterfaces";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  }
};

export enum Types {
  SAVE_CATTLE_INFO = 'SAVE_CATTLE_INFO',
  SAVE_DIET_FEED = 'SAVE_DIET_FEED',
}

type Payload = {
  [Types.SAVE_CATTLE_INFO]: {
    cattle: Cattle;
    genealogy: Genealogy;
  };
  [Types.SAVE_DIET_FEED]: {
    dietFeedPayload: DietFeed;
  }
}

export type CattlesActions = ActionMap<Payload>[keyof ActionMap<Payload>];
export interface CattleState {
  cattle: Cattle;
  genealogy: Genealogy;
  diet: Diet;
  dietFeeds: DietFeed[];
}

export const cattlesReducer = (state: CattleState, action: CattlesActions): CattleState => {
  switch (action.type) {
    case Types.SAVE_CATTLE_INFO:
      return {
        ...state,
        cattle: action.payload.cattle,
        genealogy: action.payload.genealogy,
      };
    case Types.SAVE_DIET_FEED:
      return {
        ...state,
        dietFeeds: [...state.dietFeeds, action.payload.dietFeedPayload],
      };
    default:
      return {
        ...state,
      };
  }
};

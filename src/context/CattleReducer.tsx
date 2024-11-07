import { ACCattle, ACDiet, ACDietFeed, ACFeed, ACGenealogy } from "../interfaces/cattleInterfaces";
import { CattleInitialState } from "./CattleContext";

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

export enum ActionType {
  RESET = 'RESET',
  SAVE_CATTLE_INFO = 'SAVE_CATTLE_INFO',
  SAVE_DIET_FEED = 'SAVE_DIET_FEED',
  DELETE_DIET_FEED = 'DELETE_DIET_FEED',
}

type Payload = {
  [ActionType.RESET]: undefined;
  [ActionType.SAVE_CATTLE_INFO]: {
    cattle: ACCattle;
    genealogy: ACGenealogy;
  };
  [ActionType.SAVE_DIET_FEED]: {
    dietFeed: ACDietFeed;
  }
  [ActionType.DELETE_DIET_FEED]: {
    dietFeedId: string;
  }
}

export type CattlesActions = ActionMap<Payload>[keyof ActionMap<Payload>];
export interface CattleState {
  cattle: ACCattle;
  genealogy: ACGenealogy;
  diet: ACDiet;
  dietFeeds: ACDietFeed[];
}

export const cattlesReducer = (state: CattleState, action: CattlesActions): CattleState => {
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...CattleInitialState,
      };
    case ActionType.SAVE_CATTLE_INFO:
      return {
        ...state,
        cattle: action.payload.cattle,
        genealogy: action.payload.genealogy,
      };
    case ActionType.SAVE_DIET_FEED:
      return {
        ...state,
        dietFeeds: [...state.dietFeeds, action.payload.dietFeed],
      };
    case ActionType.DELETE_DIET_FEED:
      return {
        ...state,
        dietFeeds: state.dietFeeds.filter(dietFeed => dietFeed.dietFeedId !== action.payload.dietFeedId),
      };

    default:
      return {
        ...state,
      };
  }
};

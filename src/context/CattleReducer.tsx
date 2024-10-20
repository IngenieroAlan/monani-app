import { Cattle, Diet, DietFeed, Feed, Genealogy } from "../interfaces/cattleInterfaces";

export interface CattleState {
  cattle: Cattle;
  genealogy: Genealogy;
  diet: Diet;
  dietFeeds: DietFeed[];
}

export type CattlesAction =
  | {
    type: 'save_cattle_information' | 'save_diet_information' | 'save_diet_feed_information' | 'save_feed_information';
    payload: {
      cattle: Cattle,
      genealogy: Genealogy,
      diet: Diet,
      dietFeed: DietFeed,
    },
  }

export const cattlesReducer = (state: CattleState, action: CattlesAction): CattleState => {
  switch (action.type) {
    case 'save_cattle_information':
      return {
        ...state,
        cattle: action.payload.cattle,
        genealogy: action.payload.genealogy,
      };
    default:
      return {
        ...state,
      };
  }
};

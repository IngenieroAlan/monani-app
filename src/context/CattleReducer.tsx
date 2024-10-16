import { Cattle, Genealogy } from "../interfaces/cattleInterfaces";

export interface CattleState {
  cattle: Cattle;
  genealogy: Genealogy;
}

export type CattlesAction =
  | {
    type: 'save_cattle_information',
    payload: {
      cattle: Cattle,
      genealogy: Genealogy,
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

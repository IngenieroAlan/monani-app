import { Cattle } from "../interfaces/cattleInterfaces";

export interface CattleState {
    //Tus estados
    cattle:Cattle;
}

type CattlesAction =
    | {
        type: 'action'
        payload: {
            cattle: Cattle,
        },
    }

    export const cattlesReducer = (state: CattleState, action: CattlesAction): CattleState => {
        switch (action.type) {
          case 'action':
            return {
              ...state,
              cattle: action.payload.cattle,
            };
          default:
            return {
              ...state,
            };
        }
      };
      
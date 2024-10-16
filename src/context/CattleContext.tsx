import { createContext, Dispatch } from "react";
import { Cattle, Diet, Feed, Genealogy } from "../interfaces/cattleInterfaces";
import { CattlesAction } from "./CattleReducer";

type CattleContextProps = {
  //Tus Props
  cattle: Cattle;
  genealogy: Genealogy;
}

type TasksDispatchContext = {
  dispatch: React.Dispatch<{ type: "change_value"; payload: { cattle: Cattle; }; }>;
}

export const CattleContext = createContext({} as CattleContextProps);
export const CattleDispatchContext = createContext<Dispatch<CattlesAction>>({} as Dispatch<CattlesAction>);
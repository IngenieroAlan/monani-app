import { createContext } from "react";
import { Cattle } from "../interfaces/cattleInterfaces";

type CattleContextProps = {
    //Tus Props
    cattle: Cattle;
  }
  

export const CattleContext = createContext({} as CattleContextProps);
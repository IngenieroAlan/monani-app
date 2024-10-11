import React, { useReducer, useState } from 'react'
import { CattleContext } from './CattleContext';
import { CattleState, cattlesReducer } from './CattleReducer';
interface Props {
    children: JSX.Element | JSX.Element[];
  }

  const CattleInitialState: CattleState = {
    //Tu estado inicial
    cattle:{algo:""}
  };
export const CattleProvider = ({children}:Props) => {
    const [state, dispatch] = useReducer(cattlesReducer, CattleInitialState);
    //Tu logica
  return (
    <CattleContext.Provider value={{
        ...state,
        //Tu logica aqui va tambien
      }}>
        {children}
      </CattleContext.Provider>
  
  )
}

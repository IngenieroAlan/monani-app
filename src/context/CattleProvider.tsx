import React, { useReducer } from 'react';
import { CattleContext, CattleDispatchContext, CattleInitialState } from './CattleContext';
import { cattlesReducer } from './CattleReducer';
interface Props {
  children: JSX.Element | JSX.Element[];
}

export const CattleProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(cattlesReducer, CattleInitialState);

  return (
    <CattleContext.Provider value={{
      ...state,
    }}>
      <CattleDispatchContext.Provider value={dispatch}>
        {children}
      </CattleDispatchContext.Provider>
    </CattleContext.Provider>

  )
}

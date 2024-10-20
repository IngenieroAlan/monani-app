import React, { useReducer, useState } from 'react'
import { CattleContext, CattleDispatchContext } from './CattleContext';
import { CattleState, cattlesReducer } from './CattleReducer';
import { CattleStatus, ProductionType } from '@/database/models/Cattle';
import { MatterProportion } from '@/database/models/Diet';
interface Props {
  children: JSX.Element | JSX.Element[];
}

const CattleInitialState: CattleState = {
  cattle: {
    cattleId: '',
    name: '',
    weight: 0,
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

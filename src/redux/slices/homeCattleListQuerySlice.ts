import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomeCattleListQueryState = {
  whereBinds: {
    oneOfCattleStatus: CattleStatus[]
    eqProductionType: ProductionType[]
  }
}

const initialState: HomeCattleListQueryState = {
  whereBinds: {
    oneOfCattleStatus: [],
    eqProductionType: []
  }
} 

const homeCattleListQuerySlice = createSlice({
  name: 'homeCattleListQuery',
  initialState,
  reducers: {
    setOneOfCattleStatusBind: (state, bind: PayloadAction<CattleStatus[]>) => {
      state.whereBinds.oneOfCattleStatus = bind.payload
    },
    setEqProductionTypeBind: (state, bind: PayloadAction<ProductionType>) => {
      state.whereBinds.eqProductionType = [bind.payload]
    },
    removeBind: (state, bind: PayloadAction<keyof HomeCattleListQueryState['whereBinds']>) => {
      state.whereBinds[bind.payload] = []
    },
  }
})

export const {
  setOneOfCattleStatusBind,
  setEqProductionTypeBind,
  removeBind
} = homeCattleListQuerySlice.actions

export default homeCattleListQuerySlice.reducer

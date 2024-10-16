import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomeCattleListQueryState = {
  whereBinds: {
    oneOfCattleStatus: CattleStatus[]
    eqProductionType: ProductionType | null
  }
}

const initialState: HomeCattleListQueryState = {
  whereBinds: {
    oneOfCattleStatus: [],
    eqProductionType: null
  }
}

const homeCattleListQuerySlice = createSlice({
  name: 'homeCattleListQuery',
  initialState,
  reducers: {
    setOneOfCattleStatusBind: (state, bind: PayloadAction<CattleStatus[]>) => {
      state.whereBinds.oneOfCattleStatus = bind.payload
    },
    setEqProductionTypeBind: (state, bind: PayloadAction<ProductionType | null>) => {
      state.whereBinds.eqProductionType = bind.payload
    }
  }
})

export const { setOneOfCattleStatusBind, setEqProductionTypeBind } = homeCattleListQuerySlice.actions

export default homeCattleListQuerySlice.reducer

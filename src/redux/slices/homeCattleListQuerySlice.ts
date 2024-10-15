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
    setOneOfCattleStatusBind: (state, action: PayloadAction<CattleStatus[]>) => {
      state.whereBinds.oneOfCattleStatus = action.payload
    },
    removeOneOfCattleStatusBind: (state) => {
      state.whereBinds.oneOfCattleStatus = []
    }
  }
})

export const { setOneOfCattleStatusBind, removeOneOfCattleStatusBind } = homeCattleListQuerySlice.actions

export default homeCattleListQuerySlice.reducer

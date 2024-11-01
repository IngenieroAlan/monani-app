import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomeCattleListQueryState = {
  oneOfCattleStatus: Set<CattleStatus>
  eqProductionType: ProductionType | null
}

const initialState: HomeCattleListQueryState = {
  oneOfCattleStatus: new Set(),
  eqProductionType: null
}

const homeCattleListQuerySlice = createSlice({
  name: 'homeCattleListQuery',
  initialState,
  reducers: {
    addOneOfCattleStatus: (state, action: PayloadAction<CattleStatus>) => {
      state.oneOfCattleStatus.add(action.payload)
    },
    deleteOneOfCattleStatus: (state, action: PayloadAction<CattleStatus>) => {
      state.oneOfCattleStatus.delete(action.payload)
    },
    clearOneOfCattleStatus: (state) => {
      state.oneOfCattleStatus.clear()
    },
    setEqProductionType: (state, action: PayloadAction<ProductionType | null>) => {
      state.eqProductionType = action.payload
    }
  }
})

export const {
  addOneOfCattleStatus,
  deleteOneOfCattleStatus,
  clearOneOfCattleStatus,
  setEqProductionType
} = homeCattleListQuerySlice.actions

export default homeCattleListQuerySlice.reducer

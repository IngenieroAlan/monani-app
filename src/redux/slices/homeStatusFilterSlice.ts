import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomeFiltersState = {
  cattleStatusFilter: Set<CattleStatus>
  productionTypeFilter: ProductionType | null
}

const initialState: HomeFiltersState = {
  cattleStatusFilter: new Set(),
  productionTypeFilter: null
}

const homeFiltersSlice = createSlice({
  name: 'homeFilters',
  initialState,
  reducers: {
    setCattleStatusFilter: (state, action: PayloadAction<CattleStatus>) => {
      state.cattleStatusFilter.add(action.payload)
    },
    removeCattleStatusFilter: (state, action: PayloadAction<CattleStatus>) => {
      state.cattleStatusFilter.delete(action.payload)
    },
    clearCattleStatusFilter: (state) => {
      state.cattleStatusFilter.clear()
    },
    setProductionTypeFilter: (state, filter: PayloadAction<ProductionType | null>) => {
      state.productionTypeFilter = filter.payload
    }
  }
})

export const {
  setCattleStatusFilter,
  removeCattleStatusFilter,
  clearCattleStatusFilter,
  setProductionTypeFilter
} = homeFiltersSlice.actions

export default homeFiltersSlice.reducer

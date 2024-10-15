import { CattleStatus } from '@/database/models/Cattle'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomeStatusFilterState = {
  filters: Set<CattleStatus>
}

const initialState: HomeStatusFilterState = {
  filters: new Set()
}

const homeStatusFilterSlice = createSlice({
  name: 'homeStatusFilter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<CattleStatus>) => {
      state.filters.add(action.payload)
    },
    removeFilter: (state, action: PayloadAction<CattleStatus>) => {
      state.filters.delete(action.payload)
    },
    removeAll: (state) => {
      state.filters.clear()
    }
  }
})

export const { setFilter, removeFilter, removeAll } = homeStatusFilterSlice.actions

export default homeStatusFilterSlice.reducer

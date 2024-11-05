import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SalesType = 'Lechera' | 'Ganado'

type EarningsQueryState = {
  [listId: string]: {
    eqSalesType: SalesType | null
    betweenDates: number[] | null
    year: number | null
  }
}

const initialState: EarningsQueryState = {}

const earningsQuerySlice = createSlice({
  name: 'earningsQuery',
  initialState,
  reducers: {
    setEqSalesType: (state, action: PayloadAction<{ listId: string; eqSalesType: SalesType | null }>) => {
      const { listId, eqSalesType } = action.payload
      state[listId] = { ...state[listId], eqSalesType }
    },
    setBetweenDates: (state, action: PayloadAction<{ listId: string; betweenDates: number[] | null }>) => {
      const { listId, betweenDates } = action.payload
      state[listId] = { ...state[listId], betweenDates }
    },
    setYear: (state, action: PayloadAction<{ listId: string; year: number | null }>) => {
      const { listId, year } = action.payload
      state[listId] = { ...state[listId], year }
    },
    reset: () => initialState
  }
})

export const { setEqSalesType, setBetweenDates, setYear, reset } = earningsQuerySlice.actions

export default earningsQuerySlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SalesType = 'Lechera' | 'Ganado'

type EarningsQueryState = {
  eqSalesType: SalesType | null
  betweenDates: number[] | null
  year: number | null
}

const initialState: EarningsQueryState = {
  eqSalesType: null,
  betweenDates: null,
  year: null
}

const earningsQuerySlice = createSlice({
  name: 'earningsQuery',
  initialState,
  reducers: {
    setEqSalesType: (state, action: PayloadAction<SalesType | null>) => {
      state.eqSalesType = action.payload
    },
    setBetweenDates: (state, action: PayloadAction<number[] | null>) => {
      state.betweenDates = action.payload
    },
    setYear: (state, action: PayloadAction<number | null>) => {
      state.year = action.payload
    },
    reset: () => initialState
  }
})

export const { setEqSalesType, setBetweenDates, setYear, reset } = earningsQuerySlice.actions

export default earningsQuerySlice.reducer

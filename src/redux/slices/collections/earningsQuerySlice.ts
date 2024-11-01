import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SalesType = 'Lechera' | 'Ganado'

type EarningsQueryState = {
  eqSalesType: SalesType | null
  betweenDates: number[] | null
}

const initialState: EarningsQueryState = {
  eqSalesType: null,
  betweenDates: null
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
    }
  }
})

export const { setEqSalesType, setBetweenDates } = earningsQuerySlice.actions

export default earningsQuerySlice.reducer

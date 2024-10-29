import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SalesType = 'Lechera' | 'Ganado'

type EarningsQueryState = {
  eqSalesType: SalesType | null
}

const initialState: EarningsQueryState = {
  eqSalesType: null
}

const earningsQuerySlice = createSlice({
  name: 'earningsQuery',
  initialState,
  reducers: {
    setEqSalesType: (state, action: PayloadAction<SalesType | null>) => {
      state.eqSalesType = action.payload
    }
  }
})

export const { setEqSalesType } = earningsQuerySlice.actions

export default earningsQuerySlice.reducer

import { BetweenDatesSlice } from '../types'
import { MilkProductionsFilterSlice } from './types'

export const createBetweenDatesSlice: MilkProductionsFilterSlice<BetweenDatesSlice> = (set, get) => ({
  betweenDates: null,
  setBetweenDates: (betweenDates) => {
    get().resetIndex()
    set((state) => {
      state.betweenDates = betweenDates
    })
  }
})

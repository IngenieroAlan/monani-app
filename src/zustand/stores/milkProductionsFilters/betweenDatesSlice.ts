import { BetweenDatesSlice, MilkProductionsFilterSlice } from './types';

export const createBetweenDatesSlice: MilkProductionsFilterSlice<BetweenDatesSlice> = (set, get) => ({
  betweenDates: null,
  setBetweenDates: (betweenDates) =>
    set((state) => {
      state.betweenDates = betweenDates
    })
})

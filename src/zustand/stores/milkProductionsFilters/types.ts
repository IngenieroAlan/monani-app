import { StateCreator } from 'zustand'

export type BetweenDatesSlice = {
  betweenDates: number[] | null
  setBetweenDates: (betweenDates: number[] | null) => void
}

export type MilkProductionsFiltersStore = BetweenDatesSlice

export type MilkProductionsFilterSlice<T> = StateCreator<MilkProductionsFiltersStore, [['zustand/immer', never]], [], T>

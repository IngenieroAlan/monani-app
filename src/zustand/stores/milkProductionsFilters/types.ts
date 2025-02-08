import { StateCreator } from 'zustand'
import { BetweenDatesSlice } from '../types'

export type MilkProductionsFiltersStore = BetweenDatesSlice

export type MilkProductionsFilterSlice<T> = StateCreator<MilkProductionsFiltersStore, [['zustand/immer', never]], [], T>

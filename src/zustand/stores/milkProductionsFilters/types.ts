import { StateCreator } from 'zustand'
import { BetweenDatesSlice, PaginateIndexSlice } from '../types'

export type MilkProductionsFiltersStore = PaginateIndexSlice & BetweenDatesSlice

export type MilkProductionsFilterSlice<T> = StateCreator<MilkProductionsFiltersStore, [['zustand/immer', never]], [], T>

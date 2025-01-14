import { PaginateIndexSlice } from '../types'
import { MilkProductionsFilterSlice } from './types'

export const createPaginateIndexSlice: MilkProductionsFilterSlice<PaginateIndexSlice> = (set) => ({
  paginateIndex: 0,
  nextIndex: () =>
    set((state) => {
      state.paginateIndex++
    }),
  resetIndex: () =>
    set((state) => {
      state.paginateIndex = 0
    })
})

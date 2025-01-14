import { PaginateIndexSlice } from '../types'
import { CattleFilterSlice } from './types'

const createPaginateIndexSlice: CattleFilterSlice<PaginateIndexSlice> = (set) => ({
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

export default createPaginateIndexSlice

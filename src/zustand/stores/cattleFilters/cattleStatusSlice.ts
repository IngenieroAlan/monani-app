import { CattleFilterSlice, CattleStatusSlice } from './types'

const createCattleStatusSlice: CattleFilterSlice<CattleStatusSlice> = (set, get) => ({
  cattleStatus: new Set(),
  addCattleStatus: (cattleStatus) =>
    set((state) => {
      state.cattleStatus.add(cattleStatus)
    }),
  removeCattleStatus: (cattleStatus) =>
    set((state) => {
      state.cattleStatus.delete(cattleStatus)
    }),
  clearCattleStatus: () =>
    set((state) => {
      state.cattleStatus = new Set()
    })
})

export default createCattleStatusSlice

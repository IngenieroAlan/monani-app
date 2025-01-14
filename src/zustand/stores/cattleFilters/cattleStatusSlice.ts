import { CattleFilterSlice, CattleStatusSlice } from './types'

const createCattleStatusSlice: CattleFilterSlice<CattleStatusSlice> = (set, get) => ({
  cattleStatus: new Set(),
  addCattleStatus: (cattleStatus) => {
    get().resetIndex()
    set((state) => {
      state.cattleStatus.add(cattleStatus)
    })
  },
  removeCattleStatus: (cattleStatus) => {
    get().resetIndex()
    set((state) => {
      state.cattleStatus.delete(cattleStatus)
    })
  },
  clearCattleStatus: () => {
    get().resetIndex()
    set((state) => {
      state.cattleStatus = new Set()
    })
  }
})

export default createCattleStatusSlice

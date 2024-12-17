import { CattleFilterSlice, CattleFlagsSlice } from './types'

const createCattleFlagsSlice: CattleFilterSlice<CattleFlagsSlice> = (set, get) => ({
  flags: {},
  setFlag: (flag) => {
    get().resetIndex()
    set((state) => {
      state.flags[flag] = true
    })
  },
  removeFlag: (flag) => {
    get().resetIndex()
    set((state) => {
      const { [flag]: _, ...newFlags } = state.flags
      state.flags = newFlags
    })
  },
  clearFlags: () => {
    get().resetIndex()
    set((state) => {
      state.flags = {}
    })
  }
})

export default createCattleFlagsSlice

import { CattleFilterSlice, CattleFlags, CattleFlagsSlice } from './types'

const createCattleFlagsSlice =
  (initialState?: CattleFlags): CattleFilterSlice<CattleFlagsSlice> =>
  (set, get) => ({
    flags: initialState ?? {},
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

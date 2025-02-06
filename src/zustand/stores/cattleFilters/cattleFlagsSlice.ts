import { CattleFilterSlice, CattleFlags, CattleFlagsSlice } from './types'

const createCattleFlagsSlice =
  (initialState?: CattleFlags): CattleFilterSlice<CattleFlagsSlice> =>
  (set) => ({
    flags: initialState ?? {},
    setFlag: (flag) =>
      set((state) => {
        state.flags[flag] = true
      }),
    removeFlag: (flag) =>
      set((state) => {
        const { [flag]: _, ...newFlags } = state.flags
        state.flags = newFlags
      }),
    clearFlags: () =>
      set((state) => {
        state.flags = {}
      })
  })

export default createCattleFlagsSlice

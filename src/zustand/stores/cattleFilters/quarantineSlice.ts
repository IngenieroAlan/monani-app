import { CattleFilterSlice, QuarantineSlice } from './types'

const createQuarantineSlice: CattleFilterSlice<QuarantineSlice> = (set, get) => ({
  isInQuarantine: undefined,
  setIsInQuarantine: (isInQuarantine) =>
    set((state) => {
      state.isInQuarantine = isInQuarantine
    })
})

export default createQuarantineSlice

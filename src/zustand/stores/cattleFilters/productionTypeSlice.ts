import { CattleFilterSlice, ProductionTypeSlice } from './types'

const createProductionTypeSlice: CattleFilterSlice<ProductionTypeSlice> = (set, get) => ({
  productionType: undefined,
  setProductionType: (productionType) =>
    set((state) => {
      state.productionType = productionType
    })
})

export default createProductionTypeSlice

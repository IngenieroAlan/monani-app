import createCattleFlagsSlice from '@/zustand/stores/cattleFiltersStore/cattleFlagsSlice'
import createCattleStatusSlice from '@/zustand/stores/cattleFiltersStore/cattleStatusSlice'
import createPaginateIndexSlice from '@/zustand/stores/cattleFiltersStore/paginateIndexSlice'
import createProductionTypeSlice from '@/zustand/stores/cattleFiltersStore/productionTypeSlice'
import createQuarantineSlice from '@/zustand/stores/cattleFiltersStore/quarantineSlice'
import createTagIdSlice from '@/zustand/stores/cattleFiltersStore/tagIdSlice'
import { createContext, ReactNode, useContext, useState } from 'react'
import { createStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../zustand/createSelectors'
import { CattleFiltersStore } from '../zustand/stores/cattleFiltersStore/types'

const CattleFiltersContext = createContext<StoreApi<CattleFiltersStore> | undefined>(undefined)

export const CattleFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() =>
    createStore<CattleFiltersStore, [['zustand/immer', never]]>(
      immer((...a) => ({
        ...createPaginateIndexSlice(...a),
        ...createTagIdSlice(...a),
        ...createCattleStatusSlice(...a),
        ...createProductionTypeSlice(...a),
        ...createCattleFlagsSlice(...a),
        ...createQuarantineSlice(...a)
      }))
    )
  )

  return <CattleFiltersContext.Provider value={store}>{children}</CattleFiltersContext.Provider>
}

export const useCattleFilters = <T extends keyof CattleFiltersStore>(selector: T): CattleFiltersStore[T] => {
  const context = useContext(CattleFiltersContext)

  if (!context) {
    throw new Error('useCattleFilters must be used within CattleFiltersProvider.')
  }

  return createSelectors(context).use[selector]()
}

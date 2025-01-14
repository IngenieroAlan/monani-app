import createCattleFlagsSlice from '@/zustand/stores/cattleFilters/cattleFlagsSlice'
import createCattleStatusSlice from '@/zustand/stores/cattleFilters/cattleStatusSlice'
import createPaginateIndexSlice from '@/zustand/stores/cattleFilters/paginateIndexSlice'
import createProductionTypeSlice from '@/zustand/stores/cattleFilters/productionTypeSlice'
import createQuarantineSlice from '@/zustand/stores/cattleFilters/quarantineSlice'
import createTagIdSlice from '@/zustand/stores/cattleFilters/tagIdSlice'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../zustand/createSelectors'
import { CattleFiltersStore, CattleFlags } from '../zustand/stores/cattleFilters/types'

type CattleFiltersProviderProps = {
  flags?: CattleFlags
} & PropsWithChildren

const CattleFiltersContext = createContext<StoreApi<CattleFiltersStore> | undefined>(undefined)

export const CattleFiltersProvider = ({ children, flags }: CattleFiltersProviderProps) => {
  const [store] = useState(() =>
    createStore<CattleFiltersStore, [['zustand/immer', never]]>(
      immer((...a) => ({
        ...createPaginateIndexSlice(...a),
        ...createTagIdSlice(...a),
        ...createCattleStatusSlice(...a),
        ...createProductionTypeSlice(...a),
        ...createCattleFlagsSlice(flags)(...a),
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

import { createSelectors } from '@/zustand/createSelectors'
import { createBetweenDatesSlice } from '@/zustand/stores/milkProductionsFilters/betweenDatesSlice'
import { MilkProductionsFiltersStore } from '@/zustand/stores/milkProductionsFilters/types'
import { createContext, ReactNode, useContext, useState } from 'react'
import { createStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const MilkProductionsFiltersContext = createContext<StoreApi<MilkProductionsFiltersStore> | undefined>(undefined)

export const MilkProductionsFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() =>
    createStore<MilkProductionsFiltersStore, [['zustand/immer', never]]>(
      immer((...a) => ({
        ...createBetweenDatesSlice(...a)
      }))
    )
  )

  return <MilkProductionsFiltersContext.Provider value={store}>{children}</MilkProductionsFiltersContext.Provider>
}

export const useMilkProductionsFilters = <T extends keyof MilkProductionsFiltersStore>(
  selector: T
): MilkProductionsFiltersStore[T] => {
  const context = useContext(MilkProductionsFiltersContext)

  if (!context) {
    throw new Error('useMilkProductionsFilters must be used within MilkProductionsFiltersProvider.')
  }

  return createSelectors(context).use[selector]()
}

import { CattleStatus, ProductionType } from '@/database/models/Cattle'

export const cattleKeys = {
  all: ['cattle'] as const,
  filtered: (
    filters: Partial<{
      tagId: string
      cattleStatus: CattleStatus[] | Set<CattleStatus>
      productionType: ProductionType | null
      isActive: boolean
      isArchived: boolean
      isSold: boolean
      isInQuarantine: boolean
    }> = {}
  ) =>
    [
      ...cattleKeys.all,
      {
        ...filters,
        cattleStatus: Array.from(filters.cattleStatus ?? [])
      }
    ] as const,
  byId: (id: string) => [...cattleKeys.all, { id }] as const
}

import { DailyMilkProductionsFilters } from './useInfiniteDailyMilkProductionsQuery'

export const milkProductionsKeys = {
  all: ['milkProductions'] as const,
  byId: (id: string) => [...milkProductionsKeys.all, { id }] as const,
  daily: () => [...milkProductionsKeys.all, 'daily'] as const,
  dailyFiltered: (filters: DailyMilkProductionsFilters) => [...milkProductionsKeys.daily(), filters] as const
}

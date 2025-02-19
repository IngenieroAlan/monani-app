import dayjs from 'dayjs'
import { DailyMilkProductionsFilters } from './useInfiniteDailyMilkProductionsQuery'

export const milkProductionsKeys = {
  all: ['milkProductions'] as const,
  byId: (id: string) => [...milkProductionsKeys.all, { id }] as const,

  daily: () => [...milkProductionsKeys.all, 'daily'] as const,
  dayBefore: (date: dayjs.ConfigType) => [...milkProductionsKeys.daily(), { before: dayjs(date).valueOf() }] as const,
  dailyFiltered: (filters: DailyMilkProductionsFilters) => [...milkProductionsKeys.daily(), filters] as const,
  groupedByDate: (date: dayjs.ConfigType) => {
    return [
      ...milkProductionsKeys.daily(),
      { date: dayjs(date).hour(0).minute(0).second(0).millisecond(0).valueOf() }
    ] as const
  }
}

export const milkReportsKeys = {
  all: ['milkReports'],
  groupedByProduction: (productionId: string) => {
    return [...milkReportsKeys.all, { productionId }] as const
  }
}

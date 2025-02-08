import { DailyMilkProductionsCol as Column, TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { paginateQuery } from '../paginateQuery'
import { milkProductionsKeys } from './queryKeyFactory'

export type DailyMilkProductionsFilters = Partial<{
  betweenDates: number[] | null
}>

export const useInfiniteDailyMilkProductionsQuery = (filters: DailyMilkProductionsFilters) => {
  const db = useDatabase()
  let query = db.get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS).query(Q.sortBy(Column.PRODUCED_AT, Q.desc))

  const { betweenDates } = filters

  if (betweenDates?.length) {
    query = query.extend(Q.where(Column.PRODUCED_AT, Q.between(betweenDates[0], betweenDates[1])))
  }

  return useInfiniteQuery({
    queryKey: milkProductionsKeys.dailyFiltered(filters),
    queryFn: ({ pageParam }) => paginateQuery(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextPage }) => nextPage
  })
}

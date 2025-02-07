import { MedicationsCol as Column, TableName } from '@/database/constants'
import Medication from '@/database/models/Medication'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { paginateQuery } from '../paginateQuery'
import { medicationsKeys } from './queryKeyFactory'

export const useInfiniteMedicationsQuery = () => {
  const db = useDatabase()
  const query = db.get<Medication>(TableName.MEDICATIONS).query(Q.sortBy(Column.NAME, Q.asc))

  return useInfiniteQuery({
    queryKey: medicationsKeys.all,
    queryFn: ({ pageParam }) => paginateQuery(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextPage }) => nextPage
  })
}

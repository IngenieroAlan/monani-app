import { FeedsCol as Column, TableName } from '@/database/constants'
import Feed from '@/database/models/Feed'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { feedsKeys } from './queryKeyFactory'
import { paginateQuery } from '../paginateQuery'

export const useInfiniteFeedsQuery = () => {
  const db = useDatabase()
  const query = db.get<Feed>(TableName.FEEDS).query(Q.sortBy(Column.NAME, Q.asc))

  return useInfiniteQuery({
    queryKey: feedsKeys.all,
    queryFn: ({ pageParam }) => paginateQuery(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextPage }) => nextPage
  })
}

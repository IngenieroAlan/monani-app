import { CattleCol as Column, TableName } from '@/database/constants'
import Cattle, { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { paginateQuery } from '@/utils/paginateQuery'
import { Q } from '@nozbe/watermelondb'
import { sanitizeLikeString } from '@nozbe/watermelondb/QueryDescription'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useInfiniteQuery } from '@tanstack/react-query'

type Props = Partial<{
  tagId: string
  cattleStatus: CattleStatus[] | Set<CattleStatus>
  productionType: ProductionType | null
  isActive: boolean
  isArchived: boolean
  isSold: boolean
  isInQuarantine: boolean
}>

export const useInfiniteCattleQuery = ({
  tagId,
  cattleStatus,
  productionType,
  isActive,
  isArchived,
  isSold,
  isInQuarantine
}: Props = {}) => {
  const db = useDatabase()
  let query = db.get<Cattle>(TableName.CATTLE).query()

  if (tagId) {
    query = query.extend(Q.where(Column.TAG_ID, Q.like(`${sanitizeLikeString(tagId)}%`)))
  }

  if (cattleStatus && Array.from(cattleStatus).length > 0) {
    query = query.extend(Q.where(Column.CATTLE_STATUS, Q.oneOf(Array.from(cattleStatus))))
  }

  if (productionType) {
    query = query.extend(Q.where(Column.PRODUCTION_TYPE, productionType))
  }

  if (isActive || isArchived || isSold) {
    const orQuery: Q.Where[] = []
    isActive && orQuery.push(Q.where(Column.IS_ACTIVE, isActive))
    isArchived && orQuery.push(Q.where(Column.IS_ARCHIVED, isArchived))
    isSold && orQuery.push(Q.where(Column.IS_SOLD, isSold))

    query = query.extend(Q.or(orQuery))
  }

  if (isInQuarantine !== undefined) {
    query = query.extend(Q.where(Column.QUARANTINE_ENDS_AT, isInQuarantine ? Q.notEq(null) : Q.eq(null)))
  }

  return useInfiniteQuery({
    queryKey: [
      'cattle',
      {
        tagId,
        cattleStatus: cattleStatus ? Array.from(cattleStatus) : undefined,
        productionType,
        isActive,
        isArchived,
        isSold,
        isInQuarantine
      }
    ],
    queryFn: ({ pageParam }) => paginateQuery(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextPage }) => nextPage
  })
}

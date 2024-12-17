import Cattle, { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { sanitizeLikeString } from '@nozbe/watermelondb/QueryDescription'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type UseCattleProps = {
  tagId?: string
  cattleStatus?: CattleStatus[] | Set<CattleStatus>
  productionType?: ProductionType | null
  isActive?: boolean
  isArchived?: boolean
  isSold?: boolean
  isInQuarantine?: boolean
  take?: number
}

const useCattle = ({
  tagId,
  cattleStatus,
  productionType,
  isActive,
  isArchived,
  isSold,
  isInQuarantine,
  take
}: UseCattleProps = {}) => {
  const database = useDatabase()
  const [isPending, setIsPending] = useState(true)
  const [cattleRecords, setCattleRecords] = useState<Cattle[]>([])

  let cattleQuery = database.get<Cattle>(TableName.CATTLE).query()

  if (take) {
    cattleQuery = cattleQuery.extend(Q.take(take))
  }

  if (tagId) {
    cattleQuery = cattleQuery.extend(Q.where('tag_id', Q.like(`${sanitizeLikeString(tagId)}%`)))
  }

  if (cattleStatus && Array.from(cattleStatus).length > 0) {
    cattleQuery = cattleQuery.extend(Q.where('cattle_status', Q.oneOf(Array.from(cattleStatus))))
  }

  if (productionType) {
    cattleQuery = cattleQuery.extend(Q.where('production_type', productionType))
  }

  if (isActive || isArchived || isSold) {
    const orQuery: Q.Where[] = []
    isActive && orQuery.push(Q.where('is_active', isActive))
    isArchived && orQuery.push(Q.where('is_archived', isArchived))
    isSold && orQuery.push(Q.where('is_sold', isSold))

    cattleQuery = cattleQuery.extend(Q.or(orQuery))
  }

  if (isInQuarantine !== undefined) {
    cattleQuery = cattleQuery.extend(Q.where('quarantine_ends_at', isInQuarantine ? Q.notEq(null) : Q.eq(null)))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = cattleQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setCattleRecords(data)
      }).then(() => setIsPending(false))
    })

    return () => subscription.unsubscribe()
  }, [tagId, cattleStatus, productionType, isActive, isArchived, isSold, isInQuarantine])

  // runAfterInteractions seems to work fine for now, but it shouldn't be used here.
  useEffect(() => {
    const subscription = cattleQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setCattleRecords(data)
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { cattleRecords, isPending }
}

export default useCattle

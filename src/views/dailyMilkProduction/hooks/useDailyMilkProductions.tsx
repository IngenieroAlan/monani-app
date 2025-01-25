import { DailyMilkProductionsCol as Column, TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type Props = {
  take?: number
  betweenDates?: number[] | null
}

export const useDailyMilkProductions = ({ take, betweenDates }: Props = {}) => {
  const db = useDatabase()
  const [records, setRecords] = useState<DailyMilkProduction[]>([])
  const [isPending, setIsPending] = useState(true)

  let query = db.get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS).query(Q.sortBy(Column.PRODUCED_AT, Q.desc))

  if (betweenDates?.length) {
    query = query.extend(Q.where(Column.PRODUCED_AT, Q.between(betweenDates[0], betweenDates[1])))
  }

  if (take) {
    query = query.extend(Q.take(take))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = query.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(data)
        setIsPending(false)
      })
    })

    return () => subscription.unsubscribe()
  }, [betweenDates])

  useEffect(() => {
    const subscription = query.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(data)
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { milkProductionsRecords: records, isPending }
}

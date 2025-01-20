import MilkProduction from '@/database/models/MilkProduction'
import { TableName } from '@/database/schema'
import { Database, Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { format, set } from 'date-fns'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'
import { map, Subscription } from 'rxjs'

type Props = {
  take?: number
  betweenDates?: number[] | null
}

const getRawQuery = (take: number) =>
  Q.unsafeSqlQuery(`
      SELECT produced_at FROM ${TableName.MILK_PRODUCTIONS}
      GROUP BY strftime('%d/%m/%Y', produced_at / 1000, 'unixepoch')
      ORDER BY produced_at DESC
      LIMIT 1 OFFSET ${take - 1}
    `)

const extendQueryWithTake = async (db: Database, take?: number) => {
  if (!take) return []

  const [result] = (await db.get(TableName.MILK_PRODUCTIONS).query(getRawQuery(take)).unsafeFetchRaw()) as {
    produced_at: number
  }[]

  if (!result?.produced_at) return []

  const formattedDate = set(result.produced_at, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 }).getTime()
  return [Q.where('produced_at', Q.gte(formattedDate))]
}

const groupMilkProductions = (data: MilkProduction[]) => {
  return Object.values(
    data.reduce<Record<string, MilkProduction[]>>((acc, milkProduction) => {
      const date = format(milkProduction.producedAt, 'dd/MM/yy')

      if (!acc[date]) acc[date] = []
      acc[date].push(milkProduction)

      return acc
    }, {})
  )
}

export const useMilkProductions = ({ take, betweenDates }: Props = {}) => {
  const database = useDatabase()
  const [records, setRecords] = useState<MilkProduction[][]>([])
  const [isPending, setIsPending] = useState(true)

  let query = database.get<MilkProduction>(TableName.MILK_PRODUCTIONS).query(Q.sortBy('produced_at', Q.desc))

  if (betweenDates?.length) {
    query = query.extend(Q.where('produced_at', Q.between(betweenDates[0], betweenDates[1])))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = query
      .observe()
      .pipe(map(groupMilkProductions))
      .subscribe((data) => {
        InteractionManager.runAfterInteractions(() => {
          setRecords(data)
          setIsPending(false)
        })
      })

    return () => subscription.unsubscribe()
  }, [betweenDates])

  useEffect(() => {
    let subscription: Subscription | undefined
    ;(async () => {
      subscription = query
        .extend(await extendQueryWithTake(database, take))
        .observe()
        .pipe(map(groupMilkProductions))
        .subscribe((data) => {
          InteractionManager.runAfterInteractions(() => {
            setRecords(data)
          })
        })
    })()

    return () => subscription?.unsubscribe()
  }, [take])

  return { milkProductionsRecords: records, isPending }
}

import { TableName } from '@/database/constants'
import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { useDatabase } from '@nozbe/watermelondb/react'
import { map } from '@nozbe/watermelondb/utils/rx'
import { useEffect, useRef, useState } from 'react'
import { InteractionManager } from 'react-native'

const groupByYear = (data: MonthlyMilkProduction[]) => {
  return Object.entries(
    data.reduce<Record<number, (MonthlyMilkProduction | null)[]>>((acc, monthlyProduction) => {
      const year = monthlyProduction.year

      if (!acc[year]) {
        acc[year] = new Array<MonthlyMilkProduction | null>(12).fill(null)
      }
      acc[year][11 - monthlyProduction.month] = monthlyProduction

      return acc
    }, {})
  )
}

export const useMonthlyMilkProduction = () => {
  const db = useDatabase()
  const [records, setRecords] = useState<[string, (MonthlyMilkProduction | null)[]][]>([])
  const [isPending, setIsPending] = useState(true)
  const { current: query } = useRef(db.get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS).query())

  useEffect(() => {
    setIsPending(true)

    const subscription = query
      .observe()
      .pipe(map(groupByYear))
      .subscribe((data) => {
        InteractionManager.runAfterInteractions(() => {
          setRecords(data.toReversed())
        }).then(() => setIsPending(false))
      })

    return () => subscription.unsubscribe()
  }, [])

  return { monthlyMilkRecords: records, isPending }
}

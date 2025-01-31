import { MonthlyMilkProductionsCol as Column, TableName } from '@/database/constants'
import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { useDatabase } from '@nozbe/watermelondb/react'
import { map } from '@nozbe/watermelondb/utils/rx'
import { useEffect, useRef, useState } from 'react'

type MilkProductionSummary = {
  totalLiters: number
  avgProduction: number
}

const getProductionSummary = (data: MonthlyMilkProduction[]) => {
  const { totalLiters, years } = data.reduce<{ totalLiters: number; years: Set<number> }>(
    (acc, record) => {
      acc.totalLiters += record.liters
      acc.years.add(record.year)

      return acc
    },
    { totalLiters: 0, years: new Set<number>() }
  )

  return {
    totalLiters,
    avgProduction: years.size > 0 ? totalLiters / years.size : 0
  }
}

export const useMilkProductionSummary = () => {
  const db = useDatabase()
  const [productionSummary, setProductionSummary] = useState<MilkProductionSummary>({
    totalLiters: 0,
    avgProduction: 0
  })
  const { current: query } = useRef(db.get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS).query())

  useEffect(() => {
    const subscription = query
      .observeWithColumns([Column.LITERS])
      .pipe(map(getProductionSummary))
      .subscribe((data) => {
        setProductionSummary(data)
      })

    return () => subscription.unsubscribe()
  }, [])

  return productionSummary
}

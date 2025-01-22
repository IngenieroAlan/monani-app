import { MonthlyMilkProductionCol as Column, TableName } from '@/database/constants'
import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

export const useMonthlyMilkProduction = () => {
  const database = useDatabase()
  const [records, setRecords] = useState<MonthlyMilkProduction[]>([])
  const [isPending, setIsPending] = useState(true)

  const query = database.get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTION).query()

  useEffect(() => {
    setIsPending(true)

    const subscription = query.observeWithColumns([Column.LITERS]).subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(data)
      }).then(() => setIsPending(false))
    })

    return () => subscription.unsubscribe()
  }, [])

  return { monthlyMilkRecords: records, isPending }
}

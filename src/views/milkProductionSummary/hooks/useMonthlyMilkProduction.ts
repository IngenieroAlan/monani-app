import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { TableName } from '@/database/schema'
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

    const subscription = query.observeWithColumns(['liters']).subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(data)
      }).then(() => setIsPending(false))
    })

    return () => subscription.unsubscribe()
  }, [])

  return { monthlyMilkRecords: records, isPending }
}

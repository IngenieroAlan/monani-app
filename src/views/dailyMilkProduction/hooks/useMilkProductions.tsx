import MilkProduction from '@/database/models/MilkProduction'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type UseMilkProductionsProps = {
  take?: number
}

export type MilkProductionListItem = {
  liters: number
  totalProductions: number
  productionDate: string
}

const groupMilkProductions = (data: MilkProduction[]) => {
  return Object.values(
    data.reduce((acc: Record<string, MilkProductionListItem>, milkProduction) => {
      const date = format(milkProduction.producedAt, 'dd/MM/yy', { locale: es })

      if (!acc[date]) {
        acc[date] = {
          liters: 0,
          totalProductions: 0,
          productionDate: date
        }
      }

      acc[date].liters += milkProduction.liters
      acc[date].totalProductions++

      return acc
    }, {})
  )
}

export const useMilkProductions = ({ take }: UseMilkProductionsProps = {}) => {
  const database = useDatabase()
  const [records, setRecords] = useState<MilkProductionListItem[]>([])
  const [isPending, setIsPending] = useState(true)

  let query = database.get<MilkProduction>(TableName.MILK_PRODUCTIONS).query(Q.sortBy('produced_at', Q.desc))

  if (take) {
    query = query.extend(Q.take(take))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = query.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(groupMilkProductions(data))
        setIsPending(false)
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = query.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setRecords(groupMilkProductions(data))
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { milkProductionsRecords: records, isPending }
}

import MilkProduction from '@/database/models/MilkProduction'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCallback, useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

export type MilkProductionListItem = {
  liters: number
  totalProductions: number
  productionDate: string
}

type UseMilkProductionsProps = {
  take?: number
  betweenDates?: number[] | null
}

export const useMilkProductions = ({ take, betweenDates }: UseMilkProductionsProps = {}) => {
  const database = useDatabase()
  const [records, setRecords] = useState<MilkProductionListItem[]>([])
  const [isPending, setIsPending] = useState(true)

  let rawQuery = `SELECT * FROM ${TableName.MILK_PRODUCTIONS_VIEW}`
  let observableQuery = database.get<MilkProduction>(TableName.MILK_PRODUCTIONS).query()

  if (betweenDates?.length) {
    rawQuery = `${rawQuery} WHERE productionDate >= ${betweenDates[0]} AND productionDate <= ${betweenDates[1]}`
  }

  if (take) {
    rawQuery = `${rawQuery} LIMIT ${take}`
  }

  const fetchRecords = useCallback(async () => {
    const rawRecords = (await database
      .get(TableName.MILK_PRODUCTIONS)
      .query(Q.unsafeSqlQuery(rawQuery))
      .unsafeFetchRaw()) as { liters: number; totalProductions: number; productionDate: number }[]

    setRecords(
      rawRecords.map(({ productionDate, ...rest }) => ({
        ...rest,
        productionDate: format(productionDate, 'dd/MM/yy', { locale: es })
      }))
    )
  }, [rawQuery])

  useEffect(() => {
    setIsPending(true)

    const subscription = observableQuery.observeWithColumns(['liters']).subscribe(() => {
      InteractionManager.runAfterInteractions(async () => {
        await fetchRecords()

        setIsPending(false)
      })
    })

    return () => subscription.unsubscribe()
  }, [betweenDates])

  useEffect(() => {
    const subscription = observableQuery.observeWithColumns(['liters']).subscribe(() => {
      InteractionManager.runAfterInteractions(async () => {
        await fetchRecords()
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { milkProductionsRecords: records, isPending }
}

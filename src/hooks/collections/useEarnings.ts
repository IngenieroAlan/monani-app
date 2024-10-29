import CattleSale from '@/database/models/CattleSale'
import MilkSale from '@/database/models/MilkSale'
import { TableName } from '@/database/schema'
import { Model, Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { formatISO } from 'date-fns'
import merge from 'deepmerge'
import { useEffect, useState } from 'react'

export type EarningsRecord = {
  date: string
  cattleSales: CattleSale[]
  milkSales: MilkSale[]
}

type EarningsData = {
  [date: string]: {
    cattleSales: CattleSale[]
    milkSales: MilkSale[]
  }
}

const useEarnings = ({ take }: { take?: number }) => {
  const database = useDatabase()
  const [cattleSales, setCattleSales] = useState<CattleSale[]>([])
  const [milkSales, setMilkSales] = useState<MilkSale[]>([])
  const [earningsRecords, setEarningsRecords] = useState<EarningsRecord[]>()

  let cattleSalesQuery = database.collections
    .get<CattleSale>(TableName.CATTLE_SALES)
    .query(Q.sortBy('sold_at', Q.desc))

  let milkSalesQuery = database.collections
    .get<MilkSale>(TableName.MILK_SALES)
    .query(Q.sortBy('sold_at', Q.desc))

  if (take) {
    cattleSalesQuery = cattleSalesQuery.extend(Q.take(take))
    milkSalesQuery = milkSalesQuery.extend(Q.take(take))
  }

  const retrieveEarnings = <T extends MilkSale | CattleSale>(data: T[], key: 'cattleSales' | 'milkSales') => {
    const salesEarnings: EarningsData = {}

    for (const sale of data) {
      const date = formatISO(sale.soldAt)

      if (!salesEarnings[date]?.[key]) {
        salesEarnings[date] = { cattleSales: [], milkSales: [] }
      }

      salesEarnings[date][key].push(sale as any)
    }

    return salesEarnings
  }

  useEffect(() => {
    const cattleSalesSubscription = cattleSalesQuery.observeWithColumns(['sold_at']).subscribe((data) => {
      setCattleSales(data)
    })
    const milkSalesSubscription = milkSalesQuery.observeWithColumns(['sold_at']).subscribe((data) => {
      setMilkSales(data)
    })

    return () => {
      cattleSalesSubscription.unsubscribe()
      milkSalesSubscription.unsubscribe()
    }
  }, [database, take])

  useEffect(() => {
    const cattleEarnings = retrieveEarnings(cattleSales, 'cattleSales')
    const milkEarnings = retrieveEarnings(milkSales, 'milkSales')

    const earnings: EarningsData = merge(milkEarnings, cattleEarnings, {
      isMergeableObject: (value) => !(value instanceof Model)
    })

    setEarningsRecords(
      Object.entries(earnings).map(([date, sales]) => ({
        date,
        ...sales
      }))
    )
  }, [cattleSales, milkSales])

  return { earningsRecords }
}

export default useEarnings

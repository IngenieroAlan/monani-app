import CattleSale from '@/database/models/CattleSale'
import MilkSale from '@/database/models/MilkSale'
import { TableName } from '@/database/schema'
import { Model, Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { formatISO, set } from 'date-fns'
import merge from 'deepmerge'
import { useEffect, useState } from 'react'

export type SalesType = 'Lechera' | 'Ganado'

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

type UseEarningsProps = {
  take?: number
  salesType?: SalesType | null
  betweenDates?: number[] | null
  year?: number | null
}

const useEarnings = ({ take, salesType, betweenDates, year }: UseEarningsProps = {}) => {
  const database = useDatabase()
  const [cattleSales, setCattleSales] = useState<CattleSale[]>([])
  const [milkSales, setMilkSales] = useState<MilkSale[]>([])
  const [earningsRecords, setEarningsRecords] = useState<EarningsRecord[]>([])

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

  if (betweenDates?.length) {
    cattleSalesQuery = cattleSalesQuery.extend(
      Q.where('sold_at', Q.between(betweenDates[0], betweenDates[1]))
    )
    milkSalesQuery = milkSalesQuery.extend(
      Q.where('sold_at', Q.between(betweenDates[0], betweenDates[1]))
    )
  }

  if (year) {
    cattleSalesQuery = cattleSalesQuery.extend(
      Q.unsafeSqlExpr(`strftime('%Y', datetime(sold_at / 1000, 'unixepoch')) = '${year}'`)
    )
    milkSalesQuery = milkSalesQuery.extend(
      Q.unsafeSqlExpr(`strftime('%Y', datetime(sold_at / 1000, 'unixepoch')) = '${year}'`)
    )
  }

  const retrieveEarnings = <T extends MilkSale | CattleSale>(data: T[], key: 'cattleSales' | 'milkSales') => {
    const salesEarnings: EarningsData = {}

    for (const sale of data) {
      const date = set(sale.soldAt, { hours: 0, minutes: 0, seconds: 0 })
      const isoDate = formatISO(date)

      if (!salesEarnings[isoDate]?.[key]) {
        salesEarnings[isoDate] = { cattleSales: [], milkSales: [] }
      }

      salesEarnings[isoDate][key].push(sale as any)
    }

    return salesEarnings
  }

  useEffect(() => {
    const cattleSalesSubscription = cattleSalesQuery.observeWithColumns(['sold_at']).subscribe((data) => {
      setCattleSales(salesType === 'Ganado' || salesType === null ? data : [])
    })
    const milkSalesSubscription = milkSalesQuery.observeWithColumns(['sold_at']).subscribe((data) => {
      setMilkSales(salesType === 'Lechera' || salesType === null ? data : [])
    })

    return () => {
      cattleSalesSubscription.unsubscribe()
      milkSalesSubscription.unsubscribe()
    }
  }, [database, take, salesType, betweenDates, year])

  useEffect(() => {
    const cattleEarnings = retrieveEarnings(cattleSales, 'cattleSales')
    const milkEarnings = retrieveEarnings(milkSales, 'milkSales')

    const earnings: EarningsData = merge(cattleEarnings, milkEarnings, {
      isMergeableObject: (value) => !(value instanceof Model)
    })

    const sortedDates = Object.keys(earnings).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    })

    const sortedEarnings: EarningsData = {}
    for (const date of sortedDates) {
      sortedEarnings[date] = earnings[date]
    }

    setEarningsRecords(
      Object.entries(sortedEarnings).map(([date, sales]) => ({
        date,
        ...sales
      }))
    )
  }, [cattleSales, milkSales])

  return { earningsRecords }
}

export default useEarnings

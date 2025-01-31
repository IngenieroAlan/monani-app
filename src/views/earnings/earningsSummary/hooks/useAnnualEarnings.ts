import { AnnualEarningsCol as Column, TableName } from '@/database/constants'
import AnnualEarnings from '@/database/models/AnnualEarnings'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useAnnualEarnings = () => {
  const database = useDatabase()
  const [annualEarningsRecords, setAnnualEarningsRecords] = useState<AnnualEarnings[]>([])

  let annualEarningsQuery = database.collections
    .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
    .query(Q.sortBy(Column.YEAR, Q.desc))

  useEffect(() => {
    const subscription = annualEarningsQuery.observeWithColumns([Column.TOTAL_EARNINGS]).subscribe((data) => {
      setAnnualEarningsRecords(data)
    })

    return () => subscription.unsubscribe()
  }, [database])

  return { annualEarningsRecords }
}

export default useAnnualEarnings

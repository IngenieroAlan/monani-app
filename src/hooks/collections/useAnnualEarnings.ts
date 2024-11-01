import AnnualEarnings from '@/database/models/AnnualEarnings'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useAnnualEarnings = () => {
  const database = useDatabase()
  const [annualEarningsRecords, setAnnualEarningsRecords] = useState<AnnualEarnings[]>([])

  let annualEarningsQuery = database.collections
    .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
    .query(Q.sortBy('year', Q.desc))

  useEffect(() => {
    const subscription = annualEarningsQuery.observeWithColumns(['total_earnings']).subscribe((data) => {
      setAnnualEarningsRecords(data)
    })

    return () => subscription.unsubscribe()
  }, [database])

  return { annualEarningsRecords }
}

export default useAnnualEarnings

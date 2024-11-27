import Cattle from '@/database/models/Cattle'
import MilkReport from '@/database/models/MilkReport'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

type UseMilkReportProps = {
  take?: number
}

const useMilkReports = (cattle: Cattle, { take }: UseMilkReportProps = {}) => {
  const database = useDatabase()
  const [milkReports, setMilkReports] = useState<MilkReport[]>([])

  let milkReportsQuery = database
    .get<MilkReport>(TableName.MILK_REPORTS)
    .query(
      Q.where('cattle_id', cattle.id),
      Q.sortBy('reported_at', Q.desc)
    )
  
  if (take) milkReportsQuery = milkReportsQuery.extend(Q.take(take))

  useEffect(() => {
    const subscription = milkReportsQuery.observe().subscribe((data) => {
      setMilkReports(data)
    })

    return () => subscription.unsubscribe()
  }, [cattle, take])

  return { milkReports }
}

export default useMilkReports

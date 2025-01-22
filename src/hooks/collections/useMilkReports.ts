import { MilkReportsCol as Column, TableName } from '@/database/constants'
import Cattle from '@/database/models/Cattle'
import MilkReport from '@/database/models/MilkReport'
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
    .query(Q.where(Column.CATTLE_ID, cattle.id), Q.sortBy(Column.REPORTED_AT, Q.desc))

  if (take) milkReportsQuery = milkReportsQuery.extend(Q.take(take))

  useEffect(() => {
    const subscription = milkReportsQuery.observeWithColumns([Column.LITERS]).subscribe((data) => {
      setMilkReports(data)
    })

    return () => subscription.unsubscribe()
  }, [cattle, take])

  return { milkReports }
}

export default useMilkReports

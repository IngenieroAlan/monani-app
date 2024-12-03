import Cattle from '@/database/models/Cattle'
import WeightReport from '@/database/models/WeightReport'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useWeightReports = (cattle: Cattle) => {
  const database = useDatabase()
  const [weightReports, setWeightReports] = useState<WeightReport[]>([])

  useEffect(() => {
    const subscription = cattle.weightReports.observe().subscribe((data) => {
      setWeightReports(data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.weightReports])

  return { weightReports: weightReports }
}

export default useWeightReports

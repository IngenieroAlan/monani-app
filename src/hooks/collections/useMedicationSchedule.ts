import Cattle from '@/database/models/Cattle'
import MedicationSchedule from '@/database/models/MedicationSchedule'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useMedicationSchedules = (cattle: Cattle) => {
  const database = useDatabase()
  const [medicationSchedules, setMedicationSchedules] = useState<MedicationSchedule[]>()

  useEffect(() => {
    const subscription = cattle.medicationSchedules.observe().subscribe(async (data) => {
      setMedicationSchedules(await data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.medicationSchedules])

  return { medicationSchedules }
}

export default useMedicationSchedules

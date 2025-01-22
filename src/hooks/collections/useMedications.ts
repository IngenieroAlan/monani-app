import { MedicationsCol as Column, TableName } from '@/database/constants'
import Medication from '@/database/models/Medication'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type UseMedicationsProps = {
  take?: number
}

const useMedications = ({ take }: UseMedicationsProps = {}) => {
  const database = useDatabase()
  const [medicationsRecords, setMedicationsRecords] = useState<Medication[]>([])
  const [isPending, setIsPending] = useState(true)

  let medicationsQuery = database.get<Medication>(TableName.MEDICATIONS).query(Q.sortBy(Column.NAME, Q.asc))

  if (take) {
    medicationsQuery = medicationsQuery.extend(Q.take(take))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = medicationsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setMedicationsRecords(data)
      }).then(() => setIsPending(false))
      setMedicationsRecords(data)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = medicationsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setMedicationsRecords(data)
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { medicationsRecords, isPending }
}

export default useMedications

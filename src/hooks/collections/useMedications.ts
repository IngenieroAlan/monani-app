import Medication from '@/database/models/Medication'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useMedications = () => {
  const database = useDatabase()
  const [medications, setMedications] = useState<Medication[]>([])

  let medicationsQuery = database.collections
    .get<Medication>(TableName.MEDICATIONS)
    .query(
      Q.sortBy('name', Q.asc)
    )

  useEffect(() => {
    const subscription = medicationsQuery.observe().subscribe((data) => {
      setMedications(data)
    })

    return () => subscription.unsubscribe()
  }, [database])

  return { medications }
}

export default useMedications

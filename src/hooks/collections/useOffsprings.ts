import Cattle from '@/database/models/Cattle'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useOffsprings = (cattle: Cattle) => {
  const database = useDatabase()
  const [offsprings, setOffsprings] = useState<Cattle[]>([])

  useEffect(() => {
    const subscription = cattle.offsprings.observe().subscribe((data) => {
      setOffsprings(data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.offsprings])

  return { offsprings }
}

export default useOffsprings

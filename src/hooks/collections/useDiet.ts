import Cattle from '@/database/models/Cattle'
import Diet from '@/database/models/Diet'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useDiet = (cattle: Cattle) => {
  const database = useDatabase()
  const [diet, setDiet] = useState<Diet>()

  useEffect(() => {
    const subscription = cattle.diet.observe().subscribe(async (data) => {
      setDiet(await data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.diet])

  return { diet }
}

export default useDiet

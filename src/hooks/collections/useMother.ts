import Cattle from '@/database/models/Cattle'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useMother = (cattle: Cattle) => {
  const database = useDatabase()
  const [mother, setMother] = useState<Cattle>()

  useEffect(() => {
    const subscription = cattle.motherRelation.observe().subscribe(async (data) => {
      setMother(await data[0]?.mother)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.motherRelation])

  return { mother }
}

export default useMother

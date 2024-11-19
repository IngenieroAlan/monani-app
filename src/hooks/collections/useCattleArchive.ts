import Cattle from '@/database/models/Cattle'
import CattleArchive from '@/database/models/CattleArchive'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useCattleArchive = (cattle: Cattle | null) => {
  const database = useDatabase()
  const [cattleArchive, setCattleArchive] = useState<CattleArchive>()

  useEffect(() => {
    if (!cattle) return

    const subscription = cattle.archive.observe().subscribe((data) => {
      setCattleArchive(data[0])
    })

    return () => subscription.unsubscribe()
  }, [database, cattle?.archive])

  return { cattleArchive }
}

export default useCattleArchive

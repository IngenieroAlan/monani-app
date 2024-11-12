import Cattle from '@/database/models/Cattle'
import DietFeed from '@/database/models/DietFeed'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useDietFeeds = (cattle: Cattle) => {
  const database = useDatabase()
  const [dietFeeds, setDietFeeds] = useState<DietFeed[]>([])

  useEffect(() => {
    const subscription = cattle.dietFeeds.observe().subscribe((data) => {
      setDietFeeds(data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattle.dietFeeds])

  return { dietFeeds }
}

export default useDietFeeds
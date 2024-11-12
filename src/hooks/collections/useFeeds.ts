import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

const useFeeds = () => {
  const database = useDatabase()
  const [feeds, setFeeds] = useState<Feed[]>([])

  let feedsQuery = database.collections
    .get<Feed>(TableName.FEEDS)
    .query(
      Q.sortBy('name', Q.asc)
    )

  useEffect(() => {
    const subscription = feedsQuery.observe().subscribe((data) => {
      setFeeds(data)
    })

    return () => subscription.unsubscribe()
  }, [database])

  return { feeds }
}

export default useFeeds

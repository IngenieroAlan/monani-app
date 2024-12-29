import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type useFeedsProps = {
  take?: number
}

const useFeeds = ({ take }: useFeedsProps = {}) => {
  const database = useDatabase()
  const [feedsRecords, setFeedsRecords] = useState<Feed[]>([])
  const [isPending, setIsPending] = useState(true)

  let feedsQuery = database.collections.get<Feed>(TableName.FEEDS).query(Q.sortBy('name', Q.asc))

  useEffect(() => {
    setIsPending(true)

    const subscription = feedsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setFeedsRecords(data)
      }).then(() => setIsPending(false))
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = feedsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setFeedsRecords(data)
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { feedsRecords, isPending }
}

export default useFeeds

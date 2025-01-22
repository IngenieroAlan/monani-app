import { FeedsCol as Column, TableName } from '@/database/constants'
import Feed from '@/database/models/Feed'
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

  let feedsQuery = database.get<Feed>(TableName.FEEDS).query(Q.sortBy(Column.NAME, Q.asc))

  if (take) {
    feedsQuery = feedsQuery.extend(Q.take(take))
  }

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

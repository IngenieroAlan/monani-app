import SentNotification from '@/database/models/SentNotification'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

export const useNotificationsCount = () => {
  const database = useDatabase()
  const [notificationsCount, setNotificationsCount] = useState(0)

  let countQuery = database
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where('is_marked_as_read', false))

  useEffect(() => {
    const subscription = countQuery.observeCount().subscribe((count) => {
      setNotificationsCount(count)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { notificationsCount }
}

import { SentNotificationsCol as Column, TableName } from '@/database/constants'
import SentNotification from '@/database/models/SentNotification'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

export const useNotificationsCount = () => {
  const database = useDatabase()
  const [notificationsCount, setNotificationsCount] = useState(0)

  let countQuery = database
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where(Column.IS_MARKED_AS_READ, false))

  useEffect(() => {
    const subscription = countQuery.observeCount().subscribe((count) => {
      setNotificationsCount(count)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { notificationsCount }
}

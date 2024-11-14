import SentNotification from '@/database/models/Notification'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'

type UseNotificationsProps = {
  isMarkedAsRead?: boolean
  take?: number
}

const useNotifications = ({ take, isMarkedAsRead }: UseNotificationsProps = {}) => {
  const database = useDatabase()
  const [notifications, setNotifications] = useState<SentNotification[]>([])

  let notificationsQuery = database.collections
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.sortBy('event_at', Q.desc))

  if (isMarkedAsRead !== undefined) {
    notificationsQuery = notificationsQuery.extend(Q.where('is_marked_as_read', isMarkedAsRead))
  }

  if (take) {
    notificationsQuery = notificationsQuery.extend(Q.take(take))
  }

  useEffect(() => {
    const subscription = notificationsQuery.observe().subscribe((data) => {
      setNotifications(data)
    })

    return () => subscription.unsubscribe()
  }, [database, isMarkedAsRead, take])

  return { notifications }
}

export default useNotifications

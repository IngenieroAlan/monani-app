import { SentNotificationsCol as Column, TableName } from '@/database/constants'
import SentNotification from '@/database/models/SentNotification'
import { formatDateRelativeToYear } from '@/utils/helpers'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useEffect, useState } from 'react'
import { InteractionManager } from 'react-native'

type UseNotificationsProps = {
  isMarkedAsRead?: boolean
  take?: number
}

const groupNotificationsByDate = (notifications: SentNotification[]) => {
  const groupedNotifications: (string | SentNotification)[] = []

  notifications.forEach((notification) => {
    const date = formatDateRelativeToYear(notification.eventAt)

    if (!groupedNotifications.includes(date)) {
      groupedNotifications.push(date)
    }

    groupedNotifications.push(notification)
  })

  return groupedNotifications
}

const useSentNotifications = ({ take, isMarkedAsRead }: UseNotificationsProps = {}) => {
  const database = useDatabase()
  const [isPending, setIsPending] = useState(true)
  const [notificationsRecords, setNotificationsRecords] = useState<(string | SentNotification)[]>([])

  let notificationsQuery = database.collections
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.sortBy(Column.EVENT_AT, Q.desc))

  if (isMarkedAsRead !== undefined) {
    notificationsQuery = notificationsQuery.extend(Q.where(Column.IS_MARKED_AS_READ, isMarkedAsRead))
  }

  if (take) {
    notificationsQuery = notificationsQuery.extend(Q.take(take))
  }

  useEffect(() => {
    setIsPending(true)

    const subscription = notificationsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setNotificationsRecords(groupNotificationsByDate(data))
      }).then(() => setIsPending(false))
    })

    return () => subscription.unsubscribe()
  }, [isMarkedAsRead])

  useEffect(() => {
    const subscription = notificationsQuery.observe().subscribe((data) => {
      InteractionManager.runAfterInteractions(() => {
        setNotificationsRecords(groupNotificationsByDate(data))
      })
    })

    return () => subscription.unsubscribe()
  }, [take])

  return { notificationsRecords, isPending }
}

export default useSentNotifications

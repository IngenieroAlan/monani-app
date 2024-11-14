import SentNotification from '@/database/models/Notification'
import { useMemo } from 'react'
import { List } from 'react-native-paper'
import NotificationItem from './NotificationItem'

type DayNotifications = {
  date: string
  notifications: SentNotification[]
}

const NotificationsSection = ({ dayNotifications }: { dayNotifications: DayNotifications }) => {
  const notifications = useMemo(() => {
    return dayNotifications.notifications.map((Notification, index) => {
      return (
        <NotificationItem
          key={index}
          notification={Notification}
        />
      )
    })
  }, [dayNotifications.notifications])

  return (
    <List.Section>
      <List.Subheader style={{ fontWeight: 'bold' }}>{dayNotifications.date}</List.Subheader>
      {notifications}
    </List.Section>
  )
}

export default NotificationsSection

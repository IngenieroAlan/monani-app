import SentNotification from '@/database/models/SentNotification'
import { List } from 'react-native-paper'
import { NotificationsListItem } from './NotificationsListItem'

type NotificationsListSectionProps = {
  notificationsByDate: [string, SentNotification[]]
}

export const NotificationsListSection = ({ notificationsByDate }: NotificationsListSectionProps) => {
  return (
    <List.Section>
      <List.Subheader style={{ fontWeight: 'bold' }}>{notificationsByDate[0]}</List.Subheader>
      {notificationsByDate[1].map((notification, index) => {
        return (
          <NotificationsListItem
            key={index}
            notification={notification}
          />
        )
      })}
    </List.Section>
  )
}

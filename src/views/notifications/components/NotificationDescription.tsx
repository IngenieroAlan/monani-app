import SentNotification from '@/database/models/SentNotification'
import { Text } from 'react-native-paper'

const NotificationDescription = ({ notification }: { notification: SentNotification }) => {
  if (notification.type === 'quarantine') {
    return (
      <Text>
        La cuarentena de la vaca con{' '}
        <Text style={{ fontWeight: 'bold' }}>No. {notification.extraInfo?.[0]}</Text>{' '}
        termina hoy.
      </Text>
    )
  }

  if (notification.type === 'birth') {
    return (
      <Text>
        La vaca con <Text style={{ fontWeight: 'bold' }}>No. {notification.extraInfo?.[0]}</Text>{' '}
        tiene un parto programado para hoy.
      </Text>
    )
  }

  if (notification.type === 'medication') {
    return (
      <Text>
        Dosis de <Text style={{ fontWeight: 'bold' }}>{notification.extraInfo?.[0]}</Text>{' '}
        programada para la vaca con <Text style={{ fontWeight: 'bold' }}>No. {notification.extraInfo?.[1]}</Text>.
      </Text>
    )
  }
}

export default NotificationDescription

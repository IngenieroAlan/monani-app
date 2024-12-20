import { NotificationType } from '@/database/models/SentNotification'

type NotificationMap = { [key in NotificationType]: string }

export const NotificationTitle: NotificationMap = {
  birth: 'Día de parto',
  medication: 'Medicación programada',
  quarantine: 'Cuarentena terminada'
}

export const NotificationIcon: NotificationMap = {
  birth: 'baby-bottle-outline',
  medication: 'pill',
  quarantine: 'minus-circle-off-outline'
}

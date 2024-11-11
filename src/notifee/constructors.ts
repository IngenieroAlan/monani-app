import Cattle from '@/database/models/Cattle'
import notifee, { AndroidDefaults, Notification, TimestampTrigger, TriggerType } from '@notifee/react-native'
import { CattleNotificationEventType, NotificationData } from './types'

type NotificationProps = {
  id?: string
  title: string
  subtitle?: string
  body: string
  data: NotificationData
  triggerTimestamp: number
}

export const createTriggerNotification = async (notificationProps: NotificationProps) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: notificationProps.triggerTimestamp
  }

  const notification: Notification = {
    title: notificationProps.title,
    subtitle: notificationProps.subtitle,
    body: notificationProps.body,
    data: notificationProps.data,
    android: {
      defaults: [AndroidDefaults.SOUND],
      channelId: 'monani',
      showTimestamp: true,
      pressAction: { id: 'default' },
      actions: [
        {
          title: 'Marcar como leído',
          pressAction: { id: CattleNotificationEventType.MARK_AS_READ }
        }
      ]
    },
    ios: { categoryId: 'monani' }
  }

  if (notificationProps.id) notification['id'] = notificationProps.id

  await notifee.createTriggerNotification(notification, trigger)
}

export const createQuarantineNotification = async (
  cattle: Cattle | { id: string; name?: string; tagId: string },
  triggerTimestamp: number,
  id?: string
) => {
  const { id: cattleId, name, tagId } = cattle

  await createTriggerNotification({
    id,
    title: 'Cuarentena terminada',
    subtitle: name ?? `No. ${tagId}`,
    body: `La cuarentena de la vaca con <b>No. ${tagId}</b> termina hoy.`,
    data: {
      cattleId,
      type: 'quarantine',
      timestamp: triggerTimestamp,
      extraInfo: JSON.stringify([tagId])
    },
    triggerTimestamp
  })
}

export const createPregnancyNotification = async (
  cattle: Cattle | { id: string; name?: string; tagId: string },
  triggerTimestamp: number,
  id?: string
) => {
  const { id: cattleId, name, tagId } = cattle

  await createTriggerNotification({
    id,
    title: 'Día de parto',
    subtitle: name ?? `No. ${tagId}`,
    body: `La vaca con <b>No. ${tagId}</b> tiene un parto programado para hoy.`,
    data: {
      cattleId,
      type: 'birth',
      timestamp: triggerTimestamp,
      extraInfo: JSON.stringify([tagId])
    },
    triggerTimestamp
  })
}

export const createMedicationNotification = async (
  cattle: Cattle | { id: string; name?: string; tagId: string },
  medicationName: string,
  foreignId: string,
  monthInterval: number,
  triggerTimestamp: number,
  id?: string
) => {
  const { id: cattleId, name, tagId } = cattle

  await createTriggerNotification({
    id,
    title: 'Medicación programada',
    subtitle: name ?? `No. ${tagId}`,
    body: `Dosis de <b>${medicationName}</b> programada para la vaca con <b>No. ${tagId}</b>.`,
    data: {
      cattleId,
      type: 'medication',
      timestamp: triggerTimestamp,
      extraInfo: JSON.stringify([medicationName, tagId]),
      monthInterval: monthInterval,
      foreignId
    },
    triggerTimestamp
  })
}

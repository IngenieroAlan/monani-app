import database from '@/database'
import PendingNotification from '@/database/models/PendingNotification'
import { TableName } from '@/database/schema'
import { Notification } from '@notifee/react-native'
import { NotificationData } from '../types'

export const onTriggerNotificationCreatedHandler = async (notification: Notification) => {
  // Idk how this could happen, but just in case.
  if (!notification.id) {
    throw new Error("onTriggerNotificationCreatedHandler: Can't create a notification without ID.")
  }

  const pendingNotification = await database
    .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
    .find(notification.id)

  if (pendingNotification) return

  const data = notification.data as NotificationData

  await database.write(async () => {
    await database
      .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
      .create((record) => {
        record._raw.id = notification.id!
        record.cattle.id = data.cattleId
        record.type = data.type
        record.foreignId = data.foreignId
      })
  })
}

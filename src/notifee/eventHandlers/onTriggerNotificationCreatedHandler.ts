import database from '@/database'
import { TableName } from '@/database/constants'
import PendingNotification from '@/database/models/PendingNotification'
import { Notification } from '@notifee/react-native'
import { Q } from '@nozbe/watermelondb'
import { NotificationData } from '../types'

export const onTriggerNotificationCreatedHandler = async (notification: Notification) => {
  // Idk how this could happen, but just in case.
  if (!notification.id) {
    throw new Error("onTriggerNotificationCreatedHandler: Can't create a notification without ID.")
  }

  const pendingNotification = await database
    .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
    .query(Q.where('id', notification.id))
    .fetch()

  if (pendingNotification.length > 0) return

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

import database from '@/database'
import SentNotification, { NotificationType } from '@/database/models/SentNotification'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'

type NotificationData = {
  notifeeId: string
  eventAt: Date
  cattleId: string
  type: NotificationType
  isMarkedAsRead: boolean
  extraInfo?: string[]
}

export const createNotification = async (data: NotificationData) => {
  const notification = await database.write(async () => {
    return await database.collections
      .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
      .create((record) => {
        record.notifeeId = data.notifeeId
        record.eventAt = data.eventAt
        record.cattle.id = data.cattleId
        record.type = data.type
        record.isMarkedAsRead = data.isMarkedAsRead
        record.extraInfo = data.extraInfo
      })
  })

  return notification
}

export const markAllAsRead = async () => {
  const notifications = await database.collections
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where('is_marked_as_read', false))
    .fetch()

  await database.write(async () => {
    await database.batch(
      notifications.map((notification) => {
        return notification.prepareUpdate((record) => record.isMarkedAsRead = true)
      })
    )
  })
}

export const deleteAllNotifications = async () => {
  await database.write(async () => {
    await database.collections
      .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
      .query()
      .destroyAllPermanently()
  })
}

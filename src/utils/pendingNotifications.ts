import database from '@/database'
import PendingNotification from '@/database/models/PendingNotification'
import { TableName } from '@/database/schema'
import { NotificationData } from '@/notifee/types'

export const createPendingNotification = async (data: NotificationData, notifeeId: string) => {
  await database.write(async () => {
    await database.collections
      .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
      .create((record) => {
        record._raw.id = notifeeId
        record.cattle.id = data.cattleId
        record.type = data.type
        record.foreignId = data.foreignId
      })
  })
}

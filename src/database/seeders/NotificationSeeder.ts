import database from '..'
import NotificationFactory from '../factories/NotificationFactory'
import Notification from '../models/Notification'
import { TableName } from '../schema'

const notifications = Array.from({ length: 10 }, () => NotificationFactory())

const NotificationSeeder = async () => {
  await database.write(async () => {
    await database.batch(
      notifications.map((notification) => {
        return database.get<Notification>(TableName.NOTIFICATIONS).prepareCreateFromDirtyRaw(notification)
      })
    )
  })

  console.log(`Notifications table seeded with ${notifications.length} records.`)
}

export default NotificationSeeder

import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import NotificationFactory from '../factories/NotificationFactory'
import Cattle from '../models/Cattle'
import Medication from '../models/Medication'
import SentNotification from '../models/SentNotification'
import { TableName } from '../schema'

const NotificationSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const medications = await database.get<Medication>(TableName.MEDICATIONS).query().fetch()
  const notificationsRecords: DirtyRaw[] = []

  for (const cow of cattle) {
    notificationsRecords.push(NotificationFactory(cow, faker.helpers.arrayElement(medications)))
  }

  await database.write(async () => {
    await database.batch(
      notificationsRecords.map((notification) => {
        return database
          .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
          .prepareCreateFromDirtyRaw(notification)
      })
    )
  })

  console.log(`Sent notifications table seeded with ${notificationsRecords.length} records.`)
}

export default NotificationSeeder

import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import SentNotificationFactory from '../factories/SentNotificationFactory'
import Cattle from '../models/Cattle'
import Medication from '../models/Medication'
import SentNotification from '../models/SentNotification'
import { TableName } from '../constants'

const SentNotificationSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const medications = await database.get<Medication>(TableName.MEDICATIONS).query().fetch()
  const notificationsRecords: DirtyRaw[] = []

  for (const cow of cattle) {
    notificationsRecords.push(SentNotificationFactory(cow, faker.helpers.arrayElement(medications)))
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

export default SentNotificationSeeder

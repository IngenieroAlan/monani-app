import { createPregnancyNotification, createQuarantineNotification } from '@/notifee/constructors'
import { addDays } from 'date-fns'
import database from '..'
import CattleFactory from '../factories/CattleFactory'
import DietFactory from '../factories/DietFactory'
import Cattle from '../models/Cattle'
import Diet from '../models/Diet'
import { TableName } from '../constants'

const NUM_OF_RECORDS = 40

const setQuarantineNotification = async (cattle: Cattle) => {
  if (!cattle.quarantineEndsAt) return

  await createQuarantineNotification(cattle, cattle.quarantineEndsAt.getTime())
}

const setPregnancyNotification = async (cattle: Cattle) => {
  if (!cattle.pregnantAt) return

  const triggerTimestamp = addDays(cattle.pregnantAt, 283).getTime()
  await createPregnancyNotification(cattle, triggerTimestamp)
}

const DietCattleSeeder = async () => {
  const cattleRecords = CattleFactory(NUM_OF_RECORDS)

  for (const cattleRecord of cattleRecords) {
    const dirtyRawDiet = DietFactory(cattleRecord.weight)
    const diet = database.get<Diet>(TableName.DIETS).prepareCreateFromDirtyRaw(dirtyRawDiet)

    cattleRecord.diet_id = diet.id

    const cattle = database.get<Cattle>(TableName.CATTLE).prepareCreateFromDirtyRaw(cattleRecord)

    setQuarantineNotification(cattle)
    setPregnancyNotification(cattle)


    await database.write(async () => {
      await database.batch(diet, cattle)
    })
  }

  console.log(`Diet table seeded with ${NUM_OF_RECORDS} records.`)
  console.log(`Cattle table seeded with ${NUM_OF_RECORDS} records.`)
}

export default DietCattleSeeder

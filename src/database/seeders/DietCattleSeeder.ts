import database from '..'
import CattleFactory from '../factories/CattleFactory'
import DietFactory from '../factories/DietFactory'
import Cattle from '../models/Cattle'
import Diet from '../models/Diet'
import { TableName } from '../schema'

const NUM_OF_RECORDS = 40

const DietCattleSeeder = async () => {
  const cattleRecords = CattleFactory(NUM_OF_RECORDS)

  for (const cattleRecord of cattleRecords) {
    const dirtyRawDiet = DietFactory(cattleRecord.weight)
    const diet = database.get<Diet>(TableName.DIETS).prepareCreateFromDirtyRaw(dirtyRawDiet)

    cattleRecord.diet_id = diet.id

    const cattle = database.get<Cattle>(TableName.CATTLE).prepareCreateFromDirtyRaw(cattleRecord)

    await database.write(async () => {
      await database.batch(diet, cattle)
    })
  }

  console.log(`Diet table seeded with ${NUM_OF_RECORDS} records.`)
  console.log(`Cattle table seeded with ${NUM_OF_RECORDS} records.`)
}

export default DietCattleSeeder

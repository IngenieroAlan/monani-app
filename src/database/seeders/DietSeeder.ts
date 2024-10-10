import database from '..'
import DietFactory from '../factories/DietFactory'
import Cattle from '../models/Cattle'
import Diet from '../models/Diet'
import { TableName } from '../schema'

const DietSeeder = async (cattleRecords: Cattle[]) => {
  for (const cattleRecord of cattleRecords) {
    const dirtyRawDiet = DietFactory(cattleRecord.weight)
    const diet = database.get<Diet>(TableName.DIETS).prepareCreateFromDirtyRaw(dirtyRawDiet)

    await database.write(async () => {
      await database.batch(diet)
    })

    console.log(diet)
  }
  // await database.write(async () => {
  //   await database.batch(
  //     dietRecords.map((diet) => {
  //       return database.get<Diet>(TableName.DIETS).prepareCreateFromDirtyRaw(diet)
  //     })
  //   )
  // })

  // console.log(`Diet table seeded with ${NUM_OF_RECORDS} records.`)
}

export default DietSeeder

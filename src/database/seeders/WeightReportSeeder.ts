import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import WeightReportFactory from '../factories/WeightReportFactory'
import Cattle from '../models/Cattle'
import WeightReport from '../models/WeightReport'
import { TableName } from '../constants'

const MIN_NUM_OF_RECORDS = 10
const MAX_NUM_OF_RECORDS = 20

const WeightReportSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const weightReportRecords: DirtyRaw[] = []

  for (const cow of cattle) {
    const numOfRecords = faker.number.int({ min: MIN_NUM_OF_RECORDS, max: MAX_NUM_OF_RECORDS })

    weightReportRecords.push(...WeightReportFactory(cow, numOfRecords))
  }

  await database.write(async () => {
    await database.batch(
      weightReportRecords.map((weightReport) => {
        return database.get<WeightReport>(TableName.WEIGHT_REPORTS).prepareCreateFromDirtyRaw(weightReport)
      })
    )
  })

  console.log(`Weight reports table seeded with ${weightReportRecords.length} records.`)
}

export default WeightReportSeeder

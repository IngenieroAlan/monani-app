import { DirtyRaw, Q } from '@nozbe/watermelondb'
import database from '..'
import CattleArchiveFactory from '../factories/CattleArchiveFactory'
import Cattle from '../models/Cattle'
import CattleArchive from '../models/CattleArchive'
import { TableName } from '../constants'

const NUM_OF_RECORDS = 5

const CattleArchiveSeeder = async () => {
  const cattle = await database
    .get<Cattle>(TableName.CATTLE)
    .query(
      Q.where('is_active', true),
      Q.take(NUM_OF_RECORDS))
    .fetch()

  const cattleArchiveRecords: DirtyRaw[] = []

  for (const cow of cattle) {
    cattleArchiveRecords.push(CattleArchiveFactory(cow.id))
  }

  await database.write(async () => {
    await database.batch(
      ...cattle.map((cattle) => {
        return cattle.prepareUpdate((_cattle) => {
          _cattle.isActive = false
          _cattle.isArchived = true
        })
      }),
      ...cattleArchiveRecords.map((cattleArchive) => {
        return database.get<CattleArchive>(TableName.CATTLE_ARCHIVES).prepareCreateFromDirtyRaw(cattleArchive)
      })
    )
  })

  console.log(`Cattle archives table seeded with ${NUM_OF_RECORDS} records.`)
}

export default CattleArchiveSeeder

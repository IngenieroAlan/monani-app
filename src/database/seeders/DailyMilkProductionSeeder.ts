import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import { TableName } from '../constants'
import DailyMilkProduction from '../models/DailyMilkProduction'

const DailyMilkProductionsSeeder = async (milkProductionRecords: DirtyRaw[]) => {
  const dailyMilkProductions = Object.values(
    milkProductionRecords.reduce<Record<string, { liters: number; total_productions: number; produced_at: number }>>(
      (acc, record) => {
        if (!acc[record.produced_at]) {
          acc[record.produced_at] = {
            liters: 0,
            produced_at: record.produced_at,
            total_productions: 0
          }
        }
        acc[record.produced_at].liters += record.liters
        acc[record.produced_at].total_productions++

        return acc
      },
      {}
    )
  )

  await database.write(async () => {
    await database.batch(
      dailyMilkProductions.map((record) =>
        database.get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS).prepareCreateFromDirtyRaw(record)
      )
    )

    console.log(`Daily milk productions table seeded with ${dailyMilkProductions.length} records.`)
  })
}

export default DailyMilkProductionsSeeder

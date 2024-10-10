import { DirtyRaw, Q } from '@nozbe/watermelondb'
import database from '..'
import Cattle from '../models/Cattle'
import MilkProduction from '../models/MilkProduction'
import MilkReport from '../models/MilkReport'
import { TableName } from '../schema'

const MilkReportSeeder = async (litersPerProduction: number[][]) => {
  const milkReportRecords: DirtyRaw[] = []
  const cattleIds = await database
    .get<Cattle>(TableName.CATTLE)
    .query(
      Q.where('production_type', 'Lechera'),
      Q.where('is_active', true),
      Q.where('quarantine_days_left', null)
    )
    .fetchIds()
  const milkProductions = await database.get<MilkProduction>(TableName.MILK_PRODUCTIONS).query().fetch()
  
  for (let i = 0; i < milkProductions.length; i++) {
    const productionLiters = litersPerProduction[i]

    for (let j = 0; j < cattleIds.length; j++) {
      milkReportRecords.push({
        cattle_id: cattleIds[j],
        milk_production_id: milkProductions[i].id,
        liters: productionLiters[j],
        reported_at: milkProductions[i].producedAt.getTime()
      })
    }
  }

  await database.write(async () => {
    await database.batch(
      milkReportRecords.map(milkReport => {
        return database.get<MilkReport>(TableName.MILK_REPORTS).prepareCreateFromDirtyRaw(milkReport)
      })
    )
  })

  console.log(`Milk reports table seeded with ${milkReportRecords.length} records.`)
}

export default MilkReportSeeder

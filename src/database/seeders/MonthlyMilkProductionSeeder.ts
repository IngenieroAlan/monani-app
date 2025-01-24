import { DirtyRaw } from '@nozbe/watermelondb'
import { getMonth, getYear } from 'date-fns'
import database from '..'
import { TableName } from '../constants'
import MilkProductionSummary from '../models/MilkProductionSummary'
import MonthlyMilkProduction from '../models/MonthlyMilkProduction'

const MonthlyMilkProductionSeeeder = async (milkProductionRecords: DirtyRaw[]) => {
  let totalProduction = 0
  const monthlyMilkProductionRecords: { year: number; month: number; liters: number }[] = []

  for (const milkProductionRecord of milkProductionRecords) {
    totalProduction += milkProductionRecord.liters

    const year = getYear(milkProductionRecord.produced_at)
    const month = getMonth(milkProductionRecord.produced_at)
    const milkProductionMonth = monthlyMilkProductionRecords.find((item) => item.year === year && item.month === month)

    if (milkProductionMonth) {
      milkProductionMonth.liters = +(milkProductionMonth.liters + milkProductionRecord.liters).toFixed(3)
    } else {
      monthlyMilkProductionRecords.push({
        year: year,
        month: month,
        liters: +milkProductionRecord.liters.toFixed(3)
      })
    }
  }

  const milkProductionSummary = (
    await database.get<MilkProductionSummary>(TableName.MILK_PRODUCTION_SUMMARY).query().fetch()
  )[0]

  await database.write(async () => {
    await database.batch(
      milkProductionSummary.prepareUpdate((_milkProductionSummary) => {
        _milkProductionSummary.totalProduction = +(_milkProductionSummary.totalProduction + totalProduction).toFixed(3)
      }),
      ...monthlyMilkProductionRecords.map((monthlyMilkProduction) => {
        return database
          .get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS)
          .prepareCreateFromDirtyRaw(monthlyMilkProduction)
      })
    )
  })

  console.log(`Monthly milk productions table seeded with ${monthlyMilkProductionRecords.length} records.`)
}

export default MonthlyMilkProductionSeeeder

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
// import migrations from './model/migrations'

import AnnualEarnings from './model/AnnualEarnings'
import Cattle from './model/Cattle'
import CattleArchive from './model/CattleArchive'
import CattleSale from './model/CattleSale'
import Diet from './model/Diet'
import DietFeed from './model/DietFeed'
import EarningsSummary from './model/EarningsSummary'
import Feed from './model/Feed'
import Genealogy from './model/Genealogy'
import Medication from './model/Medication'
import MedicationSchedule from './model/MedicationSchedule'
import MilkProduction from './model/MilkProduction'
import MilkProductionSummary from './model/MilkProductionSummary'
import MilkReport from './model/MilkReport'
import MilkSale from './model/MilkSale'
import MonthlyMilkProduction from './model/MonthlyMilkProduction'
import Notification from './model/Notification'
import WeightReport from './model/WeightReport'
import schema, { TableName } from './schema'

const adapter = new SQLiteAdapter({
  schema,
  // migrations,
  dbName: 'monani',
  jsi: false,

  onSetUpError: (error) => {
    console.log(error)
  }
})

const database = new Database({
  adapter,
  modelClasses: [
    Feed,
    Diet,
    DietFeed,
    Cattle,
    CattleArchive,
    Genealogy,
    Medication,
    MedicationSchedule,
    WeightReport,
    MilkProduction,
    MilkReport,
    CattleSale,
    MilkSale,
    MilkProductionSummary,
    MonthlyMilkProduction,
    EarningsSummary,
    AnnualEarnings,
    Notification
  ]
})

export const resetDatabase = async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase()
  })
}

export const initializeDatabase = async () => {
  const milkProductionSummaryExists = await database
    .get<MilkProductionSummary>(TableName.MILK_PRODUCTION_SUMMARY)
    .query()
    .fetchCount()
  const earningsSummaryExists = await database
    .get<EarningsSummary>(TableName.EARNINGS_SUMMARY)
    .query()
    .fetchCount()

  if (!milkProductionSummaryExists) {
    await database.write(async () => {
      await database
        .get<MilkProductionSummary>(TableName.MILK_PRODUCTION_SUMMARY)
        .create(milkProductionSummary => {
          milkProductionSummary.totalProduction = 0
        })
    })
  }

  if (!earningsSummaryExists) {
    await database.write(async () => {
      await database
        .get<EarningsSummary>(TableName.EARNINGS_SUMMARY)
        .create(earningsSummary => {
          earningsSummary.totalEarnings = 0
          earningsSummary.totalCattleSales = 0
          earningsSummary.totalMilkSales = 0
        })
    })
  }
}

export default database

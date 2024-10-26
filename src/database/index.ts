import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { randomUUID } from 'expo-crypto'
// import migrations from './model/migrations'

import AnnualEarnings from './models/AnnualEarnings'
import Cattle from './models/Cattle'
import CattleArchive from './models/CattleArchive'
import CattleSale from './models/CattleSale'
import Diet from './models/Diet'
import DietFeed from './models/DietFeed'
import EarningsSummary from './models/EarningsSummary'
import Feed from './models/Feed'
import Genealogy from './models/Genealogy'
import Medication from './models/Medication'
import MedicationSchedule from './models/MedicationSchedule'
import MilkProduction from './models/MilkProduction'
import MilkProductionSummary from './models/MilkProductionSummary'
import MilkReport from './models/MilkReport'
import MilkSale from './models/MilkSale'
import MonthlyMilkProduction from './models/MonthlyMilkProduction'
import Notification from './models/Notification'
import WeightReport from './models/WeightReport'
import schema, { TableName } from './schema'
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId'

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

// setGenerator(() => randomUUID())

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

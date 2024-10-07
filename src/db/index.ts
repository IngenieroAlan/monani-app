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
import schema from './schema'

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

export default database

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
// import migrations from './model/migrations'

import schema from './schema'
import ArchivedCattle from './model/ArchivedCattle'
import Cattle from './model/Cattle'
import CattleSale from './model/CattleSale'
import Diet from './model/Diet'
import DietFeed from './model/DietFeed'
import Feed from './model/Feed'
import Genealogy from './model/Genealogy'
import Medication from './model/Medication'
import MedicationSchedule from './model/MedicationSchedule'
import MilkProduction from './model/MilkProduction'
import MilkReport from './model/MilkReport'
import MilkSale from './model/MilkSale'
import Notification from './model/Notification'
import WeightReport from './model/WeightReport'

const adapter = new SQLiteAdapter({
  schema,
  // migrations,
  dbName: 'monani',
  jsi: true,

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
    ArchivedCattle,
    Genealogy,
    Medication,
    MedicationSchedule,
    WeightReport,
    MilkProduction,
    MilkReport,
    CattleSale,
    MilkSale,
    Notification
  ]
})

export default database

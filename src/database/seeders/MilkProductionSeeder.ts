import { faker } from '@faker-js/faker'
import { DirtyRaw, Q } from '@nozbe/watermelondb'
import { eachDayOfInterval, subMonths } from 'date-fns'
import database from '..'
import { TableName } from '../constants'
import Cattle from '../models/Cattle'
import MilkProduction from '../models/MilkProduction'
import DailyMilkProductionsSeeder from './DailyMilkProductionSeeder'
import MilkReportSeeder from './MilkReportSeeder'
import MonthlyMilkProductionSeeeder from './MonthlyMilkProductionSeeder'

const MIN_LITERS_PER_COW = 6
const MAX_LITERS_PER_COW = 12

const getNumOfCattle = async () => {
  return await database
    .get<Cattle>(TableName.CATTLE)
    .query(
      Q.where('production_type', 'Lechera'),
      Q.where('is_active', true),
      Q.where('quarantine_ends_at', null)
    )
    .fetchCount()
}

const getProductionDates = () => {
  return eachDayOfInterval({
    start: subMonths(new Date(), 6),
    end: new Date()
  })
}

const getLitersPerCow = (numOfCattle: number) => {
  const litersPerCow: number[] = []

  for (let i = 0; i < numOfCattle; i++) {
    litersPerCow.push(
      +faker.number
        .float({ min: MIN_LITERS_PER_COW, max: MAX_LITERS_PER_COW, fractionDigits: 3 })
    )
  }

  return litersPerCow
}

const MilkProductionSeeder = async () => {
  const litersPerProduction: number[][] = []
  const numOfCattle = await getNumOfCattle()
  const productionDates = getProductionDates()
  const milkProductionRecords: DirtyRaw[] = []

  for (const productionDate of productionDates) {
    const productions = faker.helpers.weightedArrayElement([
      { weight: 45, value: 1 },
      { weight: 50, value: 2 },
      { weight: 5, value: 3 }
    ])

    for (let i = 0; i < productions; i++) {
      const litersPerCow = getLitersPerCow(numOfCattle)
      const isSold = i + 1 === productions
        ? faker.datatype.boolean()
        : i + 1 !== productions

      litersPerProduction.push(litersPerCow)

      milkProductionRecords.push({
        liters: +litersPerCow.reduce((acc, current) => acc + current, 0).toFixed(3),
        production_number: i + 1,
        is_sold: isSold,
        produced_at: productionDate.getTime()
      })
    }
  }

  await database.write(async () => {
    await database.batch(
      milkProductionRecords.map((milkProduction) => {
        return database.get<MilkProduction>(TableName.MILK_PRODUCTIONS).prepareCreateFromDirtyRaw(milkProduction)
      })
    )
  })

  console.log(`Milk productions table seeded with ${milkProductionRecords.length} records.`)

  await MilkReportSeeder(litersPerProduction)
  await DailyMilkProductionsSeeder(milkProductionRecords)
  await MonthlyMilkProductionSeeeder(milkProductionRecords)
}

export default MilkProductionSeeder

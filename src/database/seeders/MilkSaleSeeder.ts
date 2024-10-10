import { DirtyRaw, Model, Q } from '@nozbe/watermelondb'
import { getYear } from 'date-fns'
import database from '..'
import MilkSaleFactory from '../factories/MilkSaleFactory'
import AnnualEarnings from '../models/AnnualEarnings'
import EarningsSummary from '../models/EarningsSummary'
import MilkProduction from '../models/MilkProduction'
import MilkSale from '../models/MilkSale'
import { TableName } from '../schema'

const prepareAnnualEarningsUpdate = async (annualEarningsRecords: { [year: number]: number }) => {
  const updates: Model[] = []

  for (const year in annualEarningsRecords) {
    const annualEarnings = await database
      .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
      .query(Q.where('year', +year))
      .fetch()

    if (annualEarnings.length > 0) {
      updates.push(
        annualEarnings[0].prepareUpdate((annualEarnings) => {
          annualEarnings.totalEarnings += +annualEarningsRecords[year].toFixed(2)
          annualEarnings.totalMilkSales += +annualEarningsRecords[year].toFixed(2)
        })
      )

      continue
    }

    updates.push(
      database.get<AnnualEarnings>(TableName.ANNUAL_EARNINGS).prepareCreate((annualEarnings) => {
        annualEarnings.year = +year
        annualEarnings.totalEarnings += +annualEarningsRecords[year].toFixed(2)
        annualEarnings.totalMilkSales += +annualEarningsRecords[year].toFixed(2)
      })
    )
  }

  return updates
}

const MilkSaleSeeder = async () => {
  const milkSaleRecords: DirtyRaw[] = []
  let totalMilkSales = 0
  const annualEarningsRecords: { [year: number]: number } = []
  let milkProductions = await database
    .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
    .query(Q.where('is_sold', false))
    .fetch()

  milkProductions = milkProductions.slice(0, Math.floor(milkProductions.length / 2))

  for (const milkProduction of milkProductions) {
    const milkSaleRecord = MilkSaleFactory(milkProduction.id, milkProduction.liters)

    milkSaleRecords.push(milkSaleRecord)
    totalMilkSales += milkSaleRecord.sold_by

    const saleYear = getYear(new Date(milkSaleRecord.sold_at))

    annualEarningsRecords[saleYear]
      ? (annualEarningsRecords[saleYear] += milkSaleRecord.sold_by)
      : (annualEarningsRecords[saleYear] = milkSaleRecord.sold_by)
  }

  const earningsSummary = (await database.get<EarningsSummary>(TableName.EARNINGS_SUMMARY).query().fetch())[0]
  const annualEarningsUpdates = await prepareAnnualEarningsUpdate(annualEarningsRecords)

  await database.write(async () => {
    await database.batch(
      ...milkProductions.map((milkProduction) => {
        return milkProduction.prepareUpdate((_milkProduction) => {
          _milkProduction.isSold = true
        })
      }),
      ...milkSaleRecords.map((milkSale) => {
        return database.get<MilkSale>(TableName.MILK_SALES).prepareCreateFromDirtyRaw(milkSale)
      }),
      earningsSummary.prepareUpdate((earningsSummary) => {
        earningsSummary.totalEarnings += +totalMilkSales.toFixed(2)
        earningsSummary.totalMilkSales += +totalMilkSales.toFixed(2)
      }),
      ...annualEarningsUpdates
    )
  })

  console.log(`Milk sales table seeded with ${milkProductions.length} records.`)
}

export default MilkSaleSeeder

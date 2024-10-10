import { DirtyRaw, Model, Q } from '@nozbe/watermelondb'
import { getYear } from 'date-fns'
import database from '..'
import CattleSaleFactory from '../factories/CattleSaleFactory'
import AnnualEarnings from '../models/AnnualEarnings'
import Cattle from '../models/Cattle'
import CattleSale from '../models/CattleSale'
import EarningsSummary from '../models/EarningsSummary'
import { TableName } from '../schema'

const NUM_OF_RECORDS = 10

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
          annualEarnings.totalCattleSales += +annualEarningsRecords[year].toFixed(2)
        })
      )

      continue
    }

    updates.push(
      database.get<AnnualEarnings>(TableName.ANNUAL_EARNINGS).prepareCreate((annualEarnings) => {
        annualEarnings.year = +year
        annualEarnings.totalEarnings += +annualEarningsRecords[year].toFixed(2)
        annualEarnings.totalCattleSales += +annualEarningsRecords[year].toFixed(2)
      })
    )
  }

  return updates
}

const CattleSaleSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query(Q.take(NUM_OF_RECORDS)).fetch()

  const cattleSaleRecords: DirtyRaw[] = []
  let totalCattleSales = 0
  const annualEarningsRecords: { [year: number]: number } = {}

  for (let i = 0; i < NUM_OF_RECORDS; i++) {
    cattleSaleRecords.push(CattleSaleFactory(cattle[i].id, cattle[i].weight))

    totalCattleSales += cattleSaleRecords[i].sold_by

    const saleYear = getYear(new Date(cattleSaleRecords[i].sold_at))

    annualEarningsRecords[saleYear]
      ? (annualEarningsRecords[saleYear] += cattleSaleRecords[i].sold_by)
      : (annualEarningsRecords[saleYear] = cattleSaleRecords[i].sold_by)
  }

  const earningsSummary = (await database.get<EarningsSummary>(TableName.EARNINGS_SUMMARY).query().fetch())[0]
  const annualEarningsUpdates = await prepareAnnualEarningsUpdate(annualEarningsRecords)

  await database.write(async () => {
    await database.batch(
      ...cattle.map((cattle) => {
        return cattle.prepareUpdate((_cattle) => {
          _cattle.isActive = false
          _cattle.isSold = true
        })
      }),
      ...cattleSaleRecords.map((cattleSale) => {
        return database.get<CattleSale>(TableName.CATTLE_SALES).prepareCreateFromDirtyRaw(cattleSale)
      }),
      earningsSummary.prepareUpdate((earningsSummary) => {
        earningsSummary.totalEarnings += +totalCattleSales.toFixed(2)
        earningsSummary.totalCattleSales += +totalCattleSales.toFixed(2)
      }),
      ...annualEarningsUpdates
    )
  })

  console.log(`Cattle sales table seeded with ${NUM_OF_RECORDS} records.`)
}

export default CattleSaleSeeder

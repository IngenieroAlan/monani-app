import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, nochange, readonly, writer } from '@nozbe/watermelondb/decorators'
import dayjs from 'dayjs'
import { MilkReportsCol as Column, MilkProductionsCol, TableName } from '../constants'
import Cattle from './Cattle'
import MilkProduction from './MilkProduction'

class MilkReport extends Model {
  static table = TableName.MILK_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: Column.CATTLE_ID },
    [TableName.MILK_PRODUCTIONS]: { type: 'belongs_to' as const, key: Column.MILK_PRODUCTION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(Column.REPORTED_AT) reportedAt!: Date
  @nochange @field(Column.PRODUCTION_NUMBER) productionNumber!: number

  @field(Column.LITERS) liters!: number
  @field(Column.IS_SOLD) isSold!: boolean

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>
  @immutableRelation(TableName.MILK_PRODUCTIONS, Column.MILK_PRODUCTION_ID) milkProduction!: Relation<MilkProduction>

  /**
   * Creates a new milk report only if there are no milk reports in that same day (belonging to this specific cattle)
   * that belongs to a milk production which hasn't been sold yet. If all milk productions related to the same day
   * are sold, it will also create a new milk production record.
   */
  static async create({ cattle, liters, reportedAt }: { cattle: Cattle; liters: number; reportedAt: Date }) {
    const db = cattle.db
    const reportedAtDate = dayjs(reportedAt).format('YYYY-MM-DD')
    const milkReports = await cattle.milkReports.extend(
      Q.unsafeSqlExpr(`date(${Column.REPORTED_AT} / 1000, 'unixepoch') = '${reportedAtDate}'`)
    )

    if (!milkReports.every((record) => record.isSold)) {
      throw new Error(
        `Can't create a new milk report with the date ${reportedAtDate}. There is a report that belongs to a milk production that hasn't been sold yet.`
      )
    }

    const milkProductions = await db
      .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
      .query(
        Q.unsafeSqlExpr(`date(${MilkProductionsCol.PRODUCED_AT} / 1000, 'unixepoch') = '${reportedAtDate}'`),
        Q.sortBy(MilkProductionsCol.PRODUCTION_NUMBER, Q.asc)
      )

    const latestMilkProduction = milkProductions[milkProductions.length - 1]
    let milkProductionBatch: MilkProduction

    if (milkProductions.length > 0 && !latestMilkProduction.isSold) {
      milkProductionBatch = latestMilkProduction.prepareUpdate((record) => {
        record.liters += liters
      })
    } else {
      milkProductionBatch = db.get<MilkProduction>(TableName.MILK_PRODUCTIONS).prepareCreate((record) => {
        record.producedAt = reportedAt
        record.liters = liters
        record.productionNumber = milkProductions.length + 1
        record.isSold = false
      })
    }

    await db.write(async () => {
      await db.batch(
        db.get<MilkReport>(TableName.MILK_REPORTS).prepareCreate((record) => {
          record.cattle.set(cattle)
          record.milkProduction.set(milkProductionBatch)

          record.reportedAt = reportedAt
          record.liters = liters
          record.productionNumber = milkProductionBatch.productionNumber
          record.isSold = false
        }),
        milkProductionBatch
      )
    })
  }

  @writer
  async updateMilkReport(liters: number) {
    const milkProduction = await this.milkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't edit a report that belongs to a sold milk production.")
    }

    await this.batch(
      milkProduction.prepareUpdate((record) => {
        record.liters += liters - this.liters
      }),
      this.prepareUpdate((record) => {
        record.liters = liters
      })
    )
  }

  @writer
  async delete() {
    const milkProduction = await this.milkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't delete a report that belongs to a sold milk production.")
    }

    let milkProductionBatch: MilkProduction

    if (milkProduction.liters - this.liters === 0) {
      milkProductionBatch = milkProduction.prepareDestroyPermanently()
    } else {
      milkProductionBatch = milkProduction.prepareUpdate((record) => {
        record.liters -= this.liters
      })
    }

    await this.batch(this.prepareDestroyPermanently(), milkProductionBatch)
  }
}

export default MilkReport

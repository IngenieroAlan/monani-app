import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, lazy, nochange, readonly, writer } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import dayjs from 'dayjs'
import { MilkReportsCol as Column, DailyMilkProductionsCol, MonthlyMilkProductionsCol, TableName } from '../constants'
import Cattle from './Cattle'
import DailyMilkProduction from './DailyMilkProduction'
import MilkProduction from './MilkProduction'
import MonthlyMilkProduction from './MonthlyMilkProduction'

class MilkReport extends Model {
  static table = TableName.MILK_REPORTS

  static associations: Associations = {
    [TableName.CATTLE]: { type: 'belongs_to', key: Column.CATTLE_ID },
    [TableName.MILK_PRODUCTIONS]: { type: 'belongs_to', key: Column.MILK_PRODUCTION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(Column.REPORTED_AT) reportedAt!: Date
  @nochange @field(Column.PRODUCTION_NUMBER) productionNumber!: number

  @field(Column.LITERS) liters!: number
  @field(Column.IS_SOLD) isSold!: boolean

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>
  @immutableRelation(TableName.MILK_PRODUCTIONS, Column.MILK_PRODUCTION_ID) milkProduction!: Relation<MilkProduction>

  @lazy
  dailyMilkProduction = this.db
    .get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS)
    .query(
      Q.unsafeSqlExpr(
        `date(${DailyMilkProductionsCol.PRODUCED_AT} / 1000, 'unixepoch') = '${dayjs(this.reportedAt).format(
          'YYYY-MM-DD'
        )}'`
      )
    )

  @lazy
  monthlyMilkProduction = this.db
    .get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS)
    .query(
      Q.where(MonthlyMilkProductionsCol.YEAR, dayjs(this.reportedAt).year()),
      Q.where(MonthlyMilkProductionsCol.MONTH, dayjs(this.reportedAt).month())
    )

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

    const milkProductionBatch = await MilkProduction.prepareUpdateOrCreate(
      db,
      { producedAt: reportedAt },
      { liters: liters }
    )
    const dailyMilkProductionBatch = await DailyMilkProduction.prepareUpdateOrCreate(
      db,
      { producedAt: reportedAt },
      { liters: liters, totalProductions: milkProductionBatch.productionNumber }
    )
    const monthlyMilkProductionBatch = await MonthlyMilkProduction.prepareUpdateOrCreate(
      db,
      { producedAt: reportedAt },
      { liters }
    )

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
        milkProductionBatch,
        dailyMilkProductionBatch,
        monthlyMilkProductionBatch
      )
    })
  }

  @writer
  async updateMilkReport(liters: number) {
    const milkProduction = await this.milkProduction
    const [dailyMilkProduction] = await this.dailyMilkProduction
    const [monthlyMilkProduction] = await this.monthlyMilkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't edit a report that belongs to a sold milk production.")
    }

    await this.batch(
      milkProduction.prepareUpdate((record) => {
        record.liters += liters - this.liters
      }),
      dailyMilkProduction.prepareUpdate((record) => {
        record.liters += liters - this.liters
      }),
      monthlyMilkProduction.prepareUpdate((record) => {
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
    const [dailyMilkProduction] = await this.dailyMilkProduction
    const [monthlyMilkProduction] = await this.monthlyMilkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't delete a report that belongs to a sold milk production.")
    }

    const milkProductionBatch = milkProduction.prepareUpdateOrDestroy(this.liters)
    const dailyMilkProductionBatch = dailyMilkProduction.prepareUpdateOrDestroy(this.liters)
    const monthluMilkProductionBatch = monthlyMilkProduction.prepareUpdateOrDestroy(this.liters)

    await this.batch(
      milkProductionBatch,
      dailyMilkProductionBatch,
      monthluMilkProductionBatch,
      this.prepareDestroyPermanently()
    )
  }
}

export default MilkReport

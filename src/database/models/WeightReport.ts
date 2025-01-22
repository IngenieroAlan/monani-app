import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, lazy, readonly, writer } from '@nozbe/watermelondb/decorators'
import { differenceInCalendarDays, format, isAfter } from 'date-fns'
import { WeightReportsCol as Column, TableName } from '../constants'
import Cattle from './Cattle'

class WeightReport extends Model {
  static table = TableName.WEIGHT_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: Column.CATTLE_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date(Column.WEIGHED_AT) weighedAt!: Date
  @field(Column.WEIGHT) weight!: number
  @field(Column.WEIGHT_DIFFERENCE) weightDifference!: number
  @field(Column.DAYS_PASSED) daysPassed!: number
  @field(Column.AVG_DAILY_DIFFERENCE) avgDailyDifference!: number

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>

  @lazy
  previousReport = this.collections
    .get<WeightReport>(TableName.WEIGHT_REPORTS)
    .query(
      Q.where(Column.CATTLE_ID, this.cattle.id),
      Q.where(Column.WEIGHED_AT, Q.gt(this.weighedAt.getTime())),
      Q.sortBy(Column.WEIGHED_AT, Q.asc),
      Q.take(1)
    )

  @lazy
  nextReport = this.collections
    .get<WeightReport>(TableName.WEIGHT_REPORTS)
    .query(
      Q.where(Column.CATTLE_ID, this.cattle.id),
      Q.where(Column.WEIGHED_AT, Q.lt(this.weighedAt.getTime())),
      Q.sortBy(Column.WEIGHED_AT, Q.desc),
      Q.take(1)
    )

  @writer
  async updateWeightReport({ weight, weighedAt }: { weight: number; weighedAt: Date }) {
    const cattle = await this.cattle

    if (isAfter(weighedAt, cattle.admittedAt)){
      throw new Error(
        `A weight report can't have a date after ${format(cattle.admittedAt, 'yyyy/MM/dd')}.`
      )
    }

    const weighedAtDate = format(weighedAt, 'yyyy/MM/dd')
    const existingReport = await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(Q.unsafeSqlQuery(
        `SELECT * FROM ${TableName.WEIGHT_REPORTS} ` +
        `WHERE ${Column.CATTLE_ID} = ? AND strftime("%Y-%m-%d", datetime(${Column.WEIGHED_AT} / 1000, "unixepoch")) = ? LIMIT 1`,
        [cattle.id, weighedAtDate]
      ))
      .fetch()

    if (existingReport.length === 1) throw new Error(`There is already a weight report with the date ${weighedAtDate}.`)

    const previousReport = (await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(
        Q.where('id', Q.notEq(this.id)),
        Q.where(Column.CATTLE_ID, cattle.id),
        Q.where(Column.WEIGHED_AT, Q.gt(weighedAt.getTime())),
        Q.sortBy(Column.WEIGHED_AT, Q.asc),
        Q.take(1)
      )
      .fetch())[0]
    const nextReport = (await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(
        Q.where('id', Q.notEq(this.id)),
        Q.where(Column.CATTLE_ID, cattle.id),
        Q.where(Column.WEIGHED_AT, Q.lt(weighedAt.getTime())),
        Q.sortBy(Column.WEIGHED_AT, Q.desc),
        Q.take(1)
      )
      .fetch())[0]

    let preparedPreviousReportUpdate: WeightReport | null = null
    if (previousReport) {
      preparedPreviousReportUpdate = previousReport.prepareUpdate((record) => {
        record.weightDifference = +(previousReport.weight - weight).toFixed(3)
        record.daysPassed = differenceInCalendarDays(previousReport.weighedAt, weighedAt)
        record.avgDailyDifference = +(record.weightDifference / record.daysPassed).toFixed(3)
      })
    }

    const nextWeight = nextReport ? nextReport.weight : cattle.weight
    const nextWeighedAt = nextReport ? nextReport.weighedAt : cattle.admittedAt

    const preparedCurrentReportUpdate = this.prepareUpdate((record) => {
      record.weighedAt = weighedAt
      record.weight = weight
      record.weightDifference = +(weight - nextWeight).toFixed(3)
      record.daysPassed = differenceInCalendarDays(weighedAt, nextWeighedAt)
      record.avgDailyDifference = +(record.weightDifference / record.daysPassed).toFixed(3)
    })

    await this.batch(preparedPreviousReportUpdate, preparedCurrentReportUpdate)
  }

  @writer
  async delete() {
    const previousReport = (await this.previousReport)[0]
    let preparedUpdate: WeightReport | null = null

    if (previousReport) {
      preparedUpdate = previousReport.prepareUpdate((record) => {
        record.weightDifference = +(previousReport.weightDifference + this.weightDifference).toFixed(3)
        record.daysPassed = previousReport.daysPassed + this.daysPassed
        record.avgDailyDifference = +(record.weightDifference / record.daysPassed).toFixed(3)
      })
    }

    await this.batch(preparedUpdate, this.prepareDestroyPermanently())
  }
}

export default WeightReport

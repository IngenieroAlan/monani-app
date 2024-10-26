import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, lazy, readonly, writer } from '@nozbe/watermelondb/decorators'
import { differenceInCalendarDays, formatISO, isAfter } from 'date-fns'
import { TableName } from '../schema'
import Cattle from './Cattle'

class WeightReport extends Model {
  static table = TableName.WEIGHT_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('weighed_at') weighedAt!: Date
  @field('weight') weight!: number
  @field('weight_difference') weightDifference!: number
  @field('days_passed') daysPassed!: number
  @field('avg_daily_difference') avgDailyDifference!: number

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>

  @lazy
  previousReport = this.collections
    .get<WeightReport>(TableName.WEIGHT_REPORTS)
    .query(
      Q.where('cattle_id', this.cattle.id),
      Q.where('weighed_at', Q.gt(this.weighedAt.getTime())),
      Q.sortBy('weighed_at', Q.asc),
      Q.take(1)
    )

  @lazy
  nextReport = this.collections
    .get<WeightReport>(TableName.WEIGHT_REPORTS)
    .query(
      Q.where('cattle_id', this.cattle.id),
      Q.where('weighed_at', Q.lt(this.weighedAt.getTime())),
      Q.sortBy('weighed_at', Q.desc),
      Q.take(1)
    )

  @writer
  async updateWeightReport({ weight, weighedAt }: { weight: number; weighedAt: Date }) {
    const cattle = await this.cattle

    if (isAfter(weighedAt, cattle.admittedAt)){
      throw new Error(
        `A weight report can't have a date after ${formatISO(cattle.admittedAt, { representation: 'date' })}.`
      )
    }

    const weighedAtDate = formatISO(weighedAt, { representation: 'date' })
    const existingReport = await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(Q.unsafeSqlQuery(
        `SELECT * FROM ${TableName.WEIGHT_REPORTS} ` +
        `WHERE cattle_id = ? AND strftime("%Y-%m-%d", datetime(weighed_at / 1000, "unixepoch")) = ? LIMIT 1`,
        [cattle.id, weighedAtDate]
      ))
      .fetch()

    if (existingReport.length === 1) throw new Error(`There is already a weight report with the date ${weighedAtDate}.`)

    const previousReport = (await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(
        Q.where('id', Q.notEq(this.id)),
        Q.where('cattle_id', cattle.id),
        Q.where('weighed_at', Q.gt(weighedAt.getTime())),
        Q.sortBy('weighed_at', Q.asc),
        Q.take(1)
      )
      .fetch())[0]
    const nextReport = (await this.collections
      .get<WeightReport>(TableName.WEIGHT_REPORTS)
      .query(
        Q.where('id', Q.notEq(this.id)),
        Q.where('cattle_id', cattle.id),
        Q.where('weighed_at', Q.lt(weighedAt.getTime())),
        Q.sortBy('weighed_at', Q.desc),
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

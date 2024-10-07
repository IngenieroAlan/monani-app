import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'

class EarningsSummary extends Model {
  static table = TableName.EARNINGS_SUMMARY

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('year') year!: number
  @field('month') month!: number
  @field('liters') liters!: number
}

export default EarningsSummary

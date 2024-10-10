import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'

class MonthlyMilkProduction extends Model {
  static table = TableName.MONTHLY_MILK_PRODUCTION

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('year') year!: number
  @field('month') month!: number
  @field('liters') liters!: number
}

export default MonthlyMilkProduction

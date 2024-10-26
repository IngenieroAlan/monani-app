import { Model } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'

class MonthlyMilkProduction extends Model {
  static table = TableName.MONTHLY_MILK_PRODUCTION

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field('year') year!: number
  @nochange @field('month') month!: number

  @field('liters') liters!: number
}

export default MonthlyMilkProduction

import { Model } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { MonthlyMilkProductionCol as Column, TableName } from '../constants'

class MonthlyMilkProduction extends Model {
  static table = TableName.MONTHLY_MILK_PRODUCTION

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field(Column.YEAR) year!: number
  @nochange @field(Column.MONTH) month!: number

  @field(Column.LITERS) liters!: number
}

export default MonthlyMilkProduction

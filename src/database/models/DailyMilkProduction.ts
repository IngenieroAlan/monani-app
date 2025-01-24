import { Model } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { DailyMilkProductionsCol as Column, TableName } from '../constants'

class DailyMilkProduction extends Model {
  static table = TableName.DAILY_MILK_PRODUCTIONS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(Column.PRODUCED_AT) producedAt!: Date

  @field(Column.LITERS) liters!: number
  @field(Column.TOTAL_PRODUCTIONS) totalProductions!: number
}

export default DailyMilkProduction

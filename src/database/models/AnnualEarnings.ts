import { Model } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { AnnualEarningsCol as Column, TableName } from '../constants'

class AnnualEarnings extends Model {
  static table = TableName.ANNUAL_EARNINGS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field(Column.YEAR) year!: number

  @field(Column.TOTAL_EARNINGS) totalEarnings!: number
  @field(Column.TOTAL_CATTLE_SALES) totalCattleSales!: number
  @field(Column.TOTAL_MILK_SALES) totalMilkSales!: number
}

export default AnnualEarnings

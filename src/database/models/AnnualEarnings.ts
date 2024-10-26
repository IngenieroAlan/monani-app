import { Model } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'

class AnnualEarnings extends Model {
  static table = TableName.ANNUAL_EARNINGS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field('year') year!: number

  @field('total_earnings') totalEarnings!: number
  @field('total_cattle_sales') totalCattleSales!: number
  @field('total_milk_sales') totalMilkSales!: number
}

export default AnnualEarnings

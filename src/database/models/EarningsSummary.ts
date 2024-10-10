import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'

class EarningsSummary extends Model {
  static table = TableName.EARNINGS_SUMMARY

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('total_earnings') totalEarnings!: number
  @field('total_cattle_sales') totalCattleSales!: number
  @field('total_milk_sales') totalMilkSales!: number
}

export default EarningsSummary

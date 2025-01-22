import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../constants'

class MilkProductionSummary extends Model {
  static table = TableName.MILK_PRODUCTION_SUMMARY

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('total_production') totalProduction!: number
}

export default MilkProductionSummary

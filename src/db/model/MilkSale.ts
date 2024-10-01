import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'
import MilkProduction from './MilkProduction'

class MilkSale extends Model {
  static table = TableName.MILK_SALES

  static associations = {
    [TableName.MILK_PRODUCTIONS]: { type: 'belongs_to' as const, key: 'milk_production_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @field('total') total!: number
  @field('liters') liters!: number

  @immutableRelation(TableName.MILK_PRODUCTIONS, 'milk_production_id') milkProduction!: Relation<MilkProduction>
}

export default MilkSale

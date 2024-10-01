import { Model, Relation } from '@nozbe/watermelondb'
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'
import MilkReport from './MilkReport'
import MilkSale from './MilkSale'

class MilkProduction extends Model {
  static table = TableName.MILK_PRODUCTIONS

  static associations = {
    [TableName.MILK_REPORTS]: { type: 'has_many' as const, foreignKey: 'milk_production_id' },
    [TableName.MILK_SALES]: { type: 'has_many' as const, foreignKey: 'milk_production_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @field('liters') liters!: number
  @field('current_session') currentSession!: number
  @field('is_sold') isSold!: boolean

  @children(TableName.MILK_REPORTS) reports!: Relation<MilkReport>
  @children(TableName.MILK_SALES) sale!: Relation<MilkSale>
}

export default MilkProduction

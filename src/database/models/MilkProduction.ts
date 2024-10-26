import { Model, Q, Query } from '@nozbe/watermelondb'
import { children, date, field, lazy, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
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

  @nochange @date('produced_at') producedAt!: Date
  @nochange @field('production_number') productionNumber!: number

  @field('liters') liters!: number
  @field('is_sold') isSold!: boolean

  @children(TableName.MILK_REPORTS) reports!: Query<MilkReport>
  // @children(TableName.MILK_SALES) saleRelation!: Relation<MilkSale>

  @lazy
  sale = this.collections
    .get<MilkSale>(TableName.MILK_SALES)
    .query(Q.where('milk_production_id', this.id), Q.take(1))
}

export default MilkProduction

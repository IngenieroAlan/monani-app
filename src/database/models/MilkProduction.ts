import { Model, Q, Query } from '@nozbe/watermelondb'
import { children, date, field, lazy, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { MilkProductionsCol, MilkReportsCol, MilkSalesCol, TableName } from '../constants'
import MilkReport from './MilkReport'
import MilkSale from './MilkSale'

class MilkProduction extends Model {
  static table = TableName.MILK_PRODUCTIONS

  static associations = {
    [TableName.MILK_REPORTS]: { type: 'has_many' as const, foreignKey: MilkReportsCol.MILK_PRODUCTION_ID },
    [TableName.MILK_SALES]: { type: 'has_many' as const, foreignKey: MilkSalesCol.MILK_PRODUCTION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(MilkProductionsCol.PRODUCED_AT) producedAt!: Date
  @nochange @field(MilkProductionsCol.PRODUCTION_NUMBER) productionNumber!: number

  @field(MilkProductionsCol.LITERS) liters!: number
  @field(MilkProductionsCol.IS_SOLD) isSold!: boolean

  @children(TableName.MILK_REPORTS) reports!: Query<MilkReport>
  // @children(TableName.MILK_SALES) saleRelation!: Relation<MilkSale>

  @lazy
  sale = this.collections
    .get<MilkSale>(TableName.MILK_SALES)
    .query(Q.where(MilkSalesCol.MILK_PRODUCTION_ID, this.id), Q.take(1))
}

export default MilkProduction

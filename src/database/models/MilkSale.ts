import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { MilkSalesCol as Column, TableName } from '../constants'
import MilkProduction from './MilkProduction'

class MilkSale extends Model {
  static table = TableName.MILK_SALES

  static associations = {
    [TableName.MILK_PRODUCTIONS]: { type: 'belongs_to' as const, key: Column.MILK_PRODUCTION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date(Column.SOLD_AT) soldAt!: Date
  @field(Column.DETAILS) details!: string
  @field(Column.LITERS) liters!: number
  @field(Column.SOLD_BY) soldBy!: number

  @immutableRelation(TableName.MILK_PRODUCTIONS, Column.MILK_PRODUCTION_ID) milkProduction!: Relation<MilkProduction>
}

export default MilkSale

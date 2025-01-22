import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName, CattleSalesCol as Column } from '../constants'
import Cattle from './Cattle'

class CattleSale extends Model {
  static table = TableName.CATTLE_SALES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: Column.CATTLE_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date(Column.SOLD_AT) soldAt!: Date
  @field(Column.DETAILS) details!: string
  @field(Column.KG) kg!: number
  @field(Column.SOLD_BY) soldBy!: number

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>
}

export default CattleSale

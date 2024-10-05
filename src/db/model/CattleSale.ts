import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'
import Cattle from './Cattle'

class CattleSale extends Model {
  static table = TableName.CATTLE_SALES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @field('total') total!: number

  @immutableRelation(TableName.WEIGHT_REPORTS, 'cattle_id') cattle!: Relation<Cattle>
}

export default CattleSale

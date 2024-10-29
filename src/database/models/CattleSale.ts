import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'

class CattleSale extends Model {
  static table = TableName.CATTLE_SALES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('sold_at') soldAt!: Date
  @field('details') details!: string
  @field('kg') kg!: number
  @field('sold_by') soldBy!: number

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default CattleSale

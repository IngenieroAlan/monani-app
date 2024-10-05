import { Model, Relation } from '@nozbe/watermelondb'
import { date, immutableRelation, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'
import Cattle from './Cattle'

class WeightReport extends Model {
  static table = TableName.WEIGHT_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @text('weight') weight!: number

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default WeightReport

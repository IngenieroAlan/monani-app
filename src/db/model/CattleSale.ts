import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'
import WeightReport from './WeightReport'

class CattleSale extends Model {
  static table = TableName.CATTLE_SALES

  static associations = {
    [TableName.WEIGHT_REPORTS]: { type: 'belongs_to' as const, key: 'weight_report_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @field('total') total!: number
  @field('cattle_weight') cattleWeight!: number

  @immutableRelation(TableName.WEIGHT_REPORTS, 'weight_report_id') weightReport!: Relation<WeightReport>
}

export default CattleSale

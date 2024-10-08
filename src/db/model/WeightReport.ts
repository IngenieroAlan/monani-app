import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'

class WeightReport extends Model {
  static table = TableName.WEIGHT_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('weighed_at') weighedAt!: Date
  @text('weight') weight!: number
  @field('weight_difference') weightDifference!: number
  @field('days_passed') daysPassed!: number
  @field('avg_daily_difference') avgDailyDifference!: number

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default WeightReport

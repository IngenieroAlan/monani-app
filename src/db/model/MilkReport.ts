import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import MilkProduction from './MilkProduction'

class MilkReport extends Model {
  static table = TableName.MILK_REPORTS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' },
    [TableName.MILK_PRODUCTIONS]: { type: 'belongs_to' as const, key: 'milk_production_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('reported_at') reportedAt!: Date
  @field('liters') liters!: number
  @field('liters_difference') litersDifference!: number

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
  @immutableRelation(TableName.MILK_PRODUCTIONS, 'milk_production_id') milkProduction!: Relation<MilkProduction>
}

export default MilkReport

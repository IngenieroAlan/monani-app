import { Model, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, readonly, text } from '@nozbe/watermelondb/decorators'
import { CattleStatus, ProductionType, TableName } from '../types'
import ArchivedCattle from './ArchivedCattle'
import Diet from './Diet'
import MedicationSchedule from './MedicationSchedule'
import MilkReport from './MilkReport'
import WeightReport from './WeightReport'

class Cattle extends Model {
  static table = TableName.CATTLE

  static associations = {
    [TableName.DIETS]: { type: 'belongs_to' as const, key: 'diet_id' },
    [TableName.ARCHIVED_CATTLE]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.WEIGHT_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MILK_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name?: string
  @text('tag_id') tagId!: string
  @text('tag_cattle_number') tagCattleNumber!: string
  @date('entry_date') entryDate!: Date
  @date('birth_date') birthDate!: Date
  @date('pregnancy_date') pregnancyDate?: Date
  @field('weight') weight!: number
  @field('production_type') productionType!: ProductionType
  @field('cattle_status') cattleStatus!: CattleStatus
  @field('quarantine_days_left') quarantineDaysLeft?: number
  @field('is_active') isActive!: boolean
  @field('is_archived') isArchived!: boolean
  @field('is_sold') isSold!: boolean

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>

  @children(TableName.ARCHIVED_CATTLE) archivedCattle!: Relation<ArchivedCattle>
  @children(TableName.MEDICATION_SCHEDULES) medicationSchedules!: Relation<MedicationSchedule>
  @children(TableName.WEIGHT_REPORTS) weightReports!: Relation<WeightReport>
  @children(TableName.MILK_REPORTS) milkReports!: Relation<MilkReport>
}

export default Cattle

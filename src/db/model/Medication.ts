import { Model, Relation } from '@nozbe/watermelondb'
import { children, date, field, readonly, text } from '@nozbe/watermelondb/decorators'
import { MedicationType, TableName } from '../types'
import MedicationSchedule from './MedicationSchedule'

class Medication extends Model {
  static table = TableName.MEDICATIONS

  static association = {
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: 'medication_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name!: string
  @field('medication_type') medicationType!: MedicationType

  @children(TableName.MEDICATION_SCHEDULES) schedules!: Relation<MedicationSchedule>
}

export default Medication

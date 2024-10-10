import { Model, Relation } from '@nozbe/watermelondb'
import { date, immutableRelation, readonly, relation, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import Medication from './Medication'

class MedicationSchedule extends Model {
  static table = TableName.MEDICATION_SCHEDULES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' },
    [TableName.MEDICATIONS]: { type: 'belongs_to' as const, key: 'medication_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('next_dose_at') nextDoseAt!: Date
  @text('doses_per_year') dosesPerYear!: number

  @relation(TableName.MEDICATIONS, 'medication_id') medication!: Relation<Medication>

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default MedicationSchedule

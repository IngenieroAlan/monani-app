import { createMedicationNotification } from '@/notifee/constructors'
import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, relation, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import Medication from './Medication'
import PendingNotification from './PendingNotification'
import notifee from '@notifee/react-native'

class MedicationSchedule extends Model {
  static table = TableName.MEDICATION_SCHEDULES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' },
    [TableName.MEDICATIONS]: { type: 'belongs_to' as const, key: 'medication_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('next_dose_at') nextDoseAt!: Date
  @field('doses_per_year') dosesPerYear!: number

  @relation(TableName.MEDICATIONS, 'medication_id') medication!: Relation<Medication>

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>

  @writer
  async updateMedicationSchedule({
    medication,
    nextDoseAt,
    dosesPerYear
  }: {
    medication: Medication
    nextDoseAt: Date
    dosesPerYear: number
  }) {
    await this.update((record) => {
      record.medication.set(medication)

      record.nextDoseAt = nextDoseAt
      record.dosesPerYear = dosesPerYear
    })

    const cattle = await this.cattle
    const pendingNotification = (
      await this.collections
        .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
        .query(
          Q.where('cattle_id', cattle.id),
          Q.where('type', 'medication'),
          Q.where('foreign_id', this.id)
        )
    )[0]

    await createMedicationNotification(
      cattle,
      medication.name,
      this.id,
      dosesPerYear,
      nextDoseAt.getTime(),
      pendingNotification.id
    )
  }

  @writer
  async delete() {
    await this.destroyPermanently()

    const pendingNotification = await this.collections
      .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
      .query(
        Q.where('type', 'medication'),
        Q.where('foreign_id', this.id)
      )
      .fetchIds()

    await notifee.cancelTriggerNotifications(pendingNotification)
  }
}

export default MedicationSchedule

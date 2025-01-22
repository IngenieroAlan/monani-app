import { createMedicationNotification } from '@/notifee/constructors'
import notifee from '@notifee/react-native'
import { Model, Q, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, relation, writer } from '@nozbe/watermelondb/decorators'
import { MedicationSchedulesCol, PendingNotificationsCol, TableName } from '../constants'
import Cattle from './Cattle'
import Medication from './Medication'
import PendingNotification from './PendingNotification'

class MedicationSchedule extends Model {
  static table = TableName.MEDICATION_SCHEDULES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: MedicationSchedulesCol.CATTLE_ID },
    [TableName.MEDICATIONS]: { type: 'belongs_to' as const, key: MedicationSchedulesCol.MEDICATION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date(MedicationSchedulesCol.NEXT_DOSE_AT) nextDoseAt!: Date
  @field(MedicationSchedulesCol.DOSES_PER_YEAR) dosesPerYear!: number

  @relation(TableName.MEDICATIONS, MedicationSchedulesCol.MEDICATION_ID) medication!: Relation<Medication>

  @immutableRelation(TableName.CATTLE, MedicationSchedulesCol.CATTLE_ID) cattle!: Relation<Cattle>

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
          Q.where(PendingNotificationsCol.CATTLE_ID, cattle.id),
          Q.where(PendingNotificationsCol.TYPE, 'medication'),
          Q.where(PendingNotificationsCol.FOREIGN_ID, this.id)
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
        Q.where(PendingNotificationsCol.TYPE, 'medication'),
        Q.where(PendingNotificationsCol.FOREIGN_ID, this.id)
      )
      .fetchIds()

    await notifee.cancelTriggerNotifications(pendingNotification)
  }
}

export default MedicationSchedule

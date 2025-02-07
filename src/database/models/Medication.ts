import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { MedicationSchedulesCol, MedicationsCol, TableName } from '../constants'
import Cattle from './Cattle'

export type MedicationType = 'Desparasitante' | 'Vitaminas' | 'Suplemento mineral' | 'Otro'

class Medication extends Model {
  static table = TableName.MEDICATIONS

  static associations = {
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: MedicationSchedulesCol.MEDICATION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text(MedicationsCol.NAME) name!: string
  @field(MedicationsCol.MEDICATION_TYPE) medicationType!: MedicationType

  @lazy
  cattle = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.on(TableName.MEDICATION_SCHEDULES, MedicationSchedulesCol.MEDICATION_ID, this.id))

  @writer
  async updateMedication({ name, medicationType }: { name: string; medicationType: MedicationType }) {
    return await this.update((record) => {
      record.name = name
      record.medicationType = medicationType
    })
  }

  @writer
  async delete() {
    await this.destroyPermanently()
  }
}

export default Medication

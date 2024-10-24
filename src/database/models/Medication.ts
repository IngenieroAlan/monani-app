import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'

export type MedicationType = 'Desparasitante' | 'Vitaminas' | 'Suplemento mineral' | 'Otro'

class Medication extends Model {
  static table = TableName.MEDICATIONS

  static associations = {
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: 'medication_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name!: string
  @field('medication_type') medicationType!: MedicationType

  @lazy
  cattle = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.on(TableName.MEDICATION_SCHEDULES, 'medication_id', this.id))

  @writer
  async updateMedication({ name, medicationType }: { name: string, medicationType: MedicationType }) {
    await this.update((record) => {
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

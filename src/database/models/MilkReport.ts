import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, nochange, readonly, writer } from '@nozbe/watermelondb/decorators'
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

  @nochange @date('reported_at') reportedAt!: Date
  @nochange @field('production_number') productionNumber!: number

  @field('liters') liters!: number
  @field('is_sold') isSold!: boolean

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
  @immutableRelation(TableName.MILK_PRODUCTIONS, 'milk_production_id') milkProduction!: Relation<MilkProduction>

  @writer
  async updateMilkReport(liters: number) {
    const milkProduction = await this.milkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't edit a report that belongs to a sold milk production.")
    }

    await this.batch(
      milkProduction.prepareUpdate((record) => {
        record.liters += liters - this.liters
      }),
      this.prepareUpdate((record) => {
        record.liters = liters
      })
    )
  }

  @writer
  async delete() {
    const milkProduction = await this.milkProduction

    if (milkProduction.isSold) {
      throw new Error("Can't delete a report that belongs to a sold milk production.")
    }

    let milkProductionBatch: MilkProduction

    if (milkProduction.liters - this.liters === 0) {
      milkProductionBatch = milkProduction.prepareDestroyPermanently()
    } else {
      milkProductionBatch = milkProduction.prepareUpdate((record) => {
        record.liters -= this.liters
      })
    }

    await this.batch(this.prepareDestroyPermanently(), milkProductionBatch)
  }
}

export default MilkReport

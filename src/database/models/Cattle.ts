import { Model, Q, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { addDays, getYear } from 'date-fns'
import { TableName } from '../schema'
import AnnualEarnings from './AnnualEarnings'
import CattleArchive, { ArchiveReason } from './CattleArchive'
import CattleSale from './CattleSale'
import Diet from './Diet'
import MedicationSchedule from './MedicationSchedule'
import MilkReport from './MilkReport'
import WeightReport from './WeightReport'

export type ProductionType = 'Lechera' | 'De carne'
export type CattleStatus = 'Gestante' | 'En producción' | 'De reemplazo' | 'De deshecho'

class Cattle extends Model {
  static table = TableName.CATTLE

  static associations = {
    [TableName.DIETS]: { type: 'belongs_to' as const, key: 'diet_id' },
    [TableName.CATTLE_ARCHIVES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.WEIGHT_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MILK_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.CATTLE_SALES]: { type: 'has_many' as const, foreignKey: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name?: string
  @text('tag_id') tagId!: string
  @text('tag_cattle_number') tagCattleNumber!: string
  @date('admitted_at') admittedAt!: Date
  @date('born_at') bornAt!: Date
  @date('pregnant_at') pregnantAt?: Date
  @date('quarantine_ends_at') quarantineEndsAt?: Date
  @field('weight') weight!: number
  @field('production_type') productionType!: ProductionType
  @field('cattle_status') cattleStatus!: CattleStatus
  @field('is_active') isActive!: boolean
  @field('is_archived') isArchived!: boolean
  @field('is_sold') isSold!: boolean

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>

  @children(TableName.WEIGHT_REPORTS) weightReports!: Relation<WeightReport>
  @children(TableName.MILK_REPORTS) milkReports!: Relation<MilkReport>

  @children(TableName.CATTLE_SALES) cattleSalesRelation!: Relation<CattleSale>
  @children(TableName.CATTLE_ARCHIVES) cattleArchiveRelation!: Relation<CattleArchive>

  @lazy
  sale = this.collections
    .get<CattleSale>(TableName.CATTLE_SALES)
    .query(Q.where('cattle_id', this.id))

  @lazy
  archive = this.collections
    .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
    .query(Q.where('cattle_id', this.id))

  @lazy
  medicationSchedules = this.collections
    .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
    .query(Q.where('cattle_id', this.id))

  @writer
  async setQuarantine(days: number) {
    const quarantineEndsAt = addDays(Date.now(), days)

    await this.update((record) => {
      record.quarantineEndsAt = quarantineEndsAt
    })
  }

  @writer
  async markAsArchived({ reason, archivedAt, notes }: { reason: ArchiveReason; archivedAt: Date; notes?: string }) {
    await this.batch(
      this.prepareUpdate((record) => {
        record.isActive = false
        record.isArchived = true
      }),
      this.collections
        .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
        .prepareCreate((record) => {
          record.cattle.set(this)

          record.reason = reason
          record.archivedAt = archivedAt
          record.notes = notes
        })
    )
  }

  /*
   * Checks if there are already sales in the current year, if there are, just updates the
   * totalEarnings and totalCattleSales, otherwise it creates a new entry.
   */
  @writer
  async sell({ soldBy, soldAt }: { soldBy: number, soldAt: Date }) {
    const year = getYear(soldAt)

    const annualEarnings = (await this.collections
      .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
      .query(Q.where('year', year), Q.take(1))
      .fetch())

    let annualEarningsBatch: AnnualEarnings

    if (annualEarnings.length === 0) {
      annualEarningsBatch = this.collections
        .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
        .prepareCreate((record) => {
          record.year = year
          record.totalEarnings = soldBy
          record.totalCattleSales = soldBy
          record.totalMilkSales = 0
        })
    } else {
      annualEarningsBatch = annualEarnings[0].prepareUpdate((record) => {
        record.totalEarnings += soldBy
        record.totalCattleSales += soldBy
      })
    }

    await this.batch(
      this.prepareUpdate((record) => {
        record.isActive = false,
        record.isSold = true
      }),
      this.collections.get<CattleSale>(TableName.CATTLE_SALES)
        .prepareCreate((record) => {
          record.cattle.set(this)

          record.soldBy = soldBy
          record.soldAt = soldAt
        }),
      annualEarningsBatch
    )
  }

  @writer
  async delete() {
    if (this.isSold) throw new Error("Can't delete a cattle that has been sold.")

    await this.medicationSchedules.destroyAllPermanently()
    
    if (this.isArchived) await this.archive.destroyAllPermanently()

    await this.destroyPermanently()

    const diet = await this.diet
    await this.callWriter(() => diet.delete())
  }
}

export default Cattle

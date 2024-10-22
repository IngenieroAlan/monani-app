import { Model, Q, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import CattleArchive from './CattleArchive'
import CattleSale from './CattleSale'
import Diet from './Diet'
import Medication from './Medication'
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
  @text('weight') weight!: number
  @text('quarantine_days_left') quarantineDaysLeft?: number
  @date('admitted_at') admittedAt!: Date
  @date('born_at') bornAt!: Date
  @date('pregnant_at') pregnantAt?: Date
  @field('production_type') productionType!: ProductionType
  @field('cattle_status') cattleStatus!: CattleStatus
  @field('is_active') isActive!: boolean
  @field('is_archived') isArchived!: boolean
  @field('is_sold') isSold!: boolean

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>

  @children(TableName.WEIGHT_REPORTS) weightReports!: Relation<WeightReport>
  @children(TableName.MILK_REPORTS) milkReports!: Relation<MilkReport>

  @children(TableName.CATTLE_SALES) cattleSalesRelation!: Relation<CattleSale>
  @children(TableName.CATTLE_ARCHIVES) archivedCattleRelation!: Relation<CattleArchive>

  @lazy
  sale = this.collections
    .get<CattleSale>(TableName.CATTLE_SALES)
    .query(Q.where('cattle_id', this.id))

  @lazy
  archive = this.collections
    .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
    .query(Q.where('cattle_id', this.id))

  @lazy
  medications = this.collections
    .get<Medication>(TableName.MEDICATIONS)
    .query(Q.on(TableName.MEDICATION_SCHEDULES, 'cattle_id', this.id))

  @writer
  async sell(soldBy: number) {
    await this.batch(
      this.prepareUpdate(cattle => {
        cattle.isActive = false,
        cattle.isSold = true
      }),
      this.collections.get<CattleSale>(TableName.CATTLE_SALES).prepareCreate(cattleSale => {
        cattleSale.soldBy = soldBy
        cattleSale.soldAt = new Date()
      })
    )
  }
}

export default Cattle

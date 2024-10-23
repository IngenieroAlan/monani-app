import { Model, Q, Relation } from '@nozbe/watermelondb'
import { children, date, field, lazy, readonly, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import DietFeed from './DietFeed'

export type MatterProportion = 'Porcentaje de peso' | 'Fija' | 'Sin definir'

class Diet extends Model {
  static table = TableName.DIETS

  static associations = {
    [TableName.CATTLE]: { type: 'has_many' as const, foreignKey: 'diet_id' },
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: 'diet_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('water_amount') waterAmount!: number
  @field('matter_amount') matterAmount?: number
  @field('percentage') percentage?: number
  @field('matter_proportion') matterProportion!: MatterProportion
  @field('is_concentrate_excluded') isConcentrateExcluded!: boolean

  @children(TableName.CATTLE) cattleRelation!: Relation<Cattle>


  @lazy
  cattle = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.where('diet_id', this.id))
  
  @lazy
  feeds = this.collections
    .get<DietFeed>(TableName.DIET_FEED)
    .query(Q.where('diet_id', this.id))

  @writer
  async updateDiet({
    waterAmount,
    matterAmount,
    percentage,
    matterProportion,
    isConcentrateExcluded
  }: {
    waterAmount: number
    matterAmount?: number
    percentage?: number
    matterProportion: MatterProportion
    isConcentrateExcluded: boolean
  }) {
    await this.update((record) => {
      record.waterAmount = waterAmount
      record.matterAmount = matterAmount
      record.percentage = percentage
      record.matterProportion = matterProportion
      record.isConcentrateExcluded = isConcentrateExcluded
    })
  }

  @writer
  async delete() {
    await this.feeds.destroyAllPermanently()
    await this.destroyPermanently()
  }
}

export default Diet

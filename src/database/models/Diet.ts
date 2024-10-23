import { Model, Q, Relation } from '@nozbe/watermelondb'
import { children, date, field, lazy, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import Feed from './Feed'

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
    .get<Feed>(TableName.FEEDS)
    .query(Q.on(TableName.DIET_FEED, 'diet_id', this.id))
}

export default Diet

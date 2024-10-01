import { Model, Relation } from '@nozbe/watermelondb'
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators'
import { MatterProportion, TableName } from '../types'
import Cattle from './Cattle'
import DietFeed from './DietFeed'

class Diet extends Model {
  static table = TableName.DIETS

  static associations = {
    [TableName.CATTLE]: { type: 'has_many' as const, foreignKey: 'diet_id' },
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: 'diet_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('matter_amount') matterAmount!: number
  @field('matter_proportion') matterProportion!: MatterProportion
  @field('is_concentrate_excluded') isConcentrateExcluded!: boolean
  @field('water_amount') waterAmount!: number

  @children(TableName.CATTLE) cattle!: Relation<Cattle>
  @children(TableName.DIET_FEED) feeds!: Relation<DietFeed>
}

export default Diet

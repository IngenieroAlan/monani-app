import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, relation, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Diet from './Diet'
import Feed from './Feed'

export type FeedProportion = 'Fija' | 'Por porcentaje'

class DietFeed extends Model {
  static table = TableName.DIET_FEED

  static associations = {
    [TableName.FEEDS]: { type: 'belongs_to' as const, key: 'feed_id' },
    [TableName.DIETS]: { type: 'belongs_to' as const, key: 'diet_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('feed_amount') feedAmount!: number
  @text('percentage') percentage?: number
  @field('feed_proportion') feedProportion!: FeedProportion

  @relation(TableName.FEEDS, 'feed_id') feed!: Relation<Feed>

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>
}

export default DietFeed

import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, relation } from '@nozbe/watermelondb/decorators'
import { FeedProportion, TableName } from '../types'
import Diet from './Diet'
import Feed from './Feed'

class DietFeed extends Model {
  static table = TableName.DIET_FEED

  static associations = {
    [TableName.FEEDS]: { type: 'belongs_to' as const, key: 'feed_id' },
    [TableName.DIETS]: { type: 'belongs_to' as const, key: 'diet_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('feed_proportion') feedProportion!: FeedProportion
  @field('amount') amount!: number

  @relation(TableName.FEEDS, 'feed_id') feed!: Relation<Feed>

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>
}

export default DietFeed

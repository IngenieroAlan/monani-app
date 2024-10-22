import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Diet from './Diet'

export type FeedType = 'Alimento' | 'Concentrado de engorda' | 'Concentrado lechero'

class Feed extends Model {
  static table = TableName.FEEDS

  static associations = {
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: 'feed_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name!: string
  @field('feed_type') feedType!: FeedType

  @lazy
  diets = this.collections
    .get<Diet>(TableName.DIETS)
    .query(Q.on(TableName.DIET_FEED, 'feed_id', this.id))
}

export default Feed

import { Model, Relation } from '@nozbe/watermelondb'
import { children, date, field, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import DietFeed from './DietFeed'

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

  @children(TableName.DIET_FEED) diets!: Relation<DietFeed>
}

export default Feed

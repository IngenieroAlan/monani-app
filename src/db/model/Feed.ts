import { Model } from '@nozbe/watermelondb'
import { date, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'

class Feed extends Model {
  static table = TableName.FEEDS

  static associations = {
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: 'feed_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name!: string
}

export default Feed

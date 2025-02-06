import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { DietFeedCol, FeedsCol, TableName } from '../constants'
import Diet from './Diet'

export type FeedType = 'Alimento' | 'Concentrado de engorda' | 'Concentrado lechero'

class Feed extends Model {
  static table = TableName.FEEDS

  static associations = {
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: DietFeedCol.FEED_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text(FeedsCol.NAME) name!: string
  @field(FeedsCol.FEED_TYPE) feedType!: FeedType

  @lazy
  diets = this.collections.get<Diet>(TableName.DIETS).query(Q.on(TableName.DIET_FEED, DietFeedCol.FEED_ID, this.id))

  @writer
  async updateFeed({ name, feedType }: { name: string; feedType: FeedType }) {
    return await this.update((record) => {
      record.name = name
      record.feedType = feedType
    })
  }

  @writer
  async delete() {
    await this.destroyPermanently()
  }
}

export default Feed

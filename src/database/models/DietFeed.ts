import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, relation, writer } from '@nozbe/watermelondb/decorators'
import { DietFeedCol as Column, TableName } from '../constants'
import Diet from './Diet'
import Feed from './Feed'

export type FeedProportion = 'Fija' | 'Por porcentaje'

class DietFeed extends Model {
  static table = TableName.DIET_FEED

  static associations = {
    [TableName.FEEDS]: { type: 'belongs_to' as const, key: Column.FEED_ID },
    [TableName.DIETS]: { type: 'belongs_to' as const, key: Column.DIET_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field(Column.FEED_AMOUNT) feedAmount!: number
  @field(Column.PERCENTAGE) percentage?: number
  @field(Column.FEED_PROPORTION) feedProportion!: FeedProportion

  @relation(TableName.FEEDS, Column.FEED_ID) feed!: Relation<Feed>

  @immutableRelation(TableName.DIETS, Column.DIET_ID) diet!: Relation<Diet>

  @writer
  async updateDietFeed({
    feed,
    feedAmount,
    percentage,
    feedProportion
  }: {
    feed: Feed
    feedAmount: number
    percentage?: number
    feedProportion: FeedProportion
  }) {
    await this.update((record) => {
      record.feed.set(feed)

      record.feedAmount = feedAmount
      record.percentage = percentage
      record.feedProportion = feedProportion
    })
  }

  @writer
  async delete() {
    await this.destroyPermanently()
  }
}

export default DietFeed

import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import DietFeed, { FeedProportion } from './DietFeed'
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

  @lazy
  cattle = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.where('diet_id', this.id), Q.take(1))

  @lazy
  feeds = this.collections
    .get<Feed>(TableName.FEEDS)
    .query(Q.on(TableName.DIET_FEED, 'diet_id', this.id))

  @lazy
  dietFeeds = this.collections
    .get(TableName.DIET_FEED)
    .query(Q.where('diet_id', this.id))

  @writer
  async createDietFeed({ feed, feedAmount, percentage, feedProportion }: {
    feed: Feed
    feedAmount: number
    percentage?: number
    feedProportion: FeedProportion
  }) {
    const existingDietFeed = await this.dietFeeds
      .extend(Q.where('feed_id', feed.id))
      .fetchCount()

    if (existingDietFeed > 0) throw new Error('Este alimento ya es parte de la dieta.')

    await this.collections.get<DietFeed>(TableName.DIET_FEED)
      .create((record) => {
        record.diet.set(this)
        record.feed.set(feed)

        record.feedAmount = feedAmount
        record.percentage = percentage
        record.feedProportion = feedProportion
      })
  }

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
    await this.dietFeeds.destroyAllPermanently()
    await this.destroyPermanently()
  }
}

export default Diet

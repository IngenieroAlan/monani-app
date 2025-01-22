import { Model, Q } from '@nozbe/watermelondb'
import { date, field, lazy, readonly, writer } from '@nozbe/watermelondb/decorators'
import { CattleCol, DietFeedCol, DietsCol, TableName } from '../constants'
import Cattle from './Cattle'
import DietFeed, { FeedProportion } from './DietFeed'
import Feed from './Feed'

export type MatterProportion = 'Porcentaje de peso' | 'Fija' | 'Sin definir'

class Diet extends Model {
  static table = TableName.DIETS

  static associations = {
    [TableName.CATTLE]: { type: 'has_many' as const, foreignKey: CattleCol.DIET_ID },
    [TableName.DIET_FEED]: { type: 'has_many' as const, foreignKey: DietFeedCol.DIET_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field(DietsCol.WATER_AMOUNT) waterAmount!: number
  @field(DietsCol.MATTER_AMOUNT) matterAmount?: number
  @field(DietsCol.PERCENTAGE) percentage?: number
  @field(DietsCol.MATTER_PROPORTION) matterProportion!: MatterProportion
  @field(DietsCol.IS_CONCENTRATE_EXCLUDED) isConcentrateExcluded!: boolean

  @lazy
  cattle = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.where(CattleCol.DIET_ID, this.id), Q.take(1))

  @lazy
  feeds = this.collections
    .get<Feed>(TableName.FEEDS)
    .query(Q.on(TableName.DIET_FEED, DietFeedCol.DIET_ID, this.id))

  @lazy
  dietFeeds = this.collections
    .get(TableName.DIET_FEED)
    .query(Q.where(DietFeedCol.DIET_ID, this.id))

  @writer
  async createDietFeed({ feed, feedAmount, percentage, feedProportion }: {
    feed: Feed
    feedAmount: number
    percentage?: number
    feedProportion: FeedProportion
  }) {
    const existingDietFeed = await this.dietFeeds
      .extend(Q.where(DietFeedCol.FEED_ID, feed.id))
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

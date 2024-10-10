import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import { ProductionType } from '../models/Cattle'
import Diet from '../models/Diet'
import DietFeed from '../models/DietFeed'
import Feed from '../models/Feed'
import { TableName } from '../schema'

// Solo dios se acuerda de cómo funciona esto.

let NUM_OF_RECORDS = 0
const MIN_NUM_OF_FEEDS = 2
const MAX_NUM_OF_FEEDS = 3

const getFeeds = async (productionType: ProductionType) => {
  const feeds = await database.get<Feed>(TableName.FEEDS).query().fetch()
  let numOfFeeds = faker.number.int({ min: MIN_NUM_OF_FEEDS, max: MAX_NUM_OF_FEEDS })
  const dietFeeds: Feed[] = []
  const hasConcentrate = faker.datatype.boolean()

  if (hasConcentrate) {
    let concentrateFeeds: Feed[] = []

    if (productionType === 'De carne') {
      concentrateFeeds = feeds.filter((feed) => feed.feedType === 'Concentrado de engorda')
    } else {
      concentrateFeeds = feeds.filter((feed) => feed.feedType === 'Concentrado lechero')
    }

    dietFeeds.push(faker.helpers.arrayElement(concentrateFeeds))

    numOfFeeds -= 1
  }

  const _feeds = feeds.filter((feed) => feed.feedType === 'Alimento')
  const shuffled = faker.helpers.shuffle(_feeds)

  dietFeeds.push(...shuffled.slice(0, numOfFeeds))

  return dietFeeds
}

const setRecordPercentage = (isLast: boolean, percentage: number, matterAmount: number, remainingMatter: number) => {
  return isLast ? +((remainingMatter / matterAmount) * 100).toFixed(3) : percentage * 100
}

const createDietFeedRecords = async (diet: Diet, dietFeeds: Feed[]) => {
  NUM_OF_RECORDS += dietFeeds.length

  const dietFeedRecords: DirtyRaw[] = []
  let remainingMatter = diet.matterAmount!

  for (const feed of dietFeeds) {
    let percentage: number | undefined
    let feedAmount: number

    if (diet.matterProportion === 'Sin definir') {
      feedAmount = faker.number.float({ min: 4, max: 8, fractionDigits: 1 })

      dietFeedRecords.push({
        feed_id: feed.id,
        feed_proportion: 'Fija',
        feed_amount: feedAmount,
        percentage: undefined,
        diet_id: diet.id
      })

      continue
    }

    if (feed.feedType !== 'Alimento' && diet.isConcentrateExcluded) {
      const feedProportion = faker.datatype.boolean() ? 'Fija' : 'Por porcentaje'

      if (feedProportion === 'Por porcentaje') {
        percentage = faker.number.float({ min: 20, max: 40, fractionDigits: 1 })
        feedAmount = +(diet.matterAmount! * (percentage / 100)).toFixed(3)
      } else {
        feedAmount = faker.number.float({ min: 4, max: 8, fractionDigits: 1 })
      }

      dietFeedRecords.push({
        feed_id: feed.id,
        feed_proportion: feedProportion,
        feed_amount: feedAmount,
        percentage: percentage,
        diet_id: diet.id
      })

      continue
    }

    const isLastFeed = dietFeeds.length - dietFeedRecords.length === 15
    const feedProportion = faker.datatype.boolean() ? 'Fija' : 'Por porcentaje'
    percentage = faker.number.float({ min: 0.4, max: 0.5, fractionDigits: 2 })

    if (!isLastFeed) {
      feedAmount = +(remainingMatter * percentage).toFixed(3)
      remainingMatter = +(remainingMatter - feedAmount).toFixed(3)
    } else {
      feedAmount = remainingMatter
    }

    dietFeedRecords.push({
      feed_id: feed.id,
      feed_proportion: feedProportion,
      feed_amount: feedAmount,
      percentage:
        feedProportion === 'Por porcentaje'
          ? setRecordPercentage(isLastFeed, percentage, diet.matterAmount!, remainingMatter)
          : undefined,
      diet_id: diet.id
    })
  }

  return dietFeedRecords
}

const DietFeedSeeder = async () => {
  const diets = await database.get<Diet>(TableName.DIETS).query().fetch()
  const dietFeedRecords: DirtyRaw[] = []

  for (const diet of diets) {
    const cattle = (await diet.cattle)[0]
    const dietFeeds: Feed[] = await getFeeds(cattle.productionType)

    dietFeedRecords.push(...(await createDietFeedRecords(diet, dietFeeds)))
  }

  await database.write(async () => {
    await database.batch(
      dietFeedRecords.map((dietFeed) => {
        return database.get<DietFeed>(TableName.DIET_FEED).prepareCreateFromDirtyRaw(dietFeed)
      })
    )
  })

  console.log(`Diet feed table seeded with ${NUM_OF_RECORDS} records.`)
}

export default DietFeedSeeder

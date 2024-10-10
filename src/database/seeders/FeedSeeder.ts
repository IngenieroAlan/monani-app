import database from '..'
import feeds from '../factories/FeedFactory'
import Feed from '../models/Feed'
import { TableName } from '../schema'

const FeedSeeder = async () => {
  await database.write(async () => {
    await database.batch(
      feeds.map((feed) => {
        return database.get<Feed>(TableName.FEEDS).prepareCreateFromDirtyRaw(feed)
      })
    )
  })

  console.log(`Feeds table seeded with ${feeds.length} records.`)
}

export default FeedSeeder

import { FeedFields } from '@/components/forms/FeedForm'
import database from '@/database'
import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'

export const createFeed = async (data: FeedFields) => {
  const createdFeed = await database.write(async () => {
    return await database.collections
      .get<Feed>(TableName.FEEDS)
      .create((model) => {
        model.name = data.name
        model.feedType = data.feedType
      })
  })

  return createdFeed
}

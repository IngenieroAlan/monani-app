import { FeedFields } from '@/components/forms/FeedForm'
import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'

const useFeeds = () => {
  const database = useDatabase()

  const getFeeds = async () => {
    return await database.collections
      .get<Feed>(TableName.FEEDS)
      .query(Q.sortBy('name', Q.asc))
      .fetch()
  }

  const createFeed = async (data: FeedFields) => {
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

  const updateFeed = async (feedToUpdate: Feed, data: FeedFields) => {
    const updatedFeed = await database.write(async () => {
      return feedToUpdate.update(feed => {
        feed.name = data.name
        feed.feedType = data.feedType
      })
    })

    return updatedFeed
  }

  const deleteFeed = async (feed: Feed) => {
    await database.write(async () => {
      await feed.destroyPermanently()
    })
  }

  return {
    getFeeds,
    createFeed,
    updateFeed,
    deleteFeed
  }
}

export default useFeeds

import Feed from '@/database/models/Feed'
import { feedsKey } from '@/queries/feeds/queryKeyFactory'
import { withObservables } from '@nozbe/watermelondb/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { List } from 'react-native-paper'
import { FeedsListItemMenu } from './FeedsListItemMenu'

const withObserver = withObservables(['feed'], ({ feed }: { feed: Feed }) => ({ feed }))

export const FeedsListItem = withObserver(({ feed }: { feed: Feed }) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryData(feedsKey.byId(feed.id), feed)
  }, [feed.id])

  return (
    <List.Item
      title={feed.name}
      description={feed.feedType}
      right={() => <FeedsListItemMenu feed={feed} />}
      style={{ paddingRight: 4 }}
    />
  )
})

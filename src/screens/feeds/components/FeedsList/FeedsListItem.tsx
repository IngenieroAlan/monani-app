import Feed from '@/database/models/Feed'
import { withObservables } from '@nozbe/watermelondb/react'
import { List } from 'react-native-paper'
import { FeedsListItemMenu } from './FeedsListItemMenu'

const withObserver = withObservables(['feed'], ({ feed }: { feed: Feed }) => ({ feed }))

export const FeedsListItem = withObserver(({ feed }: { feed: Feed }) => {
  return (
    <List.Item
      title={feed.name}
      description={feed.feedType}
      right={() => <FeedsListItemMenu feed={feed} />}
      style={{ paddingRight: 4 }}
    />
  )
})

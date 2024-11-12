import DietFeed, { FeedProportion } from '@/database/models/DietFeed'
import { TableName } from '@/database/schema'
import useFeeds from '@/hooks/collections/useFeeds'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo, useCallback, useState } from 'react'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const observeDietFeed = withObservables([TableName.DIET_FEED], ({ diet_feed }: { diet_feed: DietFeed }) => ({
  diet_feed
}))

const ListItemMenu = (
  { dietFeedId, onEdit, onDelete }: {
    dietFeedId: string,
    onEdit: (dietFeedId: string) => void,
    onDelete: (dietFeedId: string) => void
  }
) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {
          onEdit(dietFeedId)
          setMenuVisible(false);
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          onDelete(dietFeedId)
          setMenuVisible(false);
        }}
      />
    </Menu>
  )
}

type DietFeedProps = {
  diet_feed: DietFeed,
  onEdit: (dietFeedId: string) => void,
  onDelete: (dietFeedId: string) => void
}

const DietFeedItem = observeDietFeed(({ diet_feed, onEdit, onDelete }: DietFeedProps) => {
  const { feeds } = useFeeds()
  const findFeedName = useCallback((feedId: string) => feeds.find(feed => feed.id === feedId)?.name || '', [feeds])
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={findFeedName(diet_feed.feed.id)}
      description={diet_feed.feedProportion === 'Por porcentaje' ? `${diet_feed.percentage}%` : `${diet_feed.feedAmount} kg`}
      right={() => (
        <ListItemMenu
          dietFeedId={diet_feed.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  )
})

export default memo(DietFeedItem)

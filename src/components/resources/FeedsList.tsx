import DietFeed from '@/database/models/DietFeed'
import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { memo, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

type FeedsCount = { feed_id: string }

const ListItemMenu = ({ feedId, feedsCount }: { feedId: string; feedsCount: FeedsCount[] }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(false)
  const [canDelete, setCanDelete] = useState(true)

  useEffect(() => {
    const index = feedsCount.findIndex((item) => item.feed_id === feedId)

    setCanDelete(index === -1)
  }, [feedId, feedsCount])

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {}}
      />
      <Menu.Item
        theme={{ colors: { onSurface: canDelete ? theme.colors.onSurface : theme.colors.onSurfaceDisabled } }}
        title='Eliminar'
        leadingIcon={() => (
          <Icon
            size={24}
            source='trash-can-outline'
            color={canDelete ? theme.colors.onSurface : theme.colors.onSurfaceDisabled}
          />
        )}
        onPress={() => {
          if (!canDelete) {
            dispatch(show('feedInUseSnackbar'))
          } else {
          }
        }}
      />
    </Menu>
  )
}

const ListItem = ({ feed, feedsCount }: { feed: Feed; feedsCount: FeedsCount[] }) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={feed.name}
      description={feed.feedType}
      right={() => (
        <ListItemMenu
          feedId={feed.id}
          feedsCount={feedsCount}
        />
      )}
    />
  )
}

const FeedsList = ({ fetchFeeds, setFetchFeeds }: { fetchFeeds: boolean; setFetchFeeds: (bool: boolean) => void }) => {
  const database = useDatabase()
  const [feeds, setFeeds] = useState<Feed[]>([])
  const feedsCount = useRef<FeedsCount[]>([])

  useEffect(() => {
    const fetchFeeds = async () => {
      setFeeds(
        await database.collections.get<Feed>(TableName.FEEDS).query(
          Q.sortBy('name', Q.asc),
        ).fetch()
      )
    }

    fetchFeeds()
    setFetchFeeds(false)
  }, [fetchFeeds])

  useEffect(() => {
    const fetchCount = async () => {
      feedsCount.current = (await database.collections
        .get<DietFeed>(TableName.DIET_FEED)
        .query(Q.unsafeSqlQuery('SELECT feed_id from diet_feed GROUP BY feed_id'))
        .unsafeFetchRaw()) as FeedsCount[]
    }

    fetchCount()
  }, [])

  return (
    <FlatList
      data={feeds}
      renderItem={({ item }) => (
        <ListItem
          feed={item}
          feedsCount={feedsCount.current}
        />
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(FeedsList)

import DietFeed from '@/database/models/DietFeed'
import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setFetchFeeds, setSelectedFeed } from '@/redux/slices/resourcesSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { Q } from '@nozbe/watermelondb'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import { forwardRef, memo, Ref, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DELETE_FEED_DIALOG_ID } from './DeleteFeedDialog'
import { EDIT_FEED_DIALOG_ID } from './EditFeedDialog'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

type FeedsCount = { feed_id: string }

const observeFeed = withObservables(['feed'], ({ feed }: { feed: Feed }) => ({
  feed
}))

const ListItemMenu = ({ feed, feedsCount }: { feed: Feed; feedsCount: FeedsCount[] }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [canDelete, setCanDelete] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    const index = feedsCount.findIndex((item) => item.feed_id === feed.id)

    setCanDelete(index === -1)
  }, [feed, feedsCount])

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
          dispatch(setSelectedFeed(feed))
          dispatch(show(EDIT_FEED_DIALOG_ID))
          setMenuVisible(false)
        }}
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
            dispatch(show(ResourcesSnackbarId.FEED_IN_USE))
            return
          }

          dispatch(setSelectedFeed(feed))
          dispatch(show(DELETE_FEED_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}

const ListItem = memo(
  observeFeed(({ feed, feedsCount }: { feed: Feed; feedsCount: FeedsCount[] }) => (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={feed.name}
      description={feed.feedType}
      right={() => (
        <ListItemMenu
          feed={feed}
          feedsCount={feedsCount}
        />
      )}
    />
  ))
)

const FeedsList = (
  { onScroll }: { onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void },
  ref: Ref<FlatList>
) => {
  const database = useDatabase()
  const dispatch = useAppDispatch()
  const fetchFeeds = useAppSelector((state: RootState) => state.resources.fetchFeeds)
  const [feeds, setFeeds] = useState<Feed[]>([])
  const feedsCount = useRef<FeedsCount[]>([])

  useEffect(() => {
    const fetchFeeds = async () => {
      setFeeds(await database.collections.get<Feed>(TableName.FEEDS).query(Q.sortBy('name', Q.asc)).fetch())
      dispatch(setFetchFeeds(false))
    }

    fetchFeeds()
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
      ref={ref}
      onScroll={onScroll}
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

export default forwardRef(FeedsList)

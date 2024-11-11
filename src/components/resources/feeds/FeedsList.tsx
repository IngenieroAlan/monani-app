import Feed from '@/database/models/Feed'
import useFeeds from '@/hooks/collections/useFeeds'
import { useAppDispatch } from '@/hooks/useRedux'
import { setSelectedFeed } from '@/redux/slices/feedsSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import { memo, useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DELETE_FEED_DIALOG_ID } from './DeleteFeedDialog'
import { EDIT_FEED_DIALOG_ID } from './EditFeedDialog'
import { FeedsSnackbarId } from './FeedsSnackbarContainer'

const observeFeed = withObservables(['feed'], ({ feed }: { feed: Feed }) => ({
  feed
}))

const ListItemMenu = ({ feed }: { feed: Feed }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [canDelete, setCanDelete] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    const fetchDiets = async () => {
      const diets = await feed.diets
      setCanDelete(diets.length === 0)
    }
    fetchDiets()
  }, [feed])

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
            dispatch(show(FeedsSnackbarId.FEED_IN_USE))
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

const ListItem = observeFeed(({ feed }: { feed: Feed }) => {
  return (
    <List.Item
      style={{ paddingRight: 4 }}
      title={feed.name}
      description={feed.feedType}
      right={() => <ListItemMenu feed={feed} />}
    />
  )
})

const FeedsList = ({ onScroll }: { onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void }) => {
  const { feeds } = useFeeds()

  return (
    <FlashList
      estimatedItemSize={81}
      onScroll={onScroll}
      data={feeds}
      renderItem={({ item }) => <ListItem feed={item} />}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(FeedsList)

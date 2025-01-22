import DietFeed from '@/database/models/DietFeed'
import { useAppDispatch } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo, useState } from 'react'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DietSnackbarId } from './DietSnackbarContainer'

const withDietFeedObserver = withObservables(['diet_feed'], ({ diet_feed }: { diet_feed: DietFeed }) => ({
  diet_feed
}))

const ListItemMenu = ({
  dietFeedId,
  onEdit,
  onDelete
}: {
  dietFeedId: string
  onEdit: (dietFeedId: string) => void
  onDelete: (dietFeedId: string) => void
}) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)
  const dispatch = useAppDispatch()

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
          setMenuVisible(false)
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          onDelete(dietFeedId)
          dispatch(show(DietSnackbarId.REMOVED_DIETFEED))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}

type DietFeedProps = {
  diet_feed: DietFeed
  onEdit: (dietFeedId: string) => void
  onDelete: (dietFeedId: string) => void
  findFeedName: (feedId: string) => string
}

const DietFeedItem = withDietFeedObserver(({ diet_feed, onEdit, onDelete, findFeedName }: DietFeedProps) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={findFeedName(diet_feed.feed.id)}
      description={
        diet_feed.feedProportion === 'Por porcentaje' ? `${diet_feed.percentage}%` : `${diet_feed.feedAmount} kg`
      }
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

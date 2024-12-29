import { useFeedContext } from '@/contexts'
import Feed from '@/database/models/Feed'
import { useAppDispatch } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import useAppTheme from '@/theme'
import { memo, useEffect, useState } from 'react'
import { Icon, IconButton, Menu } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DELETE_FEED_DIALOG_ID } from '../DeleteFeedDialog'
import { EDIT_FEED_DIALOG_ID } from '../EditFeedDialog'
import { FeedsSnackbarId } from '../FeedsSnackbarContainer'

export const FeedsListItemMenu = memo(({ feed }: { feed: Feed }) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const { setValue: setFeedContext } = useFeedContext()
  const [canDelete, setCanDelete] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const diets = await feed.diets
      setCanDelete(diets.length === 0)
    })()
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
          setFeedContext(feed)
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

          setFeedContext(feed)
          dispatch(show(DELETE_FEED_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
})

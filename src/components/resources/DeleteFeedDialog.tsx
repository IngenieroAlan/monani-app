import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setFetchFeeds } from '@/redux/slices/resourcesSlice'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useCallback, useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

export const DELETE_FEED_DIALOG_ID = 'deleteFeedDialog'

const DeleteFeedDialog = () => {
  const database = useDatabase()
  const dispatch = useAppDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const selectedFeed = useAppSelector((state: RootState) => state.resources.selectedFeed)
  const deleteFeedVisible = useAppSelector((state: RootState) => state.uiVisibility[DELETE_FEED_DIALOG_ID])

  const onDelete = useCallback(async () => {
    setIsDeleting(true)

    await database.write(async () => {
      await selectedFeed?.destroyPermanently()
    })

    dispatch(setFetchFeeds(true))
    setIsDeleting(false)

    dispatch(hide(DELETE_FEED_DIALOG_ID))
    dispatch(show(ResourcesSnackbarId.DELETED_FEED))
  }, [selectedFeed])

  return (
    <Portal>
      <Dialog
        visible={deleteFeedVisible}
        dismissable={false}
        onDismiss={() => dispatch(hide(DELETE_FEED_DIALOG_ID))}
      >
        <Dialog.Icon icon='delete-outline' />
        <Dialog.Title style={{ textAlign: 'center' }}>¿Eliminar alimento?</Dialog.Title>
        <Dialog.Content>
          <Text>
            El alimento seleccionado será eliminado y ya no podrá ser usado en ninguna dieta.
            <Text style={{ fontWeight: 'bold' }}> Esta acción es irreversible</Text>, ¿deseas continuar?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => dispatch(hide(DELETE_FEED_DIALOG_ID))}>Cancelar</Button>
          <Button
            disabled={isDeleting}
            onPress={onDelete}
          >
            Eliminar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default DeleteFeedDialog

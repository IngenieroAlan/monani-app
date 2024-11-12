import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useCallback, useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { FeedsSnackbarId } from './FeedsSnackbarContainer'

export const DELETE_FEED_DIALOG_ID = 'deleteFeedDialog'

const DeleteFeedDialog = () => {
  const dispatch = useAppDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const selectedFeed = useAppSelector((state: RootState) => state.feeds.selectedFeed)
  const deleteFeedVisible = useAppSelector((state: RootState) => state.uiVisibility[DELETE_FEED_DIALOG_ID])

  const onDelete = useCallback(async () => {
    setIsDeleting(true)
    await selectedFeed?.delete()
    setIsDeleting(false)

    dispatch(hide(DELETE_FEED_DIALOG_ID))
    dispatch(show(FeedsSnackbarId.DELETED_FEED))
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

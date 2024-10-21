import Feed from '@/database/models/Feed'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useCallback, useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

export const DELETE_FEED_DIALOG_ID = 'deleteFeedDialog'

const DeleteFeedDialog = ({ feed, setFetchFeeds }: { feed?: Feed; setFetchFeeds: (bool: boolean) => void }) => {
  const database = useDatabase()
  const dispatch = useDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const createFeedVisible = useSelector((state: RootState) => state.uiVisibility[DELETE_FEED_DIALOG_ID])

  const onDelete = useCallback(async () => {
    setIsDeleting(true)

    await database.write(async () => {
      await feed?.destroyPermanently()
    })

    setFetchFeeds(true)
    setIsDeleting(false)

    dispatch(hide(DELETE_FEED_DIALOG_ID))
    dispatch(show(ResourcesSnackbarId.DELETED_FEED))
  }, [feed])

  return (
    <Portal>
      <Dialog
        visible={createFeedVisible}
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

import { useFeedContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { feedsKeys } from '@/queries/feeds/queryKeyFactory'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { FeedsSnackbarId } from './FeedsSnackbarContainer'

export const DELETE_FEED_DIALOG_ID = 'deleteFeedDialog'

const DeleteFeedDialog = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const feedContext = useFeedContext()
  const deleteFeedVisible = useAppSelector((state) => state.uiVisibility[DELETE_FEED_DIALOG_ID])
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => feedContext.value?.delete() ?? Promise.resolve(undefined),
    onSuccess: () => {
      if (!feedContext.value) return

      queryClient.invalidateQueries({ queryKey: feedsKeys.all, exact: true })
      queryClient.removeQueries({ queryKey: feedsKeys.byId(feedContext.value.id) })
    }
  })

  const onDelete = async () => {
    await mutateAsync()

    dispatch(hide(DELETE_FEED_DIALOG_ID))
    dispatch(show(FeedsSnackbarId.DELETED_FEED))
  }

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
            loading={isPending}
            disabled={isPending}
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

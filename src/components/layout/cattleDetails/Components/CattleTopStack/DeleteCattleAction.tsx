import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { Appbar, Button, Dialog, Portal, Snackbar, Text } from 'react-native-paper'

const DeleteCattleAction = () => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)
  const [showDialog, setShowDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = useCallback(async () => {
    setIsDeleting(true)
    await cattle?.delete()
    navigation.goBack()
    dispatch(show('DeletedCattleSnackbar'))
  }, [])

  return (
    <>
      <Appbar.Action
        icon='trash-can-outline'
        onPress={() => setShowDialog(true)}
      />
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          dismissable
        >
          <Dialog.Icon icon='delete-forever-outline' />
          <Dialog.Title style={{ textAlign: 'center' }}>¿Eliminar ganado?</Dialog.Title>
          <Dialog.Content>
            <Text>
              Al eliminar la información del ganado, todos sus datos se perderán y no podrán ser recuperados.
              <Text style={{ fontWeight: 'bold' }}> Esta acción es irreversible</Text>, ¿deseas continuar?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancelar</Button>
            <Button
              loading={isDeleting}
              disabled={isDeleting}
              onPress={onDelete}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default DeleteCattleAction

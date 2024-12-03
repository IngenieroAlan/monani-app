import { useMedicationContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useCallback, useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const DELETE_MEDICATION_DIALOG_ID = 'deleteMedicationDialog'

const DeleteMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const medicationContext = useMedicationContext()
  const visible = useAppSelector((state: RootState) => state.uiVisibility[DELETE_MEDICATION_DIALOG_ID])

  const onDelete = useCallback(async () => {
    setIsDeleting(true)
    await medicationContext.value?.delete()
    setIsDeleting(false)

    dispatch(hide(DELETE_MEDICATION_DIALOG_ID))
    dispatch(show(MedicationsSnackbarId.DELETED_MEDICATION))
    medicationContext.setValue(undefined)
  }, [medicationContext])

  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={false}
        onDismiss={() => dispatch(hide(DELETE_MEDICATION_DIALOG_ID))}
      >
        <Dialog.Icon icon='delete-outline' />
        <Dialog.Title style={{ textAlign: 'center' }}>¿Eliminar medicamento?</Dialog.Title>
        <Dialog.Content>
          <Text>
            El medicamento seleccionado será eliminado y ya no podrá ser usado de manera alguna.
            <Text style={{ fontWeight: 'bold' }}> Esta acción es irreversible</Text>, ¿deseas continuar?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => dispatch(hide(DELETE_MEDICATION_DIALOG_ID))}>Cancelar</Button>
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
  )
}

export default DeleteMedicationDialog

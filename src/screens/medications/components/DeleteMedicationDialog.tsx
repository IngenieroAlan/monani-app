import { useMedicationContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { medicationsKeys } from '@/queries/medications/queryKeyFactory'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const DELETE_MEDICATION_DIALOG_ID = 'deleteMedicationDialog'

const DeleteMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const medicationContext = useMedicationContext()
  const visible = useAppSelector((state) => state.uiVisibility[DELETE_MEDICATION_DIALOG_ID])
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => medicationContext.value?.delete() ?? Promise.resolve(undefined),
    onSuccess: () => {
      if (!medicationContext.value) return

      queryClient.invalidateQueries({ queryKey: medicationsKeys.all, exact: true })
      queryClient.removeQueries({ queryKey: medicationsKeys.byId(medicationContext.value.id) })
    }
  })

  const onDelete = async () => {
    await mutateAsync()

    dispatch(hide(DELETE_MEDICATION_DIALOG_ID))
    dispatch(show(MedicationsSnackbarId.DELETED_MEDICATION))
    medicationContext.setValue(undefined)
  }

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

export default DeleteMedicationDialog

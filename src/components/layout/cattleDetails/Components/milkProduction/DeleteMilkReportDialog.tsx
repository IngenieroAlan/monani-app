import { useMilkReportContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide } from '@/redux/slices/uiVisibilitySlice'
import { useCallback, useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'

export const DELETE_MILK_REPORT_DIALOG_ID = 'deleteMilkReportDialog'

const DeleteMilkReportDialog = () => {
  const dispatch = useAppDispatch()
  const milkReportContext = useMilkReportContext()
  const dialogVisible = useAppSelector((state) => state.uiVisibility[DELETE_MILK_REPORT_DIALOG_ID])
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = useCallback(async () => {
    setIsDeleting(true)
    await milkReportContext.value?.delete()
    setIsDeleting(false)

    milkReportContext.setValue(undefined)

    dispatch(hide(DELETE_MILK_REPORT_DIALOG_ID))
    // TODO: Add deleted milk report snackbar.
  }, [milkReportContext])

  return (
    <Portal>
      <Dialog visible={dialogVisible}>
        <Dialog.Icon icon='delete-outline' />
        <Dialog.Title style={{ textAlign: 'center' }}>¿Eliminar reporte de leche?</Dialog.Title>
        <Dialog.Content>
          <Text>
            El reporte de leche será eliminado.
            <Text style={{ fontWeight: 'bold' }}> Esta acción es irreversible</Text>, ¿deseas continuar?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => dispatch(hide(DELETE_MILK_REPORT_DIALOG_ID))}>Cancelar</Button>
          <Button
            disabled={isDeleting}
            loading={isDeleting}
            onPress={onDelete}
          >
            Eliminar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default DeleteMilkReportDialog

import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useCallback } from 'react'
import { Button, Dialog, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { DISMISS_SNACKBAR_ID } from './SnackbarContainer'

const DismissDialog = (props: {
  id: string
  snackbarOnDismiss?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state: RootState) => state.uiVisibility[props.id])

  const onCancel = useCallback(() => {
    if (props.onCancel) props.onCancel()

    dispatch(hide(props.id))
  }, [props.onCancel])

  const onConfirm = useCallback(() => {
    if (props.onConfirm) props.onConfirm()

    props.snackbarOnDismiss && dispatch(show(DISMISS_SNACKBAR_ID))
    dispatch(hide(props.id))
  }, [props.onConfirm])

  return (
    <Dialog
      dismissable={false}
      visible={visible}
      onDismiss={onCancel}
    >
      <Dialog.Icon icon='cancel' />
      <Dialog.Title style={{ textAlign: 'center' }}>¿Descartar cambios?</Dialog.Title>
      <Dialog.Content>
        <Text>Los cambios realizados aún no han sido guardados y se descartarán, ¿deseas continuar?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onCancel}>Cancelar</Button>
        <Button onPress={onConfirm}>Aceptar</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default DismissDialog

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { useCallback } from 'react'
import { Button, Dialog, Text } from 'react-native-paper'
import { DISMISS_SNACKBAR_ID } from './SnackbarContainer'

const DismissDialog = (props: {
  id?: string
  snackbarOnDismiss?: boolean
  visible?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}) => {
  const dispatch = useAppDispatch()
  const visible = useAppSelector((state) => state.uiVisibility[props.id || ''])

  const onCancel = useCallback(() => {
    if (props.onCancel) props.onCancel()

    if (props.id) dispatch(hide(props.id))
  }, [props.onCancel])

  const onConfirm = useCallback(() => {
    if (props.onConfirm) props.onConfirm()

    props.snackbarOnDismiss && dispatch(show(DISMISS_SNACKBAR_ID))
    if (props.id) dispatch(hide(props.id))
  }, [props.onConfirm])

  return (
    <Dialog
      dismissable={false}
      visible={props.visible || visible}
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

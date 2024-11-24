import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useCallback, useState } from 'react'
import { Appbar, Button, Dialog, Portal, Text } from 'react-native-paper'
import { InfoSnackbarId } from './CattleStackSnackbarContainer'

const UnarchiveCattleAction = () => {
  const dispatch = useAppDispatch()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onUnarchive = useCallback(async () => {
    setIsLoading(true)

    await cattle?.unarchive()

    dispatch(show(InfoSnackbarId.CATTLE_UNARCHIVED))
    setShowDialog(false)
  }, [cattle])

  return (
    <>
      <Appbar.Action
        icon='archive-arrow-up-outline'
        onPress={() => setShowDialog(true)}
      />
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          dismissable
        >
          <Dialog.Icon icon='archive-arrow-up-outline' />
          <Dialog.Title style={{ textAlign: 'center' }}>¿Desarchivar ganado?</Dialog.Title>
          <Dialog.Content>
            <Text>
              Al realizar esta acción la información relacionada con el ganado volverá a ser editable, ¿deseas
              continuar?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancelar</Button>
            <Button
            loading={isLoading}
            disabled={isLoading}
            onPress={onUnarchive}
            >
              Desarchivar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default UnarchiveCattleAction

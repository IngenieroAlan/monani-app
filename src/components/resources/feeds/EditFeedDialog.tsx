import { useFeedContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import DismissDialog from '../../DismissDialog'
import FeedForm, { FeedFields } from '../../forms/FeedForm'
import { FeedsSnackbarId } from './FeedsSnackbarContainer'

export const EDIT_FEED_DIALOG_ID = 'editFeedDialog'

const DISMISS_DIALOG_ID = 'editFeedDismissDialog'

const EditFeedDialog = () => {
  const dispatch = useAppDispatch()
  const dialogVisible = useAppSelector((state: RootState) => state.uiVisibility[EDIT_FEED_DIALOG_ID])
  const feedContext = useFeedContext()
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<FeedFields>({
    resolver: zodResolver(FeedSchema),
    mode: 'onTouched'
  })
  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => {
    if (!feedContext.value) return

    reset({
      name: feedContext.value.name,
      feedType: feedContext.value.feedType
    })
  }, [feedContext])

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()
    feedContext.setValue(undefined)

    clearErrors()
    dispatch(hide(EDIT_FEED_DIALOG_ID))
  }, [feedContext])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(EDIT_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(
    async (data: FeedFields) => {
      await feedContext.value?.updateFeed(data)

      dispatch(show(FeedsSnackbarId.UPDATED_FEED))
      dismissChanges()
    },
    [feedContext]
  )

  return (
    <Portal>
      <Dialog
        dismissable={!isDirty}
        visible={dialogVisible}
        onDismiss={dismissChanges}
      >
        <Dialog.Title>Editar alimento</Dialog.Title>
        <Dialog.Content>
          <FeedForm
            control={control}
            formState={formState}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => (isDirty ? showDismissDialog() : dismissChanges())}>Cancelar</Button>
          <Button
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || !isDirty}
            onPress={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
      <DismissDialog
        id={DISMISS_DIALOG_ID}
        dismissSnackbarId={FeedsSnackbarId.FEED_DISMISS}
        onConfirm={dismissChanges}
        onCancel={() => dispatch(show(EDIT_FEED_DIALOG_ID))}
      />
    </Portal>
  )
}

export default memo(EditFeedDialog)

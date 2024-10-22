import useFeeds from '@/hooks/collections/useFeeds'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addFeed } from '@/redux/slices/feedsSlice'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import DismissDialog from '../../DismissDialog'
import FeedForm, { FeedFields } from '../../forms/FeedForm'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

export const CREATE_FEED_DIALOG_ID = 'createFeedDialog'

const DISMISS_DIALOG_ID = 'createFeedDismissDialog'

const CreateFeedDialog = () => {
  const dispatch = useAppDispatch()
  const { createFeed } = useFeeds()
  const dialogVisible = useAppSelector((state: RootState) => state.uiVisibility[CREATE_FEED_DIALOG_ID])
  const { control, handleSubmit, reset, formState } = useForm<FeedFields>({
    defaultValues: {
      name: '',
      feedType: undefined
    },
    resolver: zodResolver(FeedSchema),
    mode: 'onChange'
  })
  const { isDirty, isValid, isSubmitting } = formState

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()

    reset()
    dispatch(hide(CREATE_FEED_DIALOG_ID))
  }, [])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(CREATE_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(async (data: FeedFields) => {
    dispatch(addFeed(await createFeed(data)))

    dispatch(show(ResourcesSnackbarId.STORED_FEED))
    dismissChanges()
  }, [])

  return (
    <Portal>
      <Dialog
        dismissable={!isDirty}
        visible={dialogVisible}
        onDismiss={dismissChanges}
      >
        <Dialog.Title>Agregar alimento</Dialog.Title>
        <Dialog.Content>
          <FeedForm
            control={control}
            formState={formState}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => (isDirty ? showDismissDialog() : dismissChanges())}>Cancelar</Button>
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            onPress={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
      <DismissDialog
        id={DISMISS_DIALOG_ID}
        snackbarOnDismiss
        onConfirm={dismissChanges}
        onCancel={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
      />
    </Portal>
  )
}

export default memo(CreateFeedDialog)

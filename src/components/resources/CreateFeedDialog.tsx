import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setFetchFeeds } from '@/redux/slices/resourcesSlice'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDatabase } from '@nozbe/watermelondb/react'
import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { z } from 'zod'
import DismissDialog from '../DismissDialog'
import FeedForm from '../forms/FeedForm'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

export const CREATE_FEED_DIALOG_ID = 'createFeedDialog'

const DISMISS_DIALOG_ID = 'createFeedDismissDialog'
type FeedFields = z.infer<typeof FeedSchema>

const CreateFeedDialog = () => {
  const database = useDatabase()
  const dispatch = useAppDispatch()
  const dialogVisible = useAppSelector((state: RootState) => state.uiVisibility[CREATE_FEED_DIALOG_ID])
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<FeedFields>({
    defaultValues: {
      name: '',
      feedType: undefined
    },
    resolver: zodResolver(FeedSchema),
    mode: 'onTouched'
  })
  const { isDirty, isValid, isSubmitting } = formState

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()

    clearErrors()
    reset()
    dispatch(hide(CREATE_FEED_DIALOG_ID))
  }, [])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(CREATE_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(async (data: FeedFields) => {
    await database.write(async () => {
      const newFeed = await database.collections.get<Feed>(TableName.FEEDS).create((feed) => {
        feed.name = data.name
        feed.feedType = data.feedType
      })

      dispatch(show(ResourcesSnackbarId.STORED_FEED))
    })

    dismissChanges()

    // Refresh feeds list.
    dispatch(setFetchFeeds(true))
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

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setFetchFeeds, setSelectedFeed } from '@/redux/slices/resourcesSlice'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDatabase } from '@nozbe/watermelondb/react'
import { memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { z } from 'zod'
import DismissDialog from '../DismissDialog'
import FeedForm from '../forms/FeedForm'
import { ResourcesSnackbarId } from './ResourcesSnackbarContainer'

export const EDIT_FEED_DIALOG_ID = 'editFeedDialog'

type FeedFields = z.infer<typeof FeedSchema>
const DISMISS_DIALOG_ID = 'editFeedDismissDialog'

const EditFeedDialog = () => {
  const database = useDatabase()
  const dispatch = useAppDispatch()
  const dialogVisible = useAppSelector((state: RootState) => state.uiVisibility[EDIT_FEED_DIALOG_ID])
  const selectedFeed = useAppSelector((state: RootState) => state.resources.selectedFeed)
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<FeedFields>({
    defaultValues: {
      name: selectedFeed?.name ? selectedFeed.name : '',
      feedType: selectedFeed?.feedType ? selectedFeed.feedType : undefined
    },
    resolver: zodResolver(FeedSchema),
    mode: 'onTouched'
  })

  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => {
    reset({
      name: selectedFeed?.name,
      feedType: selectedFeed?.feedType
    })
  }, [selectedFeed])

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()
    dispatch(setSelectedFeed(undefined))

    clearErrors()
    reset()
    dispatch(hide(EDIT_FEED_DIALOG_ID))
  }, [])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(EDIT_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(
    async (data: FeedFields) => {
      await database.write(async () => {
        await selectedFeed?.update((feed) => {
          feed.name = data.name
          feed.feedType = data.feedType
        })

        dispatch(show(ResourcesSnackbarId.UPDATED_FEED))
      })

      dismissChanges()

      // Refresh feeds list.
      dispatch(setFetchFeeds(true))
    },
    [selectedFeed]
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
        onCancel={() => dispatch(show(EDIT_FEED_DIALOG_ID))}
      />
    </Portal>
  )
}

export default memo(EditFeedDialog)

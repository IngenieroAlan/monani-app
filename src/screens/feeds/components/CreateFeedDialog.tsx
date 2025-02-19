import DismissDialog from '@/components/DismissDialog'
import FeedForm, { FeedFields } from '@/components/forms/FeedForm'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { feedsKeys } from '@/queries/feeds/queryKeyFactory'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { createFeed } from '@/utils/collections/feeds'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { FeedsSnackbarId } from './FeedsSnackbarContainer'

export const CREATE_FEED_DIALOG_ID = 'createFeedDialog'

const DISMISS_DIALOG_ID = 'createFeedDismissDialog'

const CreateFeedDialog = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const dialogVisible = useAppSelector((state) => state.uiVisibility[CREATE_FEED_DIALOG_ID])
  const { control, handleSubmit, reset, formState } = useForm<FeedFields>({
    defaultValues: {
      name: '',
      feedType: undefined
    },
    resolver: zodResolver(FeedSchema),
    mode: 'onChange'
  })
  const { isDirty, isValid, isSubmitting } = formState
  const { mutateAsync } = useMutation({
    mutationFn: (data: FeedFields) => createFeed(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: feedsKeys.all,
        exact: true
      })
      queryClient.setQueryData(feedsKeys.byId(data.id), data)
    }
  })

  const dismissChanges = () => {
    Keyboard.dismiss()

    reset()
    dispatch(hide(CREATE_FEED_DIALOG_ID))
  }

  const showDismissDialog = () => {
    dispatch(hide(CREATE_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }

  const onSubmit = async (data: FeedFields) => {
    await mutateAsync(data)

    dispatch(show(FeedsSnackbarId.STORED_FEED))
    dismissChanges()
  }

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
        onCancel={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
      />
    </Portal>
  )
}

export default memo(CreateFeedDialog)

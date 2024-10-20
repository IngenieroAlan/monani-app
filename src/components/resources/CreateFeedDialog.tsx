import Feed, { FeedType } from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Dialog, Menu, Portal, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import DismissDialog, { DISMISS_DIALOG_ID } from '../DismissDialog'
import Dropdown from '../Dropdown'

type FeedFields = z.infer<typeof FeedSchema>

export const CREATE_FEED_DIALOG_ID = 'createFeedDialog'
const dropdownOptions: FeedType[] = ['Alimento', 'Concentrado lechero', 'Concentrado de engorda']

const CreateFeedDialog = ({ setFetchFeeds }: { setFetchFeeds: (bool: boolean) => void }) => {
  const theme = useTheme()
  const database = useDatabase()
  const dispatch = useDispatch()
  const createFeedVisible = useSelector((state: RootState) => state.uiVisibility[CREATE_FEED_DIALOG_ID])
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid }
  } = useForm<FeedFields>({
    defaultValues: {
      name: '',
      feedType: undefined
    },
    resolver: zodResolver(FeedSchema),
    mode: 'onTouched'
  })

  const dismissChanges = () => {
    dispatch(hide(CREATE_FEED_DIALOG_ID))
    reset()
  }

  const showDismissDialog = () => {
    dispatch(hide(CREATE_FEED_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }

  const onSubmit = async (data: FeedFields) => {
    await database.write(async () => {
      await database.collections.get<Feed>(TableName.FEEDS).create((feed) => {
        feed.name = data.name
        feed.feedType = data.feedType
      })
    })

    dismissChanges()
    dispatch(show('feedStoredSnackbar'))

    // Refresh feeds list.
    setFetchFeeds(true)
  }

  console.log('Rendering dialog')

  return (
    <Portal>
      <Dialog
        dismissable={!isDirty}
        visible={createFeedVisible}
        onDismiss={dismissChanges}
      >
        <Dialog.Title>Agregar alimento</Dialog.Title>
        <Dialog.Content>
          <View style={{ gap: 16 }}>
            <CustomTextInput
              label='Nombre*'
              helperText={errors.name?.message ? errors.name?.message : ''}
              errors={errors.name}
              name='name'
              control={control}
              more={{
                theme: { colors: { background: theme.colors.elevation.level3 } }
              }}
            />
            <Controller
              name='feedType'
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Dropdown
                    value={value}
                    label='Tipo de alimento*'
                    error={errors.feedType?.message}
                    options={dropdownOptions}
                    renderOption={({ item }) => (
                      <Menu.Item
                        title={item}
                        onPress={() => onChange(item)}
                      />
                    )}
                    textInputProps={{ theme: { colors: { background: theme.colors.elevation.level3 } } }}
                  />
                )
              }}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => (isDirty ? showDismissDialog() : dismissChanges())}>Cancelar</Button>
          <Button
            disabled={isSubmitting || !isValid}
            onPress={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
      <DismissDialog
        onConfirm={dismissChanges}
        onCancel={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
      />
    </Portal>
  )
}

export default CreateFeedDialog

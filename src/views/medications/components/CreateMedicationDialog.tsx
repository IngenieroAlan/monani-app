import DismissDialog from '@/components/DismissDialog'
import MedicationForm, { MedicationFields } from '@/components/forms/MedicationForm'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { createMedication } from '@/utils/collections/medications'
import MedicationSchema from '@/validationSchemas/MedicationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const CREATE_MEDICATION_DIALOG_ID = 'createMedicationDialog'

const DISMISS_DIALOG_ID = 'createMedicationDismissDialog'

const CreateMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const dialogVisible = useAppSelector((state: RootState) => state.uiVisibility[CREATE_MEDICATION_DIALOG_ID])
  const { control, handleSubmit, reset, formState } = useForm<MedicationFields>({
    defaultValues: {
      name: '',
      medicationType: undefined
    },
    resolver: zodResolver(MedicationSchema),
    mode: 'onChange'
  })
  const { isDirty, isValid, isSubmitting } = formState

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()

    reset()
    dispatch(hide(CREATE_MEDICATION_DIALOG_ID))
  }, [])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(CREATE_MEDICATION_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(async (data: MedicationFields) => {
    await createMedication(data)

    dispatch(show(MedicationsSnackbarId.STORED_MEDICATION))
    dismissChanges()
  }, [])

  return (
    <Portal>
      <Dialog
        dismissable={!isDirty}
        visible={dialogVisible}
        onDismiss={dismissChanges}
      >
        <Dialog.Title>Agregar medicamento</Dialog.Title>
        <Dialog.Content>
          <MedicationForm
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
        dismissSnackbarId={MedicationsSnackbarId.MEDICATION_DISMISS}
        onConfirm={dismissChanges}
        onCancel={() => dispatch(show(CREATE_MEDICATION_DIALOG_ID))}
      />
    </Portal>
  )
}

export default CreateMedicationDialog

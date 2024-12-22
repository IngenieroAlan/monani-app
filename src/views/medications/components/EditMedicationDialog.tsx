import DismissDialog from '@/components/DismissDialog'
import MedicationForm, { MedicationFields } from '@/components/forms/MedicationForm'
import { useMedicationContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import MedicationSchema from '@/validationSchemas/MedicationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const EDIT_MEDICATION_DIALOG_ID = 'editMedicationDialog'

const DISMISS_DIALOG_ID = 'editMedicationDismissDialog'

const EditMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const medicationContext = useMedicationContext()
  const visible = useAppSelector((state: RootState) => state.uiVisibility[EDIT_MEDICATION_DIALOG_ID])
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<MedicationFields>({
    resolver: zodResolver(MedicationSchema),
    mode: 'onTouched'
  })
  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => {
    if (!medicationContext.value) return

    reset({
      name: medicationContext.value.name,
      medicationType: medicationContext.value.medicationType
    })
  }, [medicationContext])

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()
    medicationContext.setValue(undefined)

    clearErrors()
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
  }, [medicationContext])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(
    async (data: MedicationFields) => {
      await medicationContext.value?.updateMedication(data)

      dispatch(show(MedicationsSnackbarId.UPDATED_MEDICATION))
      dismissChanges()
    },
    [medicationContext]
  )

  return (
    <Portal>
      <Dialog
        dismissable={!isDirty}
        visible={visible}
        onDismiss={dismissChanges}
      >
        <Dialog.Title>Editar alimento</Dialog.Title>
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
        onCancel={() => dispatch(show(EDIT_MEDICATION_DIALOG_ID))}
      />
    </Portal>
  )
}

export default EditMedicationDialog

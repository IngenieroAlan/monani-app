import DismissDialog from '@/components/DismissDialog'
import MedicationForm, { MedicationFields } from '@/components/forms/MedicationForm'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { modifyMedication, setSelectedMedication } from '@/redux/slices/medicationsSlice'
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
  const visible = useAppSelector((state: RootState) => state.uiVisibility[EDIT_MEDICATION_DIALOG_ID])
  const selectedMedication = useAppSelector((state: RootState) => state.medications.selectedMedication)
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<MedicationFields>({
    defaultValues: {
      name: selectedMedication?.name ? selectedMedication.name : '',
      medicationType: selectedMedication?.medicationType ? selectedMedication.medicationType : undefined
    },
    resolver: zodResolver(MedicationSchema),
    mode: 'onTouched'
  })
  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => {
    reset({
      name: selectedMedication?.name,
      medicationType: selectedMedication?.medicationType
    })
  }, [selectedMedication])

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()
    dispatch(setSelectedMedication())

    clearErrors()
    reset()
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
  }, [])

  const showDismissDialog = useCallback(() => {
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }, [])

  const onSubmit = useCallback(
    async (data: MedicationFields) => {
      const oldName = selectedMedication!.name
      await selectedMedication!.updateMedication(data)

      dispatch(modifyMedication({ oldName: oldName, new: selectedMedication! }))
      dispatch(show(MedicationsSnackbarId.UPDATED_MEDICATION))

      dismissChanges()
    },
    [selectedMedication]
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
        onCancel={() => dispatch(show(EDIT_MEDICATION_DIALOG_ID))}
      />
    </Portal>
  )
}

export default EditMedicationDialog

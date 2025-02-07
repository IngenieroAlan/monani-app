import DismissDialog from '@/components/DismissDialog'
import MedicationForm, { MedicationFields } from '@/components/forms/MedicationForm'
import { useMedicationContext } from '@/contexts'
import Medication from '@/database/models/Medication'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { medicationsKeys } from '@/queries/medications/queryKeyFactory'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import MedicationSchema from '@/validationSchemas/MedicationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const EDIT_MEDICATION_DIALOG_ID = 'editMedicationDialog'

const DISMISS_DIALOG_ID = 'editMedicationDismissDialog'

const EditMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const medicationContext = useMedicationContext()
  const visible = useAppSelector((state) => state.uiVisibility[EDIT_MEDICATION_DIALOG_ID])
  const { control, handleSubmit, reset, clearErrors, formState } = useForm<MedicationFields>({
    resolver: zodResolver(MedicationSchema),
    mode: 'onTouched'
  })
  const { isDirty, isValid, isSubmitting } = formState
  const { mutateAsync } = useMutation({
    mutationFn: (data: MedicationFields) => {
      return medicationContext.value?.updateMedication(data) ?? Promise.resolve(undefined)
    },
    onSuccess: (data) => {
      if (!data) return

      queryClient.invalidateQueries({ queryKey: medicationsKeys.all, exact: true })
      queryClient.setQueryData<Medication>(medicationsKeys.byId(data.id), data)
    }
  })

  useEffect(() => {
    if (!medicationContext.value) return

    reset({
      name: medicationContext.value.name,
      medicationType: medicationContext.value.medicationType
    })
  }, [medicationContext])

  const dismissChanges = () => {
    Keyboard.dismiss()
    medicationContext.setValue(undefined)

    clearErrors()
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
  }

  const showDismissDialog = () => {
    dispatch(hide(EDIT_MEDICATION_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }

  const onSubmit = async (data: MedicationFields) => {
    await mutateAsync(data)

    dispatch(show(MedicationsSnackbarId.UPDATED_MEDICATION))
    dismissChanges()
  }

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
          <Button onPress={isDirty ? showDismissDialog : dismissChanges}>Cancelar</Button>
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

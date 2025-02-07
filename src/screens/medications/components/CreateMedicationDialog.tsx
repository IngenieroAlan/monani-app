import DismissDialog from '@/components/DismissDialog'
import MedicationForm, { MedicationFields } from '@/components/forms/MedicationForm'
import Medication from '@/database/models/Medication'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { medicationsKeys } from '@/queries/medications/queryKeyFactory'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import { createMedication } from '@/utils/collections/medications'
import MedicationSchema from '@/validationSchemas/MedicationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

export const CREATE_MEDICATION_DIALOG_ID = 'createMedicationDialog'

const DISMISS_DIALOG_ID = 'createMedicationDismissDialog'

const CreateMedicationDialog = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const dialogVisible = useAppSelector((state) => state.uiVisibility[CREATE_MEDICATION_DIALOG_ID])
  const { control, handleSubmit, reset, formState } = useForm<MedicationFields>({
    defaultValues: {
      name: '',
      medicationType: undefined
    },
    resolver: zodResolver(MedicationSchema),
    mode: 'onChange'
  })
  const { isDirty, isValid, isSubmitting } = formState
  const { mutateAsync } = useMutation({
    mutationFn: (data: MedicationFields) => createMedication(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: medicationsKeys.all, exact: true })
      queryClient.setQueryData<Medication>(medicationsKeys.byId(data.id), data)
    }
  })

  const dismissChanges = () => {
    Keyboard.dismiss()

    reset()
    dispatch(hide(CREATE_MEDICATION_DIALOG_ID))
  }

  const showDismissDialog = () => {
    dispatch(hide(CREATE_MEDICATION_DIALOG_ID))
    dispatch(show(DISMISS_DIALOG_ID))
  }

  const onSubmit = async (data: MedicationFields) => {
    await mutateAsync(data)

    dispatch(show(MedicationsSnackbarId.STORED_MEDICATION))
    dismissChanges()
  }

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
        onCancel={() => dispatch(show(CREATE_MEDICATION_DIALOG_ID))}
      />
    </Portal>
  )
}

export default CreateMedicationDialog

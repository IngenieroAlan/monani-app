import { CustomTextInput } from '@/components/CustomTextInput'
import { useMilkReportContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { hide, show } from '@/redux/slices/uiVisibilitySlice'
import useAppTheme from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { Button, Dialog, Portal, TextInput } from 'react-native-paper'
import { z } from 'zod'
import { MilkReportsSnackbarId } from './MilkReportsSnackbarContainer'

export const EDIT_MILK_REPORT_DIALOG_ID = 'editMilkReportDialog'

type EditMilkReport = { liters: number | string }
const EditMilkReportSchema = z.object({
  liters: z.coerce
    .number({
      required_error: 'Los litros de leche son requeridos',
      invalid_type_error: 'Se debe ingresar una cantidad de litros válida.'
    })
    .gt(0, { message: 'La cantidad de litros debe ser mayor a 0.' })
})

const EditMilkReportDialog = () => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const dialogVisible = useAppSelector((state) => state.uiVisibility[EDIT_MILK_REPORT_DIALOG_ID])
  const milkReportContext = useMilkReportContext()
  const { control, formState, handleSubmit, reset, clearErrors } = useForm<EditMilkReport>({
    resolver: zodResolver(EditMilkReportSchema),
    mode: 'all'
  })

  const { isDirty, isValid, isSubmitting, errors } = formState

  useEffect(() => {
    if (!milkReportContext.value) return

    reset({ liters: milkReportContext.value.liters.toString() })
  }, [milkReportContext])

  const dismissChanges = useCallback(() => {
    Keyboard.dismiss()
    milkReportContext.setValue(undefined)

    clearErrors()
    reset({ liters: milkReportContext.value?.liters.toString() })
    dispatch(hide(EDIT_MILK_REPORT_DIALOG_ID))
  }, [milkReportContext])

  const onSubmit = useCallback(
    async (data: EditMilkReport) => {
      await milkReportContext.value?.updateMilkReport(+data.liters)

      dispatch(show(MilkReportsSnackbarId.MILK_REPORT_UPDATED))
      dismissChanges()
    },
    [milkReportContext]
  )

  return (
    <Portal>
      <Dialog
        visible={dialogVisible}
        onDismiss={dismissChanges}
        dismissable={!isDirty}
      >
        <Dialog.Title>Editar litros de leche</Dialog.Title>
        <Dialog.Content>
          <CustomTextInput
            control={control}
            name='liters'
            label='Cantidad de litros'
            errors={errors.liters}
            helperText={errors.liters?.message || ''}
            more={{
              autoFocus: true,
              keyboardType: 'numeric',
              right: <TextInput.Affix text='L.' />,
              theme: { colors: { background: theme.colors.elevation.level3 } }
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={dismissChanges}>Cancelar</Button>
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default EditMilkReportDialog

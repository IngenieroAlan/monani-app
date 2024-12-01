import DismissDialog from '@/components/DismissDialog'
import MilkReportForm, { MilkReportFields } from '@/components/forms/MilkReportForm'
import { MilkReportsSnackbarId } from '@/components/layout/cattleDetails/Components/milkProduction/MilkReportsSnackbarContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import useAppTheme from '@/theme'
import createMilkReportSchema from '@/validationSchemas/MilkReportSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation, usePreventRemove } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { Appbar, Button, IconButton, Portal } from 'react-native-paper'

const CloseButton = ({ isDirty, isSubmitSuccessful }: { isDirty: boolean; isSubmitSuccessful: boolean }) => {
  const navigation = useNavigation()
  const [showDialog, setShowDialog] = useState(false)
  const confirmGoBack = useRef(false)

  usePreventRemove(isDirty && !isSubmitSuccessful, ({ data }) => {
    if (!confirmGoBack.current) {
      setShowDialog(true)
      return
    }

    setShowDialog(false)
    navigation.dispatch(data.action)
  })

  const onClosePress = useCallback(() => {
    Keyboard.dismiss()
    navigation.goBack()
  }, [])

  const onDismissConfirm = useCallback(() => {
    confirmGoBack.current = true
    navigation.goBack()
  }, [])

  return (
    <>
      <IconButton
        icon='close'
        onPress={onClosePress}
      />
      <Portal>
        <DismissDialog
          dismissSnackbarId={MilkReportsSnackbarId.MILK_REPORT_DISMISSED}
          visible={showDialog}
          onConfirm={onDismissConfirm}
          onCancel={() => setShowDialog(false)}
        />
      </Portal>
    </>
  )
}

const CreateMilkReportView = () => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const cattle = useAppSelector((select) => select.cattles.cattleInfo)!
  const [disabledDates, setDisabledDates] = useState<Date[]>([])
  const { control, formState, handleSubmit, trigger } = useForm<MilkReportFields>({
    defaultValues: {
      liters: 0,
      reportedAt: set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    },
    resolver: zodResolver(createMilkReportSchema(cattle)),
    mode: 'onChange'
  })

  const { isValid, isSubmitting, isDirty, isSubmitSuccessful } = formState

  useEffect(() => {
    trigger('reportedAt')
  }, [])

  useEffect(() => {
    ;(async () => {
      setDisabledDates((await cattle.pendingMilkReports).map((milkReport) => milkReport.reportedAt))
    })()
  }, [cattle])

  useEffect(() => {
    if (!isSubmitSuccessful) return

    dispatch(show(MilkReportsSnackbarId.MILK_REPORT_CREATED))
    navigation.goBack()
  }, [isSubmitSuccessful])

  const onSubmit = useCallback(async (data: MilkReportFields) => {
    await cattle.createMilkReport(data)
  }, [])

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <CloseButton
          isDirty={isDirty}
          isSubmitSuccessful={isSubmitSuccessful}
        />
        <Appbar.Content title='Reportar prod. de leche' />
        <Button
          loading={isSubmitting}
          disabled={isSubmitting || !isValid || !isDirty}
          onPress={handleSubmit(onSubmit)}
        >
          Guardar
        </Button>
      </Appbar.Header>
      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        <MilkReportForm
          control={control}
          formState={formState}
          disabledDates={disabledDates}
        />
      </View>
    </View>
  )
}

export default CreateMilkReportView

import MilkReportForm, { MilkReportFields } from '@/components/forms/MilkReportForm'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import createMilkReportSchema from '@/validationSchemas/MilkReportSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'

const CreateMilkReportView = () => {
  const theme = useAppTheme()
  const navigation = useNavigation()
  const cattle = useAppSelector((select) => select.cattles.cattleInfo)!
  const [disabledDates, setDisabledDates] = useState<Date[]>([])
  const { control, formState, handleSubmit } = useForm<MilkReportFields>({
    defaultValues: {
      liters: 0,
      reportedAt: set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    },
    resolver: zodResolver(createMilkReportSchema(cattle)),
    mode: 'onChange'
  })

  const { isValid, isSubmitting, isDirty, isSubmitSuccessful } = formState

  useEffect(() => {
    ;(async () => {
      setDisabledDates((await cattle.pendingMilkReports).map((milkReport) => milkReport.reportedAt))
    })()
  }, [cattle])

  useEffect(() => {
    if (!isSubmitSuccessful) return

    // Add show snackbar
    navigation.goBack()
  }, [isSubmitSuccessful])

  const onSubmit = useCallback(async (data: MilkReportFields) => {
    await cattle.createMilkReport(data)
  }, [])

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction />
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

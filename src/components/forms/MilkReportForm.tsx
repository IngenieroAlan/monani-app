import createMilkReportSchema from '@/validationSchemas/MilkReportSchema'
import { Control, FormState } from 'react-hook-form'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { DatePickerBaseProps } from 'react-native-ui-datepicker/lib/typescript/src/types'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import MDatePickerInput from '../MDatePickerInput'

export type MilkReportFields = z.infer<ReturnType<typeof createMilkReportSchema>>

type MilkReportFormProps = {
  control: Control<MilkReportFields>
  formState: FormState<MilkReportFields>
} & Pick<DatePickerBaseProps, 'disabledDates'>

const MilkReportForm = ({ control, formState, disabledDates }: MilkReportFormProps) => {
  const { errors } = formState

  return (
    <View style={{ gap: 16 }}>
      <CustomTextInput
        control={control}
        name='liters'
        label='Cantidad de litros'
        errors={errors.liters}
        helperText={errors.liters?.message || ''}
        more={{
          autoFocus: true,
          keyboardType: 'numeric',
          right: <TextInput.Affix text='L.' />
        }}
      />
      <MDatePickerInput
        control={control}
        name='reportedAt'
        label='Fecha de reporte'
        errors={errors.reportedAt}
        inputMode='start'
        moreDateTimePicker={{
          mode: 'single',
          disabledDates: disabledDates
        }}
      />
    </View>
  )
}

export default MilkReportForm

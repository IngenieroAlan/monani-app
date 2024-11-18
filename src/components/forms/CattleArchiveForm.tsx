import { ArchiveReason } from '@/database/models/CattleArchive'
import CattleArchiveSchema from '@/validationSchemas/CattleArchiveSchema'
import { Control, FormState } from 'react-hook-form'
import { View } from 'react-native'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import MDatePickerInput from '../MDatePickerInput'
import MDropdown, { DropdownOption } from '../MDropdown'

export type CattleArchiveFields = z.infer<typeof CattleArchiveSchema>

const dropdownOptions: DropdownOption<ArchiveReason>[] = [
  {
    label: 'Extravío',
    value: 'Extravío'
  },
  {
    label: 'Muerte',
    value: 'Muerte'
  },
  {
    label: 'Otro',
    value: 'Otro'
  }
]

const CattleArchiveForm = ({
  control,
  formState
}: {
  control: Control<CattleArchiveFields>
  formState: FormState<CattleArchiveFields>
}) => {
  const { errors } = formState

  return (
    <View style={{ gap: 16 }}>
      <MDropdown
        control={control}
        name='reason'
        label='Motivo*'
        options={dropdownOptions}
        error={errors.reason !== undefined}
        errroMessage={errors.reason?.message}
      />
      <MDatePickerInput
        control={control}
        name='archivedAt'
        errors={errors.archivedAt}
        inputMode='start'
        label='Fecha*'
      />
      <CustomTextInput
        control={control}
        name='notes'
        label='Notas'
        errors={errors.notes}
        helperText={errors.notes?.message || ''}
        more={{
          multiline: true,
          numberOfLines: 8
        }}
      />
    </View>
  )
}

export default CattleArchiveForm

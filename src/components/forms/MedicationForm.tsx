import { MedicationType } from '@/database/models/Medication'
import MedicationSchema from '@/validationSchemas/MedicationSchema'
import { Control, FormState } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import MDropdown, { DropdownOption } from '../MDropdown'

export type MedicationFields = z.infer<typeof MedicationSchema>

const dropdownOptions: DropdownOption<MedicationType>[] = [
  {
    label: 'Desparasitante',
    value: 'Desparasitante'
  },
  {
    label: 'Suplemento mineral',
    value: 'Suplemento mineral'
  },
  {
    label: 'Vitaminas',
    value: 'Vitaminas'
  },
  {
    label: 'Otro',
    value: 'Otro'
  }
]

const MedicationForm = ({
  control,
  formState
}: {
  control: Control<MedicationFields>
  formState: FormState<MedicationFields>
}) => {
  const theme = useTheme()
  const { errors, isDirty } = formState

  return (
    <View style={{ gap: 16 }}>
      <CustomTextInput
        name='name'
        control={control}
        label='Nombre*'
        errors={errors.name}
        helperText={errors.name?.message ? errors.name?.message : ''}
        more={{
          autoFocus: !isDirty,
          theme: { colors: { background: theme.colors.elevation.level3 } }
        }}
      />
      <MDropdown
        name='medicationType'
        control={control}
        label='Tipo de medicamento*'
        options={dropdownOptions}
        error={errors.medicationType !== undefined}
        errroMessage={errors.medicationType?.message}
        theme={{
          colors: { background: theme.colors.elevation.level3 }
        }}
      />
    </View>
  )
}

export default MedicationForm

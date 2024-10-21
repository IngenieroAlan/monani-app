import { FeedType } from '@/database/models/Feed'
import FeedSchema from '@/validationSchemas/FeedSchema'
import { Control, FormState } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import MDropdown, { DropdownOption } from '../MDropdown'

type FeedFields = z.infer<typeof FeedSchema>
const dropdownOptions: DropdownOption<FeedType>[] = [
  {
    label: 'Alimento',
    value: 'Alimento'
  },
  {
    label: 'Concentrado lechero',
    value: 'Concentrado lechero'
  },
  {
    label: 'Concentrado de engorda',
    value: 'Concentrado de engorda'
  }
]

const FeedForm = ({ control, formState }: { control: Control<FeedFields>; formState: FormState<FeedFields> }) => {
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
        name='feedType'
        control={control}
        label='Tipo de alimento*'
        options={dropdownOptions}
        error={errors.feedType !== undefined}
        errroMessage={errors.feedType?.message}
        theme={{
          colors: { background: theme.colors.elevation.level3 }
        }}
      />
    </View>
  )
}

export default FeedForm
